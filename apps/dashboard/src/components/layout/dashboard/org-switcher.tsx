import { useI18nContext } from "@boong/i18n"
import { Building2, ChevronsUpDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import type { ListedOrg } from "@/lib/auth-org"

export function OrgSwitcher({
    active,
    orgs,
    onSelect,
}: {
    active: ListedOrg | undefined
    orgs: ListedOrg[]
    onSelect: (org: ListedOrg) => Promise<void>
}) {
    const { isMobile } = useSidebar()
    const { LL } = useI18nContext()

    if (!active) {
        return (
            <div className="text-muted-foreground px-2 text-sm">
                {LL.orgSwitcher.empty()}
            </div>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Building2 className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {active.name}
                                </span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {active.slug}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            {LL.orgSwitcher.label()}
                        </DropdownMenuLabel>
                        {orgs.map((org) => (
                            <DropdownMenuItem
                                key={org.id}
                                className="gap-2 p-2"
                                onClick={() => void onSelect(org)}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <Building2 className="size-3.5 shrink-0" />
                                </div>
                                <div className="flex flex-col">
                                    <span>{org.name}</span>
                                    <span className="text-muted-foreground text-xs">
                                        {org.slug}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
