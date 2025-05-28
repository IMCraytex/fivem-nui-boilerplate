import { useNuiContext, useUiComponent } from './context/NuiContext';
import { fetchNui } from './utils/fetchNui';
import { useState } from 'react';

// Define the InventoryItem interface
interface InventoryItem {
  id: string | number;
  name: string;
  quantity: number;
}

// Component for the inventory UI
const InventoryUI = () => {
  const { isVisible, data, hide } = useUiComponent('inventory');
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inventory</h2>
          <button 
            onClick={() => {
              fetchNui('close', { component: 'inventory' });
              hide();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="font-semibold mb-2">Items</h3>
            {data?.items?.length > 0 ? (
                <ul className="space-y-2">
                {data.items.map((item: InventoryItem) => (
                  <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                  </li>
                ))}
                </ul>
            ) : (
              <p className="text-gray-400 italic">No items available</p>
            )}
          </div>
          
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="font-semibold mb-2">Cash</h3>
            <p>${data?.cash || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for notifications
const NotificationUI = () => {
  const { isVisible, data } = useUiComponent('notification');
  
  if (!isVisible) return null;
  
  const getNotificationClass = () => {
    switch(data?.type) {
      case 'error': return 'bg-red-500';
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <div className="fixed top-5 right-5 max-w-md">
      <div className={`${getNotificationClass()} text-white p-4 rounded-lg shadow-lg`}>
        {data?.message || 'Notification'}
      </div>
    </div>
  );
};

// Main App component
function App() {
  const { visible, serverData } = useNuiContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Legacy main UI component using the old visible prop
  const MainUI = () => {
    if (!visible) return null;
    
    const handleClose = async () => {
      try {
        await fetchNui('close');
      } catch (err) {
        console.error('Error closing UI:', err);
      }
    };
    
    const handleGetServerData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await fetchNui('getServerData');
      } catch (err) {
        console.error('Error fetching server data:', err);
        setError('Failed to fetch server data. Check the console for details.');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">FiveM NUI Boilerplate</h2>
            <button 
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded">
              <h3 className="font-semibold mb-2">Server Data</h3>
              {serverData ? (
                <pre className="text-sm overflow-auto max-h-40">
                  {JSON.stringify(serverData, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-400 italic">No server data available</p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-900/50 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGetServerData}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 disabled:opacity-50 text-white py-2 rounded flex items-center justify-center"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>Get Server Data</span>
              )}
            </button>

            <p className="text-sm text-gray-400 mt-4">
              Press F1 to toggle this UI
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MainUI />
      <InventoryUI />
      <NotificationUI />
    </>
  );
}

export default App;
