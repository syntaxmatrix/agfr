import axios from "./axios";
import type { AxiosRequestConfig } from "axios";

type ApiOptions = {
  showToastOnError?: boolean;
};

function getErrorMessage(err: unknown): string {
  const message =
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
      ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined;

  if (message) {
    return message;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return "Request failed";
}

export async function apiGet<T = unknown>(
  url: string,
  params?: AxiosRequestConfig["params"],
  opts: ApiOptions = {},
) {
  try {
    const res = await axios.get<T>(url, { params });
    return res.data;
  } catch (err) {
    if (opts.showToastOnError) {
      // lazy: import sonner when needed to avoid hard deps here
      try {
        const { toast } = await import("sonner");
        toast.error(getErrorMessage(err));
      } catch {
        console.warn("Failed to show toast error message");
      }
    }
    throw err;
  }
}

export async function apiPost<T = unknown>(url: string, body?: unknown, opts: ApiOptions = {}) {
  try {
    const res = await axios.post<T>(url, body);
    return res.data;
  } catch (err) {
    if (opts.showToastOnError) {
      try {
        const { toast } = await import("sonner");
        toast.error(getErrorMessage(err));
      } catch {
        console.warn("Failed to show toast error message");
      }
    }
    throw err;
  }
}

const api = { apiGet, apiPost };

export default api;
