'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/AuthContext'
import {
  getCustomer,
  getCustomerTransactions,
  createTransaction,
} from '@/src/services/customer-detail'
import { CustomerData } from '@/src/interfaces/customer'
import { TransactionData } from '@/src/interfaces/transaction'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const customerId = Number(id)

  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // formulario
  const [type, setType] = useState<'COMPRA' | 'PAGO'>('COMPRA')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [cust, txs] = await Promise.all([
          getCustomer(customerId),
          getCustomerTransactions(customerId),
        ])

        setCustomer(cust)
        setTransactions(txs)
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

    loadData()
  }, [isAuthenticated, customerId, router, logout])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await createTransaction(customerId, {
      type,
      amount: Number(amount),
      description: description || undefined,
    })

    // recargar movimientos y customer
    const [cust, txs] = await Promise.all([
      getCustomer(customerId),
      getCustomerTransactions(customerId),
    ])

    setCustomer(cust)
    setTransactions(txs)

    setAmount('')
    setDescription('')
  }

  if (!isAuthenticated) return null
  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
  if (!customer) return null

  return (
    <main>
      <h1>{customer.name}</h1>
      <p>Deuda actual: ${customer.debt}</p>

      <h2>Movimientos</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.type} — ${tx.amount} — {tx.description}
          </li>
        ))}
      </ul>
      <h2>Nuevo movimiento</h2>
      <form onSubmit={handleSubmit}>
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="COMPRA">Compra / Fiado</option>
          <option value="PAGO">Pago</option>
        </select>

        <input
          type="number"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button>Guardar</button>
      </form>
    </main>
  )
}
