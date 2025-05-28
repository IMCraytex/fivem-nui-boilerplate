// This file contains environment-specific configuration

interface EnvironmentConfig {
  debug: boolean;
}

// Default configuration
export const config: EnvironmentConfig = {
  // Set to true for development, false for production
  debug: true
};

// Add type declarations for FiveM native functions
declare global {
  interface Window {
    GetParentResourceName?: () => string;
    invokeNative?: (eventName: string, eventData: string) => void;
  }
}

// Export a helper to get the resource name
export const getResourceName = (): string => {
  // For browser development, try to detect the resource name from the URL
  if (process.env.NODE_ENV !== 'production') {
    try {
      // First try to use the FiveM native function if available (newer versions use this)
      if (window.GetParentResourceName) {
        return window.GetParentResourceName();
      }
      
      // Fallback to URL detection for browser development
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1 && pathParts[1] !== '') {
        return pathParts[1];
      }
    } catch (e) {
      console.error('Failed to auto-detect resource name:', e);
    }
  }
  
  // For production, we should always have the FiveM native function available
  try {
    if (window.GetParentResourceName) {
      return window.GetParentResourceName();
    }
  } catch (e) {
    console.error('Failed to get resource name from FiveM API:', e);
  }
  
  // Fallback to a default name in case of unexpected errors
  return 'cfx-tcd-testnui';  // Update this to match your actual resource name
};

// Helper to check if we're in a browser environment (not in FiveM)
export const isEnvBrowser = (): boolean => {
  return !window.invokeNative && !window.GetParentResourceName;
};