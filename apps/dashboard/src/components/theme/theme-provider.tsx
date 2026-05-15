import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

const STORAGE_KEY = "boong-dashboard-theme"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
}

type ThemeContextValue = {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
    return theme === "system" ? getSystemTheme() : theme
}

function applyTheme(resolved: ResolvedTheme) {
    document.documentElement.classList.toggle("dark", resolved === "dark")
}

function readStoredTheme(defaultTheme: Theme): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored
        }
    } catch {
        // ignore
    }
    return defaultTheme
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() =>
        readStoredTheme(defaultTheme)
    )
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
        resolveTheme(readStoredTheme(defaultTheme))
    )

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // ignore
        }
    }, [])

    useEffect(() => {
        const resolved = resolveTheme(theme)
        applyTheme(resolved)
        setResolvedTheme(resolved)
    }, [theme])

    useEffect(() => {
        if (theme !== "system") return

        const media = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = () => {
            const resolved = getSystemTheme()
            applyTheme(resolved)
            setResolvedTheme(resolved)
        }

        media.addEventListener("change", onChange)
        return () => media.removeEventListener("change", onChange)
    }, [theme])

    const value = useMemo(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme]
    )

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
