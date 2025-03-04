import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decodeJWT } from '../utils/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
    access?: string;
    tokens?: {
        access: string;
    };
    id?: number;
    email?: string;
    error?: string;
    detail?: string;
}

export const useAuth = () => {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        
        if (email) setUserEmail(email);
        
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded?.user_id) {
                setUserId(decoded.user_id);
            }
        }
    }, []);

    const authenticate = async (
        email: string,
        password: string,
        isRegister: boolean
    ): Promise<boolean> => {
        setLoading(true);
        setError('');

        try {
            const endpoint = isRegister ? 'register' : 'login';
            const response = await fetch(`${API_URL}/api/authenticate/${endpoint}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data: AuthResponse = await response.json();

            if (response.ok) {
                const token = isRegister ? data.tokens?.access : data.access;
                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('userEmail', email);
                    
                    const decoded = decodeJWT(token);
                    if (decoded?.user_id) {
                        setUserId(decoded.user_id);
                    }
                    
                    setUserEmail(email);
                    return true;
                }
            }
            
            setError(data.error || data.detail || 'An error occurred');
            return false;
        } catch (err) {
            setError('An error occurred. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUserEmail('');
        setUserId(null);
        router.push('/login');
    };

    return {
        authenticate,
        logout,
        error,
        loading,
        userEmail,
        userId
    };
}
