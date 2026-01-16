export type TransactionType = "COMPRA" | "PAGO";

export interface TransactionData {
  id: number;
  type: TransactionType;
  amount: number;
  description?: string | null;
  timestamp: string;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description?: string | null;
}