// src/services/index.ts
export { apiClient, endpoints } from './api';
export { default as api } from './api';


export { default as socialMediaService } from './socialMediaService';

export { default as nlpService } from './nlpService';

export {RealtimeService} from './realtimeService';
export { default as realtimeService } from './realtimeService';

// Re-export types that might be useful
export type {
  NLPBatchRequest,
  NLPBatchResponse
} from './nlpService';

export type {
  RealtimeEvent,
  RealtimeMessage,
  RealtimeSubscription
} from './realtimeService';