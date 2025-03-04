import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '../utils/jwt';

export function useTokenExpiration() {
    const router = useRouter();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (!token || isTokenExpired(token)) {
                localStorage.removeItem('token'); // Clear expired token
                router.push('/login');
            }
        };

        // Check immediately
        checkToken();

        // Check every minute
        const interval = setInterval(checkToken, 60000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [router]);
}
