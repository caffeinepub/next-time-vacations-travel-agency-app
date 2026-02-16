import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole, useAssignUserRole } from '../hooks/useQueries';
import { UserRole } from '../backend';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminSettingsDialog({ open, onOpenChange }: AdminSettingsDialogProps) {
  const { identity } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const assignUserRole = useAssignUserRole();

  const isAdmin = userRole === UserRole.admin;
  const principalId = identity?.getPrincipal().toString() || '';

  const handleAssignAdmin = async () => {
    if (!identity) {
      toast.error('Please log in first');
      return;
    }

    try {
      await assignUserRole.mutateAsync({
        user: identity.getPrincipal(),
        role: UserRole.admin,
      });
      toast.success('Admin role assigned successfully! You now have full admin access.');
    } catch (error: any) {
      console.error('Error assigning admin role:', error);
      toast.error(error.message || 'Failed to assign admin role. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-ocean-600" />
            Admin Settings
          </DialogTitle>
          <DialogDescription>
            Manage your admin privileges and access control settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Current Status</h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role:</span>
                {roleLoading ? (
                  <Badge variant="outline">Loading...</Badge>
                ) : (
                  <Badge variant={isAdmin ? 'default' : 'secondary'} className={isAdmin ? 'bg-ocean-600' : ''}>
                    {userRole || 'guest'}
                  </Badge>
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm text-muted-foreground">Principal ID:</span>
                <span className="text-xs font-mono text-right break-all max-w-[300px]">{principalId}</span>
              </div>
            </div>
          </div>

          {/* Admin Access Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Admin Access</h3>
            
            {isAdmin ? (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  You have admin privileges. You can access all admin features including:
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Add and update cruise deals</li>
                    <li>View all bookings</li>
                    <li>Manage booking alerts</li>
                    <li>Access admin dashboard</li>
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You currently don't have admin privileges. Click the button below to assign yourself the admin role.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Button */}
          {!isAdmin && (
            <div className="pt-2">
              <Button
                onClick={handleAssignAdmin}
                disabled={assignUserRole.isPending || roleLoading}
                className="w-full bg-ocean-600 hover:bg-ocean-700"
              >
                {assignUserRole.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Assigning Admin Role...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Assign Admin Role
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This will grant you full admin access to all features
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="pt-2">
              <p className="text-sm text-center text-muted-foreground">
                Your admin privileges are active and will persist across sessions.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
