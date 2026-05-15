import { useI18nContext } from "@boong/i18n"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { BookOpen, Home, PieChart, Users } from "lucide-react"
import * as React from "react"
import { OrgSwitcher } from "@/components/layout/dashboard/org-switcher"
import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { listSessionOrganizations, setActiveOrganization } from "@/lib/auth-org"
import { postsListSearchDefaults } from "@/lib/table/posts-list-search"

function buildNav(orgSlug: string): NavMainItem[] {
    const base = `/${orgSlug}` as const
    return [
        {
            title: "content",
            url: `${base}/posts`,
            icon: BookOpen,
            items: [
                { title: "posts", url: `${base}/posts` },
                { title: "categories", url: `${base}/categories` },
            ],
        },
        {
            title: "team",
            url: `${base}/members`,
            icon: Users,
            items: [
                { title: "members", url: `${base}/members` },
                { title: "invitations", url: `${base}/invitations` },
            ],
        },
        {
            title: "insights",
            url: `${base}/reports`,
            icon: PieChart,
            items: [{ title: "reports", url: `${base}/reports` }],
        },
    ]
}

export function OrgDashboardSidebar({ orgSlug }: { orgSlug: string }) {
    const navigate = useNavigate()
    const { data: orgs = [] } = useQuery({
        queryKey: ["organizations"],
        queryFn: listSessionOrganizations,
    })
    const { LL } = useI18nContext()

    const activeOrg = React.useMemo(
        () => orgs.find((o) => o.slug === orgSlug) ?? orgs[0],
        [orgs, orgSlug]
    )

    const session = authClient.useSession()
    const user = session.data?.user

    const nav = buildNav(orgSlug || activeOrg?.slug || "_")

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <Link to="/">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Home className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-medium">
                                    {LL.breadcrumb.home()}
                                </span>
                                {/* <span className="">@boong</span> */}
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <OrgSwitcher
                    active={activeOrg}
                    orgs={orgs}
                    onSelect={async (org) => {
                        await setActiveOrganization(org.id)
                        await navigate({
                            to: "/$orgSlug/posts",
                            params: { orgSlug: org.slug },
                            search: postsListSearchDefaults,
                        })
                    }}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={nav} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        name: user?.name ?? "Account",
                        email: user?.email ?? "",
                        avatar: user?.image ?? "",
                    }}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
