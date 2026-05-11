import type { Pagination } from "@refinedev/core"

export function generatePagination(pagination: Pagination = {}) {
    return {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
    }
}
