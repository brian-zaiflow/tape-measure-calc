import { useRegisterSW } from '@/hooks/useRegisterSW';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
  const { offlineReady, needRefresh, updateApp, close } = useRegisterSW();

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {offlineReady ? (
              <div>
                <h3 className="font-semibold text-sm">App ready to work offline</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You can now use this app without an internet connection
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-sm">New version available!</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Click reload to update to the latest version
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={close}
            className="h-6 w-6 p-0 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          {needRefresh && (
            <Button
              onClick={updateApp}
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload
            </Button>
          )}
          <Button
            onClick={close}
            variant="outline"
            size="sm"
            className={needRefresh ? 'flex-1' : 'w-full'}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
