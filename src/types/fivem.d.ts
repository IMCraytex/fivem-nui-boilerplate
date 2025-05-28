/**
 * Type definitions for FiveM NUI environment
 */

interface Window {
  /**
   * Native function to invoke FiveM client functions from the browser.
   * Only available in the FiveM NUI environment, not in a regular browser.
   */
  invokeNative?: (eventName: string, eventData: string) => void;
}

/**
 * FiveM client exports interface
 */
declare interface ClientExports {
  [resourceName: string]: {
    [exportName: string]: Function;
  };
}

/**
 * FiveM global exports variable
 */
declare const exports: ClientExports;
