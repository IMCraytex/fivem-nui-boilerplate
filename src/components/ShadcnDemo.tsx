import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { fetchNui } from '../utils/fetchNui';

// Demo component to showcase shadcn/ui components in FiveM
export const ShadcnDemo = () => {
  const [showAlert, setShowAlert] = useState(false);
  
  const handleServerAction = async () => {
    try {
      // Example of calling a server event
      await fetchNui('serverAction', { action: 'demo' });
      setShowAlert(true);
      // Auto-hide alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Shadcn/UI with FiveM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This demo shows how shadcn/ui components can be integrated with FiveM NUI.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <Button variant="default" onClick={handleServerAction}>
              Trigger Server Action
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            All components are fully compatible with FiveM NUI
          </p>
        </CardFooter>
      </Card>

      {/* Alert demonstration */}
      {showAlert && (
        <Alert className="animate-in fade-in-0 slide-in-from-top-5 duration-300">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Server action completed successfully.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
