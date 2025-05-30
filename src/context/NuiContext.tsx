import React, { createContext, useContext, useEffect, useState } from 'react';
import { onNuiEvent, isEnvBrowser, mockNuiEvents } from '@/utils/fetchNui';
import { config } from '@/utils/config';

// Define the structure for different UI components/screens
export interface UiComponent {
  id: string;
  visible: boolean;
  data?: any;
}

interface NuiContextValue {
  // Main visibility state (legacy support)
  visible: boolean;
  // Dynamic UI components registry
  uiComponents: Record<string, UiComponent>;
  // Legacy serverData support
  serverData: any | null;
  // Methods
  setVisible: (visible: boolean) => void;
  registerUiComponent: (componentId: string, initialData?: any) => void;
  showComponent: (componentId: string, data?: any) => void;
  hideComponent: (componentId: string) => void;
  getComponentData: (componentId: string) => any;
  isComponentVisible: (componentId: string) => boolean;
}

const NuiContext = createContext<NuiContextValue>({
  visible: false,
  uiComponents: {},
  serverData: null,
  setVisible: () => {},
  registerUiComponent: () => {},
  showComponent: () => {},
  hideComponent: () => {},
  getComponentData: () => null,
  isComponentVisible: () => false,
});

export const NuiProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Keep legacy state for backward compatibility
  const [visible, setVisible] = useState(false);
  const [serverData, setServerData] = useState<any | null>(null);
  
  // New dynamic UI components state
  const [uiComponents, setUiComponents] = useState<Record<string, UiComponent>>({});

  // Register a new UI component
  const registerUiComponent = (componentId: string, initialData?: any) => {
    setUiComponents(prev => {
      // Only register if it doesn't exist yet
      if (!prev[componentId]) {
        return {
          ...prev,
          [componentId]: {
            id: componentId,
            visible: false,
            data: initialData || null
          }
        };
      }
      return prev;
    });
  };

  // Show a specific UI component
  const showComponent = (componentId: string, data?: any) => {
    setUiComponents(prev => {
      if (!prev[componentId]) {
        // Auto-register if not registered
        return {
          ...prev,
          [componentId]: {
            id: componentId,
            visible: true,
            data: data || null
          }
        };
      }
      
      // Update existing component
      return {
        ...prev,
        [componentId]: {
          ...prev[componentId],
          visible: true,
          data: data !== undefined ? data : prev[componentId].data
        }
      };
    });
  };

  // Hide a specific UI component
  const hideComponent = (componentId: string) => {
    setUiComponents(prev => {
      if (!prev[componentId]) return prev;
      
      return {
        ...prev,
        [componentId]: {
          ...prev[componentId],
          visible: false
        }
      };
    });
  };

  // Get component data
  const getComponentData = (componentId: string) => {
    return uiComponents[componentId]?.data || null;
  };

  // Check if component is visible
  const isComponentVisible = (componentId: string) => {
    return uiComponents[componentId]?.visible || false;
  };

  useEffect(() => {
    // Legacy support for UI visibility
    const unsubscribeVisibility = onNuiEvent<{status: boolean}>('ui', (data: {status: boolean}) => {
      setVisible(data.status);
    });

    // Legacy support for server data
    const unsubscribeServerData = onNuiEvent<any>('serverData', (data: any) => {
      setServerData(data);
    });

    // Dynamic UI component message handler
    const unsubscribeComponentMessages = onNuiEvent<{
      componentId: string;
      action: 'show' | 'hide' | 'update';
      data?: any;
    }>('component', (message) => {
      const { componentId, action, data } = message;
      
      if (!componentId) {
        console.warn('[NuiContext] Received component message without componentId');
        return;
      }

      switch(action) {
        case 'show':
          showComponent(componentId, data);
          break;
        case 'hide':
          hideComponent(componentId);
          break;
        case 'update':
          // Only update data without changing visibility
          setUiComponents(prev => ({
            ...prev,
            [componentId]: {
              ...prev[componentId] || { id: componentId, visible: false },
              data: data
            }
          }));
          break;
        default:
          console.warn(`[NuiContext] Unknown component action: ${action}`);
      }
    });

    // For development in browser
    if (isEnvBrowser()) {
      if (config.debug) {
        console.log('[NuiContext] Running in browser mode, mocking NUI events');
      }
      mockNuiEvents();
      // Auto-show UI in browser for development
      setVisible(true);
      
      // Register and show some example components for development
      showComponent('main', { title: 'Main Interface' });
    }

    // Clean up event listeners
    return () => {
      unsubscribeVisibility();
      unsubscribeServerData();
      unsubscribeComponentMessages();
    };
  }, []);

  return (
    <NuiContext.Provider value={{ 
      visible, 
      serverData, 
      setVisible,
      uiComponents,
      registerUiComponent,
      showComponent,
      hideComponent,
      getComponentData,
      isComponentVisible
    }}>
      {children}
    </NuiContext.Provider>
  );
};

export const useNuiContext = () => useContext(NuiContext);

// Custom hook to work with a specific UI component
export const useUiComponent = (componentId: string, initialData?: any) => {
  const { 
    registerUiComponent, 
    showComponent, 
    hideComponent, 
    getComponentData, 
    isComponentVisible 
  } = useNuiContext();
  
  useEffect(() => {
    // Register this component when the hook is used
    registerUiComponent(componentId, initialData);
  }, [componentId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isVisible: isComponentVisible(componentId),
    data: getComponentData(componentId),
    show: (data?: any) => showComponent(componentId, data),
    hide: () => hideComponent(componentId),
    update: (data: any) => showComponent(componentId, data)
  };
};
