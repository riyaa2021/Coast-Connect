// src/hooks/useRealTimeUpdates.ts
import { useState, useEffect, useCallback } from 'react';
import { useSocialContext } from '../contexts/SocialContext';
import { useReportsContext } from '../contexts/ReportsContext';

interface RealTimeUpdateOptions {
  enableSocialUpdates?: boolean;
  enableReportUpdates?: boolean;
  location?: { lat: number; lng: number };
  updateInterval?: number; // in milliseconds
}

const useRealTimeUpdates = (options: RealTimeUpdateOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const { subscribeToRealTimeUpdates: subscribeSocial, unsubscribeFromUpdates: unsubscribeSocial } = useSocialContext();
  const { updateSocialMentions } = useReportsContext();
  
  const {
    enableSocialUpdates = true,
    enableReportUpdates = true,
    location,
    updateInterval = 30000, // 30 seconds default
  } = options;

  const startUpdates = useCallback(() => {
    try {
      setConnectionError(null);
      setIsConnected(true);
      
      // Start social media updates if enabled
      if (enableSocialUpdates) {
        const unsubscribe = subscribeSocial(location);
        
        // Store the unsubscribe function for cleanup
        return unsubscribe;
      }
      
      return () => {}; // Return empty cleanup function if no subscriptions
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to start real-time updates');
      setIsConnected(false);
      return () => {};
    }
  }, [enableSocialUpdates, subscribeSocial, location]);

  const stopUpdates = useCallback(() => {
    try {
      if (enableSocialUpdates) {
        unsubscribeSocial();
      }
      setIsConnected(false);
      setLastUpdate(null);
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to stop real-time updates');
    }
  }, [enableSocialUpdates, unsubscribeSocial]);

  // Simulate periodic updates for reports
  useEffect(() => {
    if (!enableReportUpdates || !isConnected) return;

    const interval = setInterval(async () => {
      try {
        // In a real implementation, this would receive updates from WebSocket
        // For now, we'll simulate by triggering social mention updates
        setLastUpdate(new Date());
        
        // Optionally trigger social mention updates for recent reports
        // This simulates the NLP service processing new social data
        if (Math.random() > 0.7) { // 30% chance of update
          // This would be triggered by actual WebSocket messages in production
          console.log('Simulated real-time social update');
        }
      } catch (error: any) {
        setConnectionError(error.message);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enableReportUpdates, isConnected, updateInterval, updateSocialMentions]);

  // Auto-start updates when component mounts
  useEffect(() => {
    const cleanup = startUpdates();
    
    return () => {
      cleanup();
      stopUpdates();
    };
  }, [startUpdates, stopUpdates]);

  // Heartbeat to check connection status
  useEffect(() => {
    if (!isConnected) return;

    const heartbeat = setInterval(() => {
      // In a real WebSocket implementation, this would ping the server
      // For simulation, we'll just update the last update time
      setLastUpdate(new Date());
    }, 60000); // 1 minute heartbeat

    return () => clearInterval(heartbeat);
  }, [isConnected]);

  const reconnect = useCallback(async () => {
    try {
      stopUpdates();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      startUpdates();
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to reconnect');
    }
  }, [startUpdates, stopUpdates]);

  const getConnectionStatus = useCallback(() => {
    if (connectionError) return 'error';
    if (isConnected) return 'connected';
    return 'disconnected';
  }, [isConnected, connectionError]);

  const getTimeSinceLastUpdate = useCallback(() => {
    if (!lastUpdate) return null;
    return Date.now() - lastUpdate.getTime();
  }, [lastUpdate]);

  return {
    isConnected,
    connectionError,
    lastUpdate,
    startUpdates,
    stopUpdates,
    reconnect,
    getConnectionStatus,
    getTimeSinceLastUpdate,
  };
};

export default useRealTimeUpdates;