import { apiFetch } from "@/lib/api";
import { CustomerData } from "@/interfaces/customer";

export async function getCustomers(): Promise<CustomerData[]> {
  return apiFetch("/customers/");
}
