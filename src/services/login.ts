import { apiFetch } from "@/lib/api";

export function userLogin(data: { username: string; password: string }) {
  return apiFetch("/auth/login/", {
    method: "POST",
    data,
  });
}
