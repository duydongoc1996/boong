import { type Locales, useI18nContext } from "@boong/i18n"
import { LanguagesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageButton() {
    const { locale, setLocale, LL } = useI18nContext()

    const handleChangeLocale = (locale: Locales) => {
        setLocale(locale)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <LanguagesIcon className="size-4" />
                    {locale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {(Object.keys(LL.languages) as Locales[]).map((key) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => handleChangeLocale(key)}
                    >
                        {LL.languages[key]()}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
