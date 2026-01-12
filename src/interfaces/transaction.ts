export interface TransactionData {
  id: number
  type: 'COMPRA' | 'PAGO'
  amount: number
  description?: string | null
  timestamp: string
}