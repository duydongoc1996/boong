const base =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
    "http://localhost:4000/api"

export const api = {
    base,
    auth: `${base}/auth`,
} as const

export type ApiConfig = typeof api
