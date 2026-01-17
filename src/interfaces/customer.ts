export interface CustomerData {
  id: number;
  name: string;
  phonenumber: string | null;
  debt: number;
  active: boolean;
}

export interface CustomerFormData {
  name: string;
  phonenumber: string | null;
  active: boolean;
}
