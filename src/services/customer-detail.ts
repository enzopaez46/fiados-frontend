import { apiFetch } from '../lib/api'
import { CustomerData } from '../interfaces/customer'
import { TransactionData } from '../interfaces/transaction'

export function getCustomer(id: number): Promise<CustomerData> {
  return apiFetch(`/customers/${id}/`)
}

export function getCustomerTransactions(id: number): Promise<TransactionData[]> {
  return apiFetch(`/customers/${id}/transactions/`)
}

export function createTransaction(
  customerId: number,
  data: {
    type: 'COMPRA' | 'PAGO'
    amount: number
    description?: string
  }
) {
  return apiFetch(`/customers/${customerId}/transactions/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
