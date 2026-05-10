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
import { ErrorComponent } from "./components/refine-ui/layout/error-component"
import { Layout } from "./components/refine-ui/layout/layout"
import { Toaster } from "./components/refine-ui/notification/toaster"
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider"
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider"
import {
    BlogPostCreate,
    BlogPostEdit,
    BlogPostList,
    BlogPostShow,
} from "./pages/blog-posts"
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
} from "./pages/categories"
import { ForgotPasswordPage } from "./pages/forgot-password"
import { ResetPasswordPage } from "./pages/reset-password"
import { SettingsAccount } from "./pages/settings/account"
import { SettingsIndex } from "./pages/settings/index"
import { SettingsSecurity } from "./pages/settings/security"
import { SignInPage } from "./pages/sign-in"
import { SignOutPage } from "./pages/sign-out"
import { SignUpPage } from "./pages/sign-up"
import { authProvider } from "./providers/auth"
import { BetterAuthUIProvider } from "./providers/better-auth-ui-provider"
import { dataProvider } from "./providers/data"

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ThemeProvider>
                    <BetterAuthUIProvider>
                        <DevtoolsProvider>
                            <Refine
                                dataProvider={dataProvider}
                                notificationProvider={useNotificationProvider()}
                                routerProvider={routerProvider}
                                authProvider={authProvider}
                                resources={[
                                    {
                                        name: "blog_posts",
                                        list: "/blog-posts",
                                        create: "/blog-posts/create",
                                        edit: "/blog-posts/edit/:id",
                                        show: "/blog-posts/show/:id",
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
                                                <NavigateToResource resource="blog_posts" />
                                            }
                                        />
                                        <Route path="/blog-posts">
                                            <Route
                                                index
                                                element={<BlogPostList />}
                                            />
                                            <Route
                                                path="create"
                                                element={<BlogPostCreate />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<BlogPostEdit />}
                                            />
                                            <Route
                                                path="show/:id"
                                                element={<BlogPostShow />}
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
