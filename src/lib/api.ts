import { api } from '@/utils/interceptor'; // instancia de axios cos su interceptor

export async function apiFetch(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  } = {}
) {
  const response = await api.request({
    url: endpoint,
    method: options.method ?? 'GET',
    data: options.data,
    params: options.params,
    headers: options.headers,
  });

  return response.data;
}

