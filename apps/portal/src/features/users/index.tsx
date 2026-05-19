import { getRouteApi } from "@tanstack/react-router"
import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { UsersDialogs } from "./components/users-dialogs"
import { UsersPrimaryButtons } from "./components/users-primary-buttons"
import { UsersProvider } from "./components/users-provider"
import { UsersTable } from "./components/users-table"
import { useUsersQuery } from "./data/users"

const route = getRouteApi("/_authenticated/admin/users/")

export function Users() {
    const search = route.useSearch()
    const navigate = route.useNavigate()
    const { data, isLoading, error } = useUsersQuery()

    return (
        <UsersProvider>
            <Header fixed>
                <Search className="me-auto" />
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
            </Header>

            <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            User List
                        </h2>
                        <p className="text-muted-foreground">
                            Manage your users and their roles here.
                        </p>
                    </div>
                    <UsersPrimaryButtons />
                </div>

                {error ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                        {error.message}
                    </div>
                ) : null}

                <UsersTable
                    data={data?.users ?? []}
                    search={search}
                    navigate={navigate}
                    isLoading={isLoading}
                />
            </Main>

            <UsersDialogs />
        </UsersProvider>
    )
}
