import { useI18nContext } from "@boong/i18n"
import { Link } from "@tanstack/react-router"
import {
    BellIcon,
    BlocksIcon,
    Building2,
    CogIcon,
    Shield,
    Users,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const links = [
    { to: "/admin/users", label: "users", icon: Users },
    {
        to: "/admin/organizations",
        label: "organizations",
        icon: Building2,
    },
    {
        to: "/admin/settings/general",
        label: "settingsGeneral",
        icon: CogIcon,
    },
    {
        to: "/admin/settings/notification",
        label: "settingsNotification",
        icon: BellIcon,
    },
    {
        to: "/admin/settings/advance",
        label: "settingsAdvance",
        icon: BlocksIcon,
    },
    {
        to: "/admin/settings/security",
        label: "settingsSecurity",
        icon: Shield,
    },
] as const

export function AdminSidebar({ currentPath }: { currentPath: string }) {
    const { LL } = useI18nContext()

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {LL.adminSidebar.administration()}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((l) => {
                                const Icon = l.icon
                                const active = currentPath === l.to
                                return (
                                    <SidebarMenuItem key={l.to}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            tooltip={l.label}
                                        >
                                            <Link to={l.to}>
                                                <Icon />
                                                <span>
                                                    {LL.adminSidebar[l.label]()}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
