import { getRouteApi } from "@tanstack/react-router"
import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { OrganizationsDialogs } from "./components/organizations-dialogs"
import { OrganizationsPrimaryButtons } from "./components/organizations-primary-buttons"
import { OrganizationsProvider } from "./components/organizations-provider"
import { OrganizationsTable } from "./components/organizations-table"
import { useOrganizationsQuery } from "./data/organizations"

const route = getRouteApi("/_authenticated/admin/organizations/")

export function Organizations() {
    const search = route.useSearch()
    const navigate = route.useNavigate()
    const { data, isLoading, error } = useOrganizationsQuery()

    return (
        <OrganizationsProvider>
            <Header fixed>
                <Search className="ms-auto" />
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
            </Header>

            <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Organizations
                        </h2>
                        <p className="text-muted-foreground">
                            Create and manage organizations.
                        </p>
                    </div>
                    <OrganizationsPrimaryButtons />
                </div>

                {error ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                        {error.message}
                    </div>
                ) : null}

                <OrganizationsTable
                    data={data ?? []}
                    search={search}
                    navigate={navigate}
                    isLoading={isLoading}
                />
            </Main>

            <OrganizationsDialogs />
        </OrganizationsProvider>
    )
}
