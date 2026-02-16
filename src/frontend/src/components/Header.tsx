import { Anchor, Menu, Heart, Calendar, Shield, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FavoritesDialog } from './FavoritesDialog';
import { UserBookingsDialog } from './UserBookingsDialog';
import { AdminDashboardDialog } from './AdminDashboardDialog';
import { AdminSettingsDialog } from './AdminSettingsDialog';
import { useIsCallerAdmin, useHasViewingAlerts } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: hasAlerts } = useHasViewingAlerts();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
    } else {
      try {
        await login();
        toast.success('Welcome! You are now logged in');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Featured Deals', href: '#deals' },
    { label: 'Search Cruises', href: '#search' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/generated/next-time-vacations-logo-transparent.dim_200x200.png" 
              alt="Next Time Vacations" 
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-ocean-600 dark:text-ocean-400">Next Time Vacations</span>
              <span className="text-xs text-muted-foreground">Your Dream Cruise Awaits</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-ocean-600 dark:hover:text-ocean-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFavorites(true)}
                  className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBookings(true)}
                  className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAdminSettings(true)}
                  className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400"
                  title="Admin Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAdminDashboard(true)}
                      className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 relative"
                    >
                      <Bell className="h-5 w-5" />
                      {hasAlerts && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAdminDashboard(true)}
                      className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400"
                    >
                      <Shield className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={isAuthenticated ? '' : 'bg-ocean-600 hover:bg-ocean-700 text-white'}
            >
              {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground/80 hover:text-ocean-600 dark:hover:text-ocean-400 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                {isAuthenticated && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFavorites(true);
                        setIsOpen(false);
                      }}
                      className="justify-start"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      My Favorites
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowBookings(true);
                        setIsOpen(false);
                      }}
                      className="justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAdminSettings(true);
                        setIsOpen(false);
                      }}
                      className="justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Settings
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAdminDashboard(true);
                            setIsOpen(false);
                          }}
                          className="justify-start relative"
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Booking Alerts
                          {hasAlerts && (
                            <Badge variant="destructive" className="ml-auto">New</Badge>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAdminDashboard(true);
                            setIsOpen(false);
                          }}
                          className="justify-start"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </>
                    )}
                  </>
                )}
                <Button
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  className={isAuthenticated ? '' : 'bg-ocean-600 hover:bg-ocean-700 text-white'}
                >
                  {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {isAuthenticated && (
        <>
          <FavoritesDialog open={showFavorites} onOpenChange={setShowFavorites} />
          <UserBookingsDialog open={showBookings} onOpenChange={setShowBookings} />
          <AdminSettingsDialog open={showAdminSettings} onOpenChange={setShowAdminSettings} />
          {isAdmin && (
            <AdminDashboardDialog open={showAdminDashboard} onOpenChange={setShowAdminDashboard} />
          )}
        </>
      )}
    </>
  );
}
