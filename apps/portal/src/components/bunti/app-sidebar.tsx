"use client"

import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react"
import type * as React from "react"
import { UserButton } from "@/components/auth/user/user-button"
import { NavMain } from "@/components/bunti/nav-main"
import { OrgSwitcher } from "@/components/bunti/org-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    navMain: [
        {
            title: "Example",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Posts",
                    url: "/posts",
                },
                {
                    title: "Categories",
                    url: "/categories",
                },
            ],
        },
        {
            title: "Teams",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Members",
                    url: "#",
                },
                {
                    title: "Roles",
                    url: "#",
                },
                {
                    title: "Permissions",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
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
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Organization",
                    url: "#",
                },
                {
                    title: "Email",
                    url: "#",
                },
                {
                    title: "Notifications",
                    url: "#",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrgSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <UserButton />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
