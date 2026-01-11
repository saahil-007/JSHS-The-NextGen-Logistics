
export type AppType = 'MANAGER' | 'DRIVER' | 'CUSTOMER';

export const getAppType = (): AppType => {
    if (typeof window === 'undefined') return 'CUSTOMER';
    const hostname = window.location.hostname;

    // Subdomain detection (works for manager.localhost, manager.onrender.com, manager.railway.app)
    if (hostname.startsWith('manager.')) return 'MANAGER';
    if (hostname.startsWith('driver.')) return 'DRIVER';

    // Local development overrides via query param ?app=manager | ?app=driver
    const urlParams = new URLSearchParams(window.location.search);
    const appParam = urlParams.get('app');
    if (appParam?.toLowerCase() === 'manager') return 'MANAGER';
    if (appParam?.toLowerCase() === 'driver') return 'DRIVER';

    // Default to CUSTOMER
    return 'CUSTOMER';
};

export const getBaseDomain = () => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    // Strip subdomains
    return hostname.replace(/^(manager|driver)\./, '');
};

export const getRedirectUrlForRole = (role: string, path: string = '/app/dashboard') => {
    if (typeof window === 'undefined') return path;
    const baseDomain = getBaseDomain();
    const port = window.location.port ? `:${window.location.port}` : '';
    const protocol = window.location.protocol;

    if (role === 'MANAGER') {
        return `${protocol}//manager.${baseDomain}${port}${path}`;
    }
    if (role === 'DRIVER') {
        return `${protocol}//driver.${baseDomain}${port}${path}`;
    }
    return `${protocol}//${baseDomain}${port}${path}`;
};
