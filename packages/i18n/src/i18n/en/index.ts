import type { BaseTranslation } from "../i18n-types"

const en = {
    languages: {
        en: "English",
        vi: "Tiếng Việt",
    },
    breadcrumb: {
        home: "Home",
        admin: "Admin",
        users: "Users",
        organizations: "Organizations",
        settings: "Settings",
        settingsGeneral: "General",
        settingsNotification: "Notification",
        settingsAdvance: "Advanced",
        settingsSecurity: "Security",
        posts: "Posts",
        categories: "Categories",
        members: "Members",
        invitations: "Invitations",
        reports: "Reports",
        new: "New",
        edit: "Edit",
        post: "Post",
        category: "Category",
    },
    sidebar: {
        platform: "Platform",
        content: "Content",
        posts: "Posts",
        categories: "Categories",
        team: "Team",
        members: "Members",
        invitations: "Invitations",
        insights: "Insights",
        reports: "Reports",
    },
    adminSidebar: {
        administration: "Administration",
        users: "Users",
        organizations: "Organizations",
        settings: "Settings",
        settingsGeneral: "General",
        settingsNotification: "Notification",
        settingsAdvance: "Advanced",
        settingsSecurity: "Security",
    },
    adminHeader: {
        exitAdmin: "Exit admin",
    },
    common: {
        save: "Save",
        saving: "Saving…",
        cancel: "Cancel",
        edit: "Edit",
        show: "Show",
        delete: "Delete",
        create: "Create",
        creating: "Creating…",
        refresh: "Refresh",
        loading: "Loading…",
        actions: "Actions",
        backToList: "Back to list",
        notFound: "Not found.",
        prevPage: "Prev page",
        nextPage: "Next page",
        pageInfo: "Page {page} · size {size}",
        deleteConfirm: "Delete this item? This cannot be undone.",
        deleted: "Deleted",
        saved: "Saved",
        copyId: "Clone (id)",
        copiedToClipboard: "Cloned id to clipboard",
        customAction: "Custom…",
    },
    theme: {
        changeTheme: "Change theme",
        light: "Light",
        dark: "Dark",
        system: "System",
    },
    orgSwitcher: {
        label: "Organizations",
        empty: "No organizations — create one from admin.",
    },
    navUser: {
        upgrade: "Upgrade to Pro",
        admin: "Admin",
        billing: "Billing",
        notifications: "Notifications",
        logout: "Log out",
        fallbackName: "Account",
    },
    notFound: {
        title: "Page not found",
        description: "Check the URL or return home.",
        home: "Home",
    },
    landing: {
        title: "Boong Dashboard",
        description:
            "Welcome. Sign in to open an organization workspace or visit the admin area.",
        signIn: "Sign in",
        signUp: "Sign up",
    },
    home: {
        title: "Home",
        description: "Pick an area from the sidebar to get started.",
        openPosts: "Open posts",
        openCategories: "Open categories",
        createOrganization: "Create an organization",
    },
    signIn: {
        title: "Sign in",
        description: "Use the email and password for your Boong account.",
        fieldEmail: "Email",
        fieldPassword: "Password",
        submit: "Sign in",
        submitting: "Signing in…",
        createAccountLink: "Create an account",
        success: "Signed in",
    },
    signUp: {
        title: "Sign up",
        description: "Create a Boong account with email and password.",
        fieldName: "Name",
        fieldEmail: "Email",
        fieldPassword: "Password",
        submit: "Create account",
        submitting: "Creating…",
        haveAccountLink: "Already have an account",
        success: "Account created — you can sign in.",
    },
    orgWorkspace: {
        description:
            "Organization workspace for {slug}. Pick a section from the sidebar to manage resources.",
    },
    posts: {
        list: {
            title: "Posts",
            description:
                "CRUD wired to GET/POST /api/posts with x-org-id. Pagination controls update URL state.",
            create: "Create",
            empty: "No posts yet.",
            columnTitle: "Title",
            columnContent: "Content",
            columnCreated: "Created",
            deleteConfirm: "Delete this post? This cannot be undone.",
        },
        new: {
            title: "New post",
            description: "Create a post in this organization.",
            fieldTitle: "Title",
            fieldContent: "Content",
            success: "Post created",
        },
        edit: {
            title: "Edit post",
            fieldTitle: "Title",
            fieldContent: "Content",
        },
        show: {
            notFound: "Post not found.",
        },
    },
    categories: {
        list: {
            title: "Categories",
            description:
                "Uses /api/categories. The list endpoint is not org-scoped yet; rows are filtered in the UI to the active organization.",
            create: "Create",
            empty: "No categories for this org.",
            columnName: "Name",
            columnOrg: "Org",
            deleteConfirm: "Delete this category?",
        },
        new: {
            title: "New category",
            description: "Name the category for this organization.",
            fieldName: "Name",
            success: "Category created",
        },
        edit: {
            title: "Edit category",
            fieldName: "Name",
        },
        show: {
            notFound: "Category not found.",
        },
    },
    members: {
        title: "Members",
        description:
            "Organization membership management will connect to Better Auth organization APIs when you extend this route.",
    },
    invitations: {
        title: "Invitations",
        description:
            "Invitation flows will plug into Better Auth organization invitations here.",
    },
    charts: {
        area: {
            title: "Area Chart - Interactive",
            description: "Showing total visitors for the last 3 months",
            selectAria: "Select a value",
            last3Months: "Last 3 months",
            last30Days: "Last 30 days",
            last7Days: "Last 7 days",
        },
        bar: {
            title: "Bar Chart - Multiple",
            description: "January - June 2024",
            trending: "Trending up by 5.2% this month",
            showing: "Showing total visitors for the last 6 months",
        },
        pie: {
            title: "Pie Chart - Label",
            description: "January - June 2024",
            trending: "Trending up by 5.2% this month",
            showing: "Showing total visitors for the last 6 months",
        },
    },
    admin: {
        users: {
            title: "Users",
            description: "Backed by the Better Auth admin plugin (listUsers).",
            columnEmail: "Email",
            columnName: "Name",
            columnRole: "Role",
            empty: "No users returned.",
            defaultRole: "user",
        },
        organizations: {
            create: {
                title: "Create organization",
                description:
                    "Uses authClient.organization.create (Better Auth organization plugin). Requires an admin-capable session.",
                fieldName: "Name",
                fieldSlug: "Slug",
                submit: "Create",
                submitting: "Creating…",
                success: "Organization created",
            },
            list: {
                title: "Organizations (session)",
                description:
                    "Listing memberships via /api/auth/organization/list. For a global admin directory, add a dedicated API route later.",
                columnName: "Name",
                columnSlug: "Slug",
                columnId: "Id",
                empty: "No organizations.",
            },
        },
        settings: {
            general: {
                title: "General",
                description:
                    "Placeholder for global admin preferences (branding, locale, etc.).",
            },
            notification: {
                title: "Notification settings",
                description: "Reserved for future email and webhook settings.",
            },
            advance: {
                title: "Advanced",
                description:
                    "Reserved for power-user options and experimental toggles.",
            },
            security: {
                title: "Security",
                description:
                    "Reserved for session policies, IP rules, and audit logs.",
            },
        },
    },
    errors: {
        fallback: "Something went wrong. Please try again.",
        network: "Network error. Check your connection.",
        invalidInput: "Invalid input.",
        unauthorized: "You need to sign in to continue.",
        forbidden: "You don't have permission to do that.",
        notFound: "Resource not found.",
        serverError: "Server error. Please try again later.",
        signInFailed: "Sign in failed.",
        signUpFailed: "Sign up failed.",
        invalidCredentials: "Invalid email or password.",
        createOrgFailed: "Failed to create organization.",
        slugInvalid: "Slug: letters, numbers, hyphen",
        validationRequired: "This field is required.",
        validationEmail: "Enter a valid email address.",
        validationMinLength: "Must be at least {min} characters.",
    },
} satisfies BaseTranslation

export default en
