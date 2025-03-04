interface JWTPayload {
    user_id: number;
    exp?: number;
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now();
}

export function decodeJWT(token: string): JWTPayload | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
}
