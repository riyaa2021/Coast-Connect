// src/services/realtimeService.ts
import { type SocialMention,type HazardReport } from '../types';

export type RealtimeEvent = 'mention_update' | 'report_update' | 'alert' | 'system_status';

export interface RealtimeMessage {
  type: RealtimeEvent;
  data: any;
  timestamp: string;
  id: string;
}

export interface RealtimeSubscription {
  id: string;
  type: 'location' | 'report' | 'global';
  params?: {
    lat?: number;
    lng?: number;
    radius?: number;
    reportId?: string;
  };
  callback: (message: RealtimeMessage) => void;
}

export class RealtimeService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;

  constructor (private wsUrl: string = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws') {}

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      // Wait for connection to open
      await new Promise((resolve, reject) => {
        if (!this.ws) return reject(new Error('WebSocket failed to initialize'));

        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        
        this.ws.onopen = (event) => {
          clearTimeout(timeout);
          this.handleOpen(event);
          resolve(event);
        };
        
        this.ws.onerror = (event) => {
          clearTimeout(timeout);
          reject(new Error('WebSocket connection failed'));
        };
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.subscriptions.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  /**
   * Subscribe to location-based updates
   */
  subscribeToLocation(
    lat: number,
    lng: number,
    radius: number = 10,
    callback: (mention: SocialMention) => void
  ): string {
    const id = this.generateId();
    const subscription: RealtimeSubscription = {
      id,
      type: 'location',
      params: { lat, lng, radius },
      callback: (message) => {
        if (message.type === 'mention_update') {
          callback(message.data as SocialMention);
        }
      }
    };

    this.subscriptions.set(id, subscription);
    
    if (this.isConnected()) {
      this.sendMessage({
        type: 'subscribe_location',
        data: { lat, lng, radius },
        id
      });
    }

    return id;
  }

  /**
   * Subscribe to report-specific updates
   */
  subscribeToReport(
    reportId: string,
    callback: (update: { report: HazardReport; type: 'status' | 'social' | 'verification' }) => void
  ): string {
    const id = this.generateId();
    const subscription: RealtimeSubscription = {
      id,
      type: 'report',
      params: { reportId },
      callback: (message) => {
        if (message.type === 'report_update') {
          callback(message.data);
        }
      }
    };

    this.subscriptions.set(id, subscription);
    
    if (this.isConnected()) {
      this.sendMessage({
        type: 'subscribe_report',
        data: { reportId },
        id
      });
    }

    return id;
  }

  /**
   * Subscribe to global alerts and system updates
   */
  subscribeToGlobal(
    callback: (alert: { level: 'info' | 'warning' | 'critical'; message: string; data?: any }) => void
  ): string {
    const id = this.generateId();
    const subscription: RealtimeSubscription = {
      id,
      type: 'global',
      callback: (message) => {
        if (message.type === 'alert' || message.type === 'system_status') {
          callback(message.data);
        }
      }
    };

    this.subscriptions.set(id, subscription);
    
    if (this.isConnected()) {
      this.sendMessage({
        type: 'subscribe_global',
        data: {},
        id
      });
    }

    return id;
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription && this.isConnected()) {
      this.sendMessage({
        type: 'unsubscribe',
        data: { subscriptionId },
        id: subscriptionId
      });
    }
    
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Send a message to the server
   */
  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
        id: message.id || this.generateId()
      }));
    }
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(event: Event): void {
    console.log('WebSocket connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;

    // Re-establish all subscriptions
    this.subscriptions.forEach((subscription) => {
      switch (subscription.type) {
        case 'location':
          if (subscription.params) {
            this.sendMessage({
              type: 'subscribe_location',
              data: subscription.params,
              id: subscription.id
            });
          }
          break;
        case 'report':
          if (subscription.params?.reportId) {
            this.sendMessage({
              type: 'subscribe_report',
              data: { reportId: subscription.params.reportId },
              id: subscription.id
            });
          }
          break;
        case 'global':
          this.sendMessage({
            type: 'subscribe_global',
            data: {},
            id: subscription.id
          });
          break;
      }
    });

    // Start heartbeat
    this.startHeartbeat();
  }

  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: RealtimeMessage = JSON.parse(event.data);
      
      // Handle different message types
      switch (message.type) {
        case 'mention_update':
        case 'report_update':
        case 'alert':
        case 'system_status':
          this.subscriptions.forEach((subscription) => {
            subscription.callback(message);
          });
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket closed:', event.code, event.reason);
    this.ws = null;
    this.isConnecting = false;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Attempt to reconnect if it wasn't a clean close
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.isConnecting = false;
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts); // Exponential backoff
    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts + 1})`);

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
        this.scheduleReconnect();
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({
          type: 'ping',
          data: { timestamp: Date.now() }
        });
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current connection status
   */
  getStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (this.isConnecting) return 'connecting';
    if (this.ws === null) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

// Create and export singleton instance
export const realtimeService = new RealtimeService();

export default realtimeService;