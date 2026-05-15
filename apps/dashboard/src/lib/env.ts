/** Origin only (scheme + host + port), no path — e.g. http://localhost:4000 */
export function getPublicApiOrigin(): string {
    return import.meta.env.VITE_PUBLIC_API_ORIGIN ?? "http://localhost:4000"
}

export function getApiBasePath(): string {
    return `${getPublicApiOrigin()}/api`
}
