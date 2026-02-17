import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetHistory, useClearHistory, useDeleteHistoryItem, useReRunHistoryItem } from '../hooks/useQueries';
import AuthGate from '../components/auth/AuthGate';
import ProfileSetupDialog from '../components/auth/ProfileSetupDialog';
import HistoryList from '../components/history/HistoryList';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function HistoryContent() {
  const { data: history, isLoading, error } = useGetHistory();
  const clearHistory = useClearHistory();
  const deleteItem = useDeleteHistoryItem();
  const reRunItem = useReRunHistoryItem();

  const handleClearAll = async () => {
    try {
      await clearHistory.mutateAsync();
      toast.success('History cleared successfully');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleReRun = async (id: bigint) => {
    try {
      const result = await reRunItem.mutateAsync(id);
      toast.success('Calculation re-run successfully');
      // Could navigate to solver page with result here
    } catch (error) {
      toast.error('Failed to re-run calculation');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading your calculation history..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load history. Please try again." />;
  }

  if (!history || history.length === 0) {
    return (
      <EmptyState 
        title="No calculations yet"
        message="Your solved problems will appear here. Start by solving a problem!"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calculation History</CardTitle>
            <CardDescription>
              {history.length} {history.length === 1 ? 'calculation' : 'calculations'} saved
            </CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your calculation history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <HistoryList 
          items={history}
          onDelete={handleDelete}
          onReRun={handleReRun}
        />
      </CardContent>
    </Card>
  );
}

export default function HistoryPage() {
  const { identity } = useInternetIdentity();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AuthGate>
        <ProfileSetupDialog />
        <HistoryContent />
      </AuthGate>
    </div>
  );
}
