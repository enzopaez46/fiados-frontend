import { PaginationData } from "./customer";

export type TransactionType = "COMPRA" | "PAGO";

export interface TransactionData {
  id: number;
  type: TransactionType;
  amount: number;
  description?: string | null;
  timestamp: string;
}

export interface PaginatedTransactionsResponse {
  data: TransactionData[];
  pagination: PaginationData;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description?: string | null;
}