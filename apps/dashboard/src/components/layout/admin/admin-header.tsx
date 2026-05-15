import { Link } from "@tanstack/react-router"
import { LanguageButton } from "@/components/i18n/language-btn"
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminHeader() {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="min-w-0 flex-1 text-muted-foreground text-sm">
                <AppBreadcrumb />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
                <ThemeToggle />
                <LanguageButton />
                <Button variant="outline" size="sm" asChild>
                    <Link to="/home">Exit admin</Link>
                </Button>
            </div>
        </header>
    )
}
