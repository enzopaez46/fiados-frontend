'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  getCustomer,
  getCustomerTransactions,
  createTransaction,
} from '@/services/customer-detail'
import { CustomerData } from '@/interfaces/customer'
import { TransactionData } from '@/interfaces/transaction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle } from 'lucide-react'

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
  if (loading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </main>
    )
  }
  if (error) {
    return (
      <main className="container mx-auto py-8 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }
  if (!customer) return null

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Customer Info */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-gray-600 mt-2">Cliente ID: {customerId}</p>
        </div>

        {/* Debt Card */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">${customer.debt.toLocaleString('es-AR')}</div>
            <p className="text-gray-600 text-sm mt-2">Deuda actual</p>
          </CardContent>
        </Card>

        {/* New Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Movimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Movimiento</Label>
                <Select value={type} onValueChange={(value) => setType(value as 'COMPRA' | 'PAGO')}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPRA">Compra</SelectItem>
                    <SelectItem value="PAGO">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Ej: Detergente, Arroz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Guardar Movimiento
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          tx.type === 'COMPRA' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tx.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">${tx.amount.toLocaleString('es-AR')}</TableCell>
                      <TableCell className="text-gray-600">{tx.description || '—'}</TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {new Date(tx.timestamp || '').toLocaleDateString('es-AR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay movimientos registrados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
