import { Authenticated, Refine } from "@refinedev/core"
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools"
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar"

import routerProvider, {
    CatchAllNavigate,
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router"
import { BrowserRouter, Outlet, Route, Routes } from "react-router"
import "./App.css"
import { BetterAuthUIProvider } from "@/components/auth/better-auth-ui-provider"
import { ErrorComponent } from "@/components/refine-ui/layout/error-component"
import { Layout } from "@/components/refine-ui/layout/layout"
import { Toaster } from "@/components/refine-ui/notification/toaster"
import { useNotificationProvider } from "@/components/refine-ui/notification/use-notification-provider"
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider"
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
} from "@/pages/categories"
import { ForgotPasswordPage } from "@/pages/forgot-password"
import {
    OrganizationCreate,
    OrganizationEdit,
    OrganizationList,
    OrganizationShow,
} from "@/pages/organizations"
import { ResetPasswordPage } from "@/pages/reset-password"
import { SettingsAccount } from "@/pages/settings/account"
import { SettingsIndex } from "@/pages/settings/index"
import { SettingsSecurity } from "@/pages/settings/security"
import { SignInPage } from "@/pages/sign-in"
import { SignOutPage } from "@/pages/sign-out"
import { SignUpPage } from "@/pages/sign-up"
import { authProvider } from "@/providers/refine-auth"
import { restProvider } from "@/providers/rest"
import { InvitationCreate, InvitationList } from "./pages/invitations"
import { MemberEdit, MemberList } from "./pages/members"
import { PostCreate, PostEdit, PostList, PostShow } from "./pages/posts"
import {
    invitationProvider,
    memberProvider,
    orgProvider,
} from "./providers/better-auth"

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ThemeProvider>
                    <BetterAuthUIProvider>
                        <DevtoolsProvider>
                            <Refine
                                dataProvider={{
                                    default: restProvider,
                                    org: orgProvider,
                                    member: memberProvider,
                                    invitation: invitationProvider,
                                }}
                                notificationProvider={useNotificationProvider()}
                                routerProvider={routerProvider}
                                authProvider={authProvider}
                                resources={[
                                    {
                                        name: "posts",
                                        list: "/posts",
                                        create: "/posts/create",
                                        edit: "/posts/edit/:id",
                                        show: "/posts/show/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "categories",
                                        list: "/categories",
                                        create: "/categories/create",
                                        edit: "/categories/edit/:id",
                                        show: "/categories/show/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "organizations",
                                        list: "/admin/organizations",
                                        create: "/admin/organizations/create",
                                        edit: "/admin/organizations/edit/:id",
                                        show: "/admin/organizations/show/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "invitations",
                                        list: "/team/invitations",
                                        create: "/team/invitations/create",
                                        show: "/team/invitations/show/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "members",
                                        list: "/team/members",
                                        create: "/team/invitations/create",
                                        edit: "/team/members/edit/:id",
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                ]}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                    projectId: "41H6th-YiOvIV-hLWoJ9",
                                }}
                            >
                                <Routes>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-inner"
                                                fallback={
                                                    <CatchAllNavigate to="/sign-in" />
                                                }
                                            >
                                                <Layout>
                                                    <Outlet />
                                                </Layout>
                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            index
                                            element={
                                                <NavigateToResource resource="posts" />
                                            }
                                        />
                                        <Route path="/posts">
                                            <Route
                                                index
                                                element={<PostList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<PostCreate />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<PostEdit />}
                                            />
                                            <Route
                                                path="show/:id"
                                                element={<PostShow />}
                                            />
                                        </Route>
                                        <Route path="/categories">
                                            <Route
                                                index
                                                element={<CategoryList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<CategoryCreate />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<CategoryEdit />}
                                            />
                                            <Route
                                                path="show/:id"
                                                element={<CategoryShow />}
                                            />
                                        </Route>
                                        <Route path="/admin/organizations">
                                            <Route
                                                index
                                                element={<OrganizationList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<OrganizationCreate />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<OrganizationEdit />}
                                            />
                                            <Route
                                                path="show/:id"
                                                element={<OrganizationShow />}
                                            />
                                        </Route>
                                        <Route path="/team/members">
                                            <Route
                                                index
                                                element={<MemberList />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<MemberEdit />}
                                            />
                                        </Route>
                                        <Route path="/team/invitations">
                                            <Route
                                                index
                                                element={<InvitationList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<InvitationCreate />}
                                            />
                                        </Route>
                                        <Route
                                            path="/sign-out"
                                            element={<SignOutPage />}
                                        />
                                        <Route path="/settings">
                                            <Route
                                                index
                                                element={<SettingsIndex />}
                                            />
                                            <Route
                                                path="account"
                                                element={<SettingsAccount />}
                                            />
                                            <Route
                                                path="security"
                                                element={<SettingsSecurity />}
                                            />
                                        </Route>
                                        <Route
                                            path="*"
                                            element={<ErrorComponent />}
                                        />
                                    </Route>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-outer"
                                                fallback={<Outlet />}
                                            >
                                                <NavigateToResource />
                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            path="/sign-in"
                                            element={<SignInPage />}
                                        />
                                        <Route
                                            path="/sign-up"
                                            element={<SignUpPage />}
                                        />
                                        <Route
                                            path="/forgot-password"
                                            element={<ForgotPasswordPage />}
                                        />
                                        <Route
                                            path="/reset-password"
                                            element={<ResetPasswordPage />}
                                        />
                                    </Route>
                                </Routes>

                                <Toaster />
                                <RefineKbar />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler />
                            </Refine>
                            <DevtoolsPanel />
                        </DevtoolsProvider>
                    </BetterAuthUIProvider>
                </ThemeProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    )
}

export default App
