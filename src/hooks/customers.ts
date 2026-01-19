import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryStringParser from "@/utils/queryStringParser";

import { CustomerData, CustomerFormData } from "@/interfaces/customer";
import { TransactionData, TransactionInput } from "@/interfaces/transaction";

import { apiFetch } from "@/lib/api";

export type CustomerFilters = {
  name?: string;
  active: boolean;
};

export const useAllCustomers = (filters: CustomerFilters) => {
  const queryString = queryStringParser({ ...filters });
  const { data, ...res } = useQuery<CustomerData[], AxiosError>({
    queryKey: ["customers", queryString],
    queryFn: () => apiFetch(`/customers/?${queryString}`),
  });
  return { customers: data, ...res };
};

export const useCustomer = (customerId: Number) => {
  const { data, ...res } = useQuery<CustomerData, AxiosError>({
    queryKey: ["customer", customerId],
    queryFn: () => apiFetch(`/customers/${customerId}/`),
    enabled: !!customerId,
  });
  return { customer: data, ...res };
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createCustomer, ...res } = useMutation<
    CustomerData,
    AxiosError,
    CustomerFormData
  >({
    mutationFn: (data: CustomerFormData) =>
      apiFetch("/customers/", {
        method: "POST",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
  return { createCustomer, ...res };
};

export const useUpdateCustomer = (customerId: Number) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateCustomer, ...res } = useMutation<
    CustomerData,
    AxiosError,
    CustomerFormData
  >({
    mutationFn: (data: CustomerFormData) =>
      apiFetch(`/customers/${customerId}/`, {
        method: "PUT",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
    },
  });
  return { updateCustomer, ...res };
};

export const useCustomerTransactions = (customerId: Number) => {
  const { data, ...res } = useQuery<TransactionData[], AxiosError>({
    queryKey: ["customer-transactions", customerId],
    queryFn: () => apiFetch(`/customers/${customerId}/transactions/`),
    enabled: !!customerId,
  });
  return { transactions: data, ...res };
};

export const useCreateTransaction = (customerId: Number) => {
  const queryClient = useQueryClient();
  const { mutateAsync: createTransaction, ...res } = useMutation<
    TransactionData,
    AxiosError,
    TransactionInput
  >({
    mutationFn: (data: TransactionInput) =>
      apiFetch(`/customers/${customerId}/transactions/`, {
        method: "POST",
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({
        queryKey: ["customer-transactions", customerId],
      });
    },
  });
  return { createTransaction, ...res };
};
