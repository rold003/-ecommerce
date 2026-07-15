import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '@/config/analytics';

export function useAnalyticsPageview(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
}
