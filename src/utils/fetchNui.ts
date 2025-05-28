/**
 * This file contains utility functions for FiveM NUI <-> Lua communication
 */
import { getResourceName, config } from './config';

interface NuiMessageData {
  type: string;
  [key: string]: any;
}

/**
 * Send data from React to FiveM client script
 * @param action The action to target
 * @param data Any data to send along with the action
 */
export const fetchNui = async <T = any>(
  action: string, 
  data: any = {}
): Promise<T> => {
  // Create a promise that will be resolved once the response is received
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  // Use the resource name from config
  const resourceName = getResourceName();

  if (config.debug) {
    console.log(`[fetchNui] Sending request to ${resourceName}/${action}`, data);
  }

  try {
    const resp = await fetch(`https://${resourceName}/${action}`, options);
    const respFormatted = await resp.json();
    
    if (config.debug) {
      console.log(`[fetchNui] Response from ${action}:`, respFormatted);
    }
    
    return respFormatted;
  } catch (error) {
    // Handle the error when running in a browser
    if (process.env.NODE_ENV !== 'production') {
      console.error('[fetchNui] Error:', error);
      // Return mock data for browser development
      return {} as T;
    }
    throw error;
  }
};

/**
 * Register a callback for an NUI message from FiveM client script
 * @param action The action to listen for
 * @param callback The callback function
 */
export const onNuiEvent = <T = any>(
  action: string, 
  callback: (data: T) => void
): (() => void) => {
  const listener = (event: MessageEvent<NuiMessageData>) => {
    const { type, ...data } = event.data;
    
    if (type === action) {
      if (config.debug) {
        console.log(`[onNuiEvent] Received ${action} event:`, data);
      }
      callback(data as unknown as T);
    }
  };

  window.addEventListener('message', listener);
  
  // Return a function to remove the event listener
  return () => window.removeEventListener('message', listener);
};

/**
 * Only used for development in a browser
 * Mocks the NUI event listeners and message handlers
 */
export const mockNuiEvents = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[mockNuiEvents] Simulating NUI events for browser development');
    
    // Simulate UI visibility event
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'ui',
          status: true,
        },
      })
    );
    
    // Simulate some mock server data
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'serverData',
            serverTime: new Date().getTime(),
            playerName: 'Development User',
            playerId: 1,
            playerCount: 32
          },
        })
      );
    }, 1000);
  }
};

/**
 * Get if the NUI is currently visible
 * @returns whether the NUI is currently visible
 */
export const isEnvBrowser = (): boolean => {
  return !(window as any).invokeNative;
};
