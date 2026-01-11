import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getRedirectUrlForRole } from '../utils/subdomainUtils';

/**
 * Enforces the correct subdomain based on the user's role.
 * If a Manager is on the root domain, it redirects to the manager subdomain.
 * If a Driver is on the root domain, it redirects to the driver subdomain.
 */
export function SubdomainEnforcer({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading || !user) return;

        const hostname = window.location.hostname;
        const role = user.role;

        // Don't enforce on localhost if it might cause DNS issues for the user
        // unless they specifically want to test subdomains locally.
        // If they are using manager.localhost, we are already good.
        // If they hit localhost:5173 but are a MANAGER, we might want to redirect
        // but only if we ARE in a mode that supports it.

        const isProd = hostname.includes('.onrender.com') || hostname.includes('.railway.app') || hostname.includes('.jshs.app');
        const currentSubdomain = hostname.split('.')[0];

        if (role === 'MANAGER' && currentSubdomain !== 'manager') {
            if (isProd || hostname === 'localhost' || hostname === '127.0.0.1') {
                const target = getRedirectUrlForRole('MANAGER', window.location.pathname);
                // Only redirect if the target is different from current
                if (window.location.href !== target) {
                    console.log('Redirecting to manager subdomain:', target);
                    window.location.href = target;
                }
            }
        } else if (role === 'DRIVER' && currentSubdomain !== 'driver') {
            if (isProd) {
                const target = getRedirectUrlForRole('DRIVER', window.location.pathname);
                if (window.location.href !== target) {
                    window.location.href = target;
                }
            }
        }
    }, [user, isLoading]);

    return <>{children}</>;
}
