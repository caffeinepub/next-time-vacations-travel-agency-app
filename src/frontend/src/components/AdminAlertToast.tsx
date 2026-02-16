import { useEffect } from 'react';
import { useGetAdminAlerts, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

export function AdminAlertToast() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: alerts } = useGetAdminAlerts();

  useEffect(() => {
    if (!isAdmin || !alerts) return;

    // Show toast for new unviewed alerts
    const unviewedAlerts = alerts.filter(alert => !alert.viewed);
    
    if (unviewedAlerts.length > 0) {
      const latestAlert = unviewedAlerts[0];
      
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            New Booking Received!
          </div>
          <div className="text-sm">
            <div><strong>{latestAlert.userName}</strong> booked <strong>{latestAlert.cruiseName}</strong></div>
            <div className="text-muted-foreground">
              {Number(latestAlert.numberOfCabins)} cabin(s) • ${Number(latestAlert.totalCost).toLocaleString()}
            </div>
          </div>
        </div>,
        {
          duration: 8000,
          position: 'top-right',
        }
      );
    }
  }, [alerts, isAdmin]);

  return null;
}
