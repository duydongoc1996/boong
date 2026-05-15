import { useI18nContext } from "@boong/i18n"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import {
    BookOpen,
    Building2,
    ChevronsUpDown,
    Home,
    PieChart,
    Users,
} from "lucide-react"
import * as React from "react"
import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import {
    type ListedOrg,
    listSessionOrganizations,
    setActiveOrganization,
} from "@/lib/auth-org"

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

function OrgSwitcher({
    active,
    orgs,
    onSelect,
}: {
    active: ListedOrg | undefined
    orgs: ListedOrg[]
    onSelect: (org: ListedOrg) => Promise<void>
}) {
    const { isMobile } = useSidebar()

    if (!active) {
        return (
            <div className="text-muted-foreground px-2 text-sm">
                No organizations — create one from admin.
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
                            Organizations
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/admin/organizations">
                                Manage (admin)
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
