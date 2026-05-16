import type { BaseTranslation } from "../i18n-types"

const vi = {
    languages: {
        en: "English",
        vi: "Tiếng Việt",
    },
    breadcrumb: {
        home: "Trang chủ",
        admin: "Quản trị",
        users: "Người dùng",
        organizations: "Chi nhánh",
        settings: "Cài đặt",
        settingsGeneral: "Tổng quan",
        settingsNotification: "Thông báo",
        settingsAdvance: "Nâng cao",
        settingsSecurity: "Bảo mật",
        posts: "Bài viết",
        categories: "Danh mục",
        members: "Thành viên",
        invitations: "Lời mời",
        reports: "Báo cáo",
        new: "Thêm",
        edit: "Sửa",
        post: "Bài viết",
        category: "Danh mục",
    },
    sidebar: {
        platform: "Nền tảng",
        content: "Nội dung",
        posts: "Bài viết",
        categories: "Danh mục",
        team: "Nhân sự",
        members: "Nhân viên",
        invitations: "Mời tham gia",
        insights: "Thống kê",
        reports: "Báo cáo",
    },
    adminSidebar: {
        administration: "Quản trị",
        users: "Người dùng",
        organizations: "Chi nhánh",
        settings: "Cài đặt",
        settingsGeneral: "Tổng quan",
        settingsNotification: "Thông báo",
        settingsAdvance: "Nâng cao",
        settingsSecurity: "Bảo mật",
    },
    adminHeader: {
        exitAdmin: "Thoát",
    },
    common: {
        save: "Lưu",
        saving: "Đang lưu…",
        cancel: "Hủy",
        edit: "Sửa",
        show: "Xem",
        delete: "Xóa",
        create: "Tạo",
        creating: "Đang tạo…",
        refresh: "Làm mới",
        loading: "Đang tải…",
        actions: "Thao tác",
        backToList: "Quay lại danh sách",
        notFound: "Không tìm thấy.",
        prevPage: "Trang trước",
        nextPage: "Trang sau",
        pageInfo: "Trang {page} · cỡ {size}",
        deleteConfirm: "Xóa mục này? Không thể hoàn tác.",
        deleted: "Đã xóa",
        saved: "Đã lưu",
        copyId: "Sao chép (id)",
        copiedToClipboard: "Đã sao chép id",
        customAction: "Tùy chỉnh…",
    },
    theme: {
        changeTheme: "Đổi giao diện",
        light: "Sáng",
        dark: "Tối",
        system: "Hệ thống",
    },
    orgSwitcher: {
        label: "Chi nhánh",
        empty: "Chưa có chi nhánh — hãy tạo từ trang quản trị.",
    },
    navUser: {
        upgrade: "Nâng cấp Pro",
        admin: "Quản trị",
        billing: "Thanh toán",
        notifications: "Thông báo",
        logout: "Đăng xuất",
        fallbackName: "Tài khoản",
    },
    notFound: {
        title: "Không tìm thấy trang",
        description: "Hãy kiểm tra lại đường dẫn hoặc về trang chủ.",
        home: "Trang chủ",
    },
    landing: {
        title: "Boong Dashboard",
        description:
            "Đăng nhập để mở không gian chi nhánh của bạn hoặc truy cập khu vực quản trị.",
        signIn: "Đăng nhập",
        signUp: "Đăng ký",
    },
    home: {
        title: "Trang chủ",
        description: "Chọn một mục từ thanh bên để bắt đầu.",
        openPosts: "Mở bài viết",
        openCategories: "Mở danh mục",
        createOrganization: "Tạo chi nhánh",
    },
    signIn: {
        title: "Đăng nhập",
        description: "Sử dụng email và mật khẩu tài khoản Boong của bạn.",
        fieldEmail: "Email",
        fieldPassword: "Mật khẩu",
        submit: "Đăng nhập",
        submitting: "Đang đăng nhập…",
        createAccountLink: "Tạo tài khoản",
        success: "Đăng nhập thành công",
    },
    signUp: {
        title: "Đăng ký",
        description: "Tạo tài khoản Boong với email và mật khẩu.",
        fieldName: "Họ tên",
        fieldEmail: "Email",
        fieldPassword: "Mật khẩu",
        submit: "Tạo tài khoản",
        submitting: "Đang tạo…",
        haveAccountLink: "Đã có tài khoản",
        success: "Đã tạo tài khoản — bạn có thể đăng nhập.",
    },
    orgWorkspace: {
        description:
            "Không gian làm việc của chi nhánh {slug}. Chọn một mục từ thanh bên để quản lý.",
    },
    posts: {
        list: {
            title: "Bài viết",
            description:
                "CRUD kết nối với GET/POST /api/posts kèm x-org-id. Phân trang cập nhật URL.",
            create: "Tạo",
            empty: "Chưa có bài viết.",
            columnTitle: "Tiêu đề",
            columnContent: "Nội dung",
            columnCreated: "Ngày tạo",
            deleteConfirm: "Xóa bài viết này? Không thể hoàn tác.",
        },
        new: {
            title: "Bài viết mới",
            description: "Tạo bài viết trong chi nhánh này.",
            fieldTitle: "Tiêu đề",
            fieldContent: "Nội dung",
            success: "Đã tạo bài viết",
        },
        edit: {
            title: "Sửa bài viết",
            fieldTitle: "Tiêu đề",
            fieldContent: "Nội dung",
        },
        show: {
            notFound: "Không tìm thấy bài viết.",
        },
    },
    categories: {
        list: {
            title: "Danh mục",
            description:
                "Sử dụng /api/categories. Endpoint danh sách chưa giới hạn theo chi nhánh; dữ liệu được lọc theo chi nhánh đang hoạt động.",
            create: "Tạo",
            empty: "Chưa có danh mục cho chi nhánh này.",
            columnName: "Tên",
            columnOrg: "Chi nhánh",
            deleteConfirm: "Xóa danh mục này?",
        },
        new: {
            title: "Danh mục mới",
            description: "Đặt tên danh mục cho chi nhánh này.",
            fieldName: "Tên",
            success: "Đã tạo danh mục",
        },
        edit: {
            title: "Sửa danh mục",
            fieldName: "Tên",
        },
        show: {
            notFound: "Không tìm thấy danh mục.",
        },
    },
    members: {
        title: "Thành viên",
        description:
            "Quản lý thành viên chi nhánh sẽ kết nối với API tổ chức của Better Auth khi bạn mở rộng route này.",
    },
    invitations: {
        title: "Lời mời",
        description:
            "Luồng mời tham gia sẽ kết nối với API lời mời tổ chức của Better Auth tại đây.",
    },
    charts: {
        area: {
            title: "Biểu đồ vùng - Tương tác",
            description: "Tổng lượt truy cập 3 tháng qua",
            selectAria: "Chọn khoảng thời gian",
            last3Months: "3 tháng gần nhất",
            last30Days: "30 ngày gần nhất",
            last7Days: "7 ngày gần nhất",
        },
        bar: {
            title: "Biểu đồ cột - Nhiều chuỗi",
            description: "Tháng 1 - Tháng 6 năm 2024",
            trending: "Tăng 5.2% trong tháng",
            showing: "Tổng lượt truy cập 6 tháng qua",
        },
        pie: {
            title: "Biểu đồ tròn - Nhãn",
            description: "Tháng 1 - Tháng 6 năm 2024",
            trending: "Tăng 5.2% trong tháng",
            showing: "Tổng lượt truy cập 6 tháng qua",
        },
    },
    admin: {
        users: {
            title: "Người dùng",
            description: "Sử dụng plugin admin của Better Auth (listUsers).",
            columnEmail: "Email",
            columnName: "Tên",
            columnRole: "Vai trò",
            empty: "Không có người dùng.",
            defaultRole: "user",
        },
        organizations: {
            create: {
                title: "Tạo chi nhánh",
                description:
                    "Sử dụng authClient.organization.create (plugin tổ chức của Better Auth). Yêu cầu phiên có quyền admin.",
                fieldName: "Tên",
                fieldSlug: "Slug",
                submit: "Tạo",
                submitting: "Đang tạo…",
                success: "Đã tạo chi nhánh",
            },
            list: {
                title: "Chi nhánh (phiên hiện tại)",
                description:
                    "Liệt kê các chi nhánh qua /api/auth/organization/list. Để có danh sách toàn cục, hãy thêm API riêng.",
                columnName: "Tên",
                columnSlug: "Slug",
                columnId: "Id",
                empty: "Chưa có chi nhánh.",
            },
        },
        settings: {
            general: {
                title: "Tổng quan",
                description:
                    "Placeholder cho thiết lập quản trị toàn cục (thương hiệu, ngôn ngữ, v.v.).",
            },
            notification: {
                title: "Cài đặt thông báo",
                description:
                    "Dành cho thiết lập email và webhook trong tương lai.",
            },
            advance: {
                title: "Nâng cao",
                description:
                    "Dành cho tùy chọn nâng cao và tính năng thử nghiệm.",
            },
            security: {
                title: "Bảo mật",
                description:
                    "Dành cho chính sách phiên, quy tắc IP và nhật ký kiểm tra.",
            },
        },
    },
    errors: {
        fallback: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        network: "Lỗi mạng. Hãy kiểm tra kết nối.",
        invalidInput: "Dữ liệu không hợp lệ.",
        unauthorized: "Bạn cần đăng nhập để tiếp tục.",
        forbidden: "Bạn không có quyền thực hiện thao tác này.",
        notFound: "Không tìm thấy tài nguyên.",
        serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
        signInFailed: "Đăng nhập thất bại.",
        signUpFailed: "Đăng ký thất bại.",
        invalidCredentials: "Email hoặc mật khẩu không đúng.",
        createOrgFailed: "Tạo chi nhánh thất bại.",
        slugInvalid: "Slug: chữ cái, chữ số, dấu gạch ngang",
        validationRequired: "Trường này là bắt buộc.",
        validationEmail: "Hãy nhập email hợp lệ.",
        validationMinLength: "Phải có ít nhất {min} ký tự.",
    },
} satisfies BaseTranslation

export default vi
