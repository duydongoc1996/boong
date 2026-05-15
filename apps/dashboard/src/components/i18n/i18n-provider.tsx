import { type Locales, loadAllLocales, TypesafeI18n } from "@boong/i18n"
import { useEffect, useState } from "react"

const DEFAULT_LOCALE: Locales = "en"

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        loadAllLocales()
        setReady(true)
    }, [])

    if (!ready) {
        return null
    }

    return <TypesafeI18n locale={DEFAULT_LOCALE}>{children}</TypesafeI18n>
}
