'use client'

import { useState } from 'react'
import { apiFetch } from '@/src/lib/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const data = await apiFetch('/auth/login/', {
                method: 'POST',
                data: { username, password },
            })

            localStorage.setItem('accessToken', data.access)
            localStorage.setItem('refreshToken', data.refresh)
            //console.log('LOGIN OK', data)
            login()
            router.push('/customers')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button disabled={loading}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </main>
    )
}
