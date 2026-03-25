export interface CustomerData {
  id: number;
  name: string;
  phonenumber: string | null;
  debt: number;
  active: boolean;
}

export interface PaginationData {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginatedCustomersResponse {
  data: CustomerData[];
  pagination: PaginationData;
}

export interface CustomerFormData {
  name: string;
  phonenumber: string | null;
  active: boolean;
}
