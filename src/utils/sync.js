// ==============================================================================
// GUSAC REAL-TIME SYNC UTILITY (BROADCASTCHANNEL + STORAGE EVENTS)
// Ensures any changes made in Admin automatically update in the user panel instantly
// ==============================================================================

const CHANNEL_NAME = 'gusac_live_sync_channel';
const STORAGE_KEY = 'gusac_last_sync_event';

let channel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('[Sync] BroadcastChannel not supported, falling back to storage events');
}

/**
 * Broadcast an update across all open tabs/windows
 * @param {string} type - 'SITE_CONTENT_UPDATED' | 'EVENTS_UPDATED' | 'PROJECTS_UPDATED' | 'USER_UPDATED' | 'PASSES_UPDATED'
 * @param {any} payload - optional payload data
 */
export function broadcastUpdate(type, payload = null) {
  const event = {
    type,
    payload,
    timestamp: Date.now()
  };

  // 1. Post to BroadcastChannel (same origin tabs)
  if (channel) {
    try {
      channel.postMessage(event);
    } catch (e) {
      console.warn('[Sync] BroadcastChannel postMessage error:', e);
    }
  }

  // 2. Set localStorage to trigger 'storage' event across other windows/tabs
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
    } catch (e) {
      // Storage quota or private mode fallback
    }
  }
}

/**
 * Subscribe to sync events
 * @param {function} callback - (event: { type, payload, timestamp }) => void
 * @returns {function} unsubscribe function
 */
export function subscribeToUpdates(callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Handler for BroadcastChannel
  const handleChannelMessage = (ev) => {
    if (ev.data && ev.data.type) {
      callback(ev.data);
    }
  };

  // Handler for cross-tab localStorage event
  const handleStorageEvent = (ev) => {
    if (ev.key === STORAGE_KEY && ev.newValue) {
      try {
        const parsed = JSON.parse(ev.newValue);
        if (parsed && parsed.type) {
          callback(parsed);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  };

  if (channel) {
    channel.addEventListener('message', handleChannelMessage);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleChannelMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}
