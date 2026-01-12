'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import { getCustomers } from '@/src/services/customers'
import { CustomerData } from '@/src/interfaces/customer'

export default function CustomersPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    async function loadCustomers() {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          logout()
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [isAuthenticated, router, logout])

  if (!isAuthenticated) return null
  if (loading) return <p>Cargando customers...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <main>
      <h1>Customers</h1>

      <button onClick={logout}>Cerrar sesión</button>

      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <strong>{customer.name}</strong> — Deuda: ${customer.debt}
            <button onClick={() => router.push(`/customers/${customer.id}/`)}>Detalle</button>
          </li>
        ))}
      </ul>
    </main>
  )
}