import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle, ExternalLink, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useGetBackendDiagnostics } from '../hooks/useQueries';

export function AppStatusLiveLinkSection() {
  const [copied, setCopied] = useState(false);
  const { data: diagnostics, isLoading: diagnosticsLoading, error: diagnosticsError } = useGetBackendDiagnostics();

  // Compute the current app URL from the browser location
  const currentAppUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentAppUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp / BigInt(1000000)));
      return date.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">App Status & Live Link</h3>
        
        {/* Live URL Display */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Your Live App URL:</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded px-3 py-2 text-sm font-mono break-all">
                {currentAppUrl}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="shrink-0"
              >
                <a href={currentAppUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </a>
              </Button>
            </div>
          </div>

          {/* Backend Diagnostics */}
          <div className="pt-3 border-t space-y-2">
            <label className="text-sm text-muted-foreground">Backend Diagnostics:</label>
            {diagnosticsLoading ? (
              <div className="text-sm text-muted-foreground">Loading diagnostics...</div>
            ) : diagnosticsError ? (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Diagnostics could not be loaded. The backend may be unreachable.
                </AlertDescription>
              </Alert>
            ) : diagnostics ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backend Version:</span>
                  <span className="font-mono">{diagnostics.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-mono text-xs">{formatTimestamp(diagnostics.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-xs">Backend is reachable</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Going Live Checklist */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-ocean-600" />
          Going Live Checklist
        </h3>
        <Alert className="border-ocean-200 bg-ocean-50 dark:bg-ocean-950 dark:border-ocean-800">
          <AlertDescription className="text-sm space-y-2">
            <p className="font-medium text-ocean-900 dark:text-ocean-100">
              Verify your app is live and working:
            </p>
            <ul className="list-disc list-inside space-y-1 text-ocean-800 dark:text-ocean-200">
              <li>
                <strong>Test in incognito/private window:</strong> Open the URL above in a private browsing window to verify it loads correctly for new visitors.
              </li>
              <li>
                <strong>Check backend connection:</strong> If diagnostics load successfully above, your backend is reachable and responding.
              </li>
              <li>
                <strong>Share the link:</strong> Copy the URL above and share it with anyone. They can access your app directly without logging in.
              </li>
              <li>
                <strong>Bookmark for later:</strong> Save the URL to access your live app anytime.
              </li>
            </ul>
            <p className="text-xs text-ocean-700 dark:text-ocean-300 pt-2">
              Note: This URL is your permanent live app link. It will remain the same across updates.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
