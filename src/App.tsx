import { useNuiContext } from '@/context/NuiContext';
import { fetchNui } from '@/utils/fetchNui';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

            <Badge variant="default" className="mt-2">
              Press F1 to toggle this UI
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <MainUI />
    </>
  );
}

export default App;
