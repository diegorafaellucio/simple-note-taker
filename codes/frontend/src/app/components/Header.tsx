'use client';

import { usePathname } from 'next/navigation';
import { UserMenu } from './ui/UserMenu';

export function Header() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) {
        return null;
    }

    return (
        <header className="w-full">
            <div className="container mx-auto px-4 py-4 flex justify-end">
                <UserMenu />
            </div>
        </header>
    );
}
