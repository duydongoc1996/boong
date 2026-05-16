import { useI18nContext } from "@boong/i18n"
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/utils"
import { type Theme, useTheme } from "./theme-provider"

const options: {
    value: Theme
    labelKey: "light" | "dark" | "system"
    icon: typeof SunIcon
}[] = [
    { value: "light", labelKey: "light", icon: SunIcon },
    { value: "dark", labelKey: "dark", icon: MoonIcon },
    { value: "system", labelKey: "system", icon: MonitorIcon },
]

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const { LL } = useI18nContext()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" className="relative">
                    <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">{LL.theme.changeTheme()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map(({ value, labelKey, icon: Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}
                    >
                        <Icon className="size-4" />
                        {LL.theme[labelKey]()}
                        <CheckIcon
                            className={cn(
                                "ml-auto size-4",
                                theme === value ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
