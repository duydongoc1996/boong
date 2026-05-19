import { Store, useSelector } from "@tanstack/react-store"
import { getCookie, removeCookie, setCookie } from "@/lib/cookies"

const ACCESS_TOKEN = "thisisjustarandomstring"

interface AuthUser {
    accountNo: string
    email: string
    role: string[]
    exp: number
}

interface AuthState {
    auth: {
        user: AuthUser | null
        setUser: (user: AuthUser | null) => void
        accessToken: string
        setAccessToken: (accessToken: string) => void
        resetAccessToken: () => void
        reset: () => void
    }
}

const cookieState = getCookie(ACCESS_TOKEN)
const initToken = cookieState ? JSON.parse(cookieState) : ""

const authStore = new Store<AuthState>({
    auth: {
        user: null,
        accessToken: initToken,
        setUser: (user) =>
            authStore.setState((state) => ({
                ...state,
                auth: { ...state.auth, user },
            })),
        setAccessToken: (accessToken) =>
            authStore.setState((state) => {
                setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
                return { ...state, auth: { ...state.auth, accessToken } }
            }),
        resetAccessToken: () =>
            authStore.setState((state) => {
                removeCookie(ACCESS_TOKEN)
                return {
                    ...state,
                    auth: { ...state.auth, accessToken: "" },
                }
            }),
        reset: () =>
            authStore.setState((state) => {
                removeCookie(ACCESS_TOKEN)
                return {
                    ...state,
                    auth: { ...state.auth, user: null, accessToken: "" },
                }
            }),
    },
})

export function useAuthStore(): AuthState {
    return useSelector(authStore)
}

useAuthStore.getState = (): AuthState => authStore.state
