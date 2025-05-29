import { useNuiContext, useUiComponent } from './context/NuiContext';
import { fetchNui } from './utils/fetchNui';
import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';

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
      <Card className="w-96">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory</CardTitle>
            <Button 
              variant="destructive"
              onClick={() => {
                fetchNui('close', { component: 'inventory' });
                hide();
              }}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardContent className="pt-6">
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
                <p className="text-muted-foreground italic">No items available</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Cash</h3>
              <p>${data?.cash || 0}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for notifications
const NotificationUI = () => {
  const { isVisible, data } = useUiComponent('notification');
  
  if (!isVisible) return null;
  
  const getVariant = () => {
    return data?.type === 'error' ? 'destructive' : 'default';
  };
  
  return (
    <div className="fixed top-5 right-5 max-w-md">
      <Alert variant={getVariant()}>
        <AlertTitle>{data?.title || (data?.type || 'Info')}</AlertTitle>
        <AlertDescription>
          {data?.message || 'Notification message'}
        </AlertDescription>
      </Alert>
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
        <Card className="w-96 bg-card text-card-foreground">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>FiveM NUI Boilerplate</CardTitle>
              <Button variant="destructive" onClick={handleClose}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Server Data</h3>
                {serverData ? (
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(serverData, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground italic">No server data available</p>
                )}
              </CardContent>
            </Card>

            {error && (
              <div className="p-4 bg-destructive/20 rounded text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleGetServerData}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Get Server Data'}
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Press F1 to toggle this UI
            </p>
          </CardContent>
        </Card>
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
