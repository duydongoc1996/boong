const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

type CookieStoreLike = {
    set: (details: {
        name: string
        value: string
        path?: string
        expires?: Date
    }) => Promise<void>
}

export function persistSidebarOpenState(openState: boolean): void {
    const value = String(openState)
    const expires = new Date(Date.now() + SIDEBAR_COOKIE_MAX_AGE * 1000)

    const cookieStore = (
        globalThis as typeof globalThis & { cookieStore?: CookieStoreLike }
    ).cookieStore

    if (cookieStore) {
        void cookieStore.set({
            name: SIDEBAR_COOKIE_NAME,
            value,
            path: "/",
            expires,
        })
        return
    }

    if (typeof document !== "undefined") {
        // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is unavailable in this runtime (e.g. older browsers)
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
}
