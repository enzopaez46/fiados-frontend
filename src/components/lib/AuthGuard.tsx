'use client';
// todavia no esta en uso

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <p>Usuario no autenticado</p>;
    }

    return <>{children}</>;
}