"use client"

import {
    BellIcon,
    BlocksIcon,
    BookAIcon,
    BookMarkedIcon,
    BookOpen,
    BoxesIcon,
    Building2,
    ImagesIcon,
    LockKeyholeOpenIcon,
    MailIcon,
    PenBoxIcon,
    SendIcon,
    Settings,
    Settings2,
    ShieldCheckIcon,
    ShieldUserIcon,
    User,
    UsersIcon,
} from "lucide-react"
import type * as React from "react"
import { UserButton } from "@/components/auth/user/user-button"
import { NavMain } from "@/components/boong/nav-main"
import { OrgSwitcher } from "@/components/boong/org-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const navGroups = [
    {
        title: "Administration",
        items: [
            {
                title: "Access Control",
                url: "#",
                icon: Building2,
                isActive: false,
                items: [
                    {
                        title: "Organizations",
                        url: "/admin/organizations",
                        icon: Building2,
                    },
                    {
                        title: "Users",
                        url: "/admin/users",
                        icon: User,
                    },
                    {
                        title: "Roles",
                        url: "/admin/roles",
                        icon: ShieldUserIcon,
                    },
                    {
                        title: "Permissions",
                        url: "/admin/permissions",
                        icon: ShieldCheckIcon,
                    },
                ],
            },
            {
                title: "Settings",
                url: "#",
                icon: Settings,
                isActive: false,
                items: [
                    {
                        title: "General",
                        url: "/admin/settings/general",
                        icon: Settings2,
                    },
                    {
                        title: "Email",
                        url: "/admin/settings/email",
                        icon: MailIcon,
                    },
                    {
                        title: "Notifications",
                        url: "/admin/settings/notifications",
                        icon: BellIcon,
                    },
                    {
                        title: "Security",
                        url: "/admin/settings/security",
                        icon: LockKeyholeOpenIcon,
                    },
                    {
                        title: "Advanced",
                        url: "/admin/settings/advanced",
                        icon: BlocksIcon,
                    },
                ],
            },
        ],
    },
    {
        title: "Platform",
        items: [
            {
                title: "Content",
                url: "#",
                icon: PenBoxIcon,
                isActive: false,
                items: [
                    {
                        title: "Posts",
                        url: "/posts",
                        icon: BookAIcon,
                    },
                    {
                        title: "Categories",
                        url: "/categories",
                        icon: BookMarkedIcon,
                    },
                    {
                        title: "Medias",
                        url: "/medias",
                        icon: ImagesIcon,
                    },
                ],
            },
            {
                title: "Team",
                url: "#",
                icon: BoxesIcon,
                isActive: false,
                items: [
                    {
                        title: "Members",
                        url: "/team/members",
                        icon: UsersIcon,
                    },
                    {
                        title: "Invitations",
                        url: "/team/invitations",
                        icon: SendIcon,
                    },
                ],
            },
            {
                title: "Documentation",
                url: "#",
                icon: BookOpen,
                isActive: false,
                items: [
                    {
                        title: "Introduction",
                        url: "#",
                    },
                    {
                        title: "Get Started",
                        url: "#",
                    },
                    {
                        title: "Tutorials",
                        url: "#",
                    },
                    {
                        title: "Changelog",
                        url: "#",
                    },
                ],
            },
        ],
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrgSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>
            <SidebarFooter>
                <UserButton />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
