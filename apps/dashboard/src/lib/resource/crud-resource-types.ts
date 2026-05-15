/**
 * Shared vocabulary for generated CRUD screens (list/show/create/edit/delete,
 * refresh, clone, custom). Use these types in TanStack Table column helpers and
 * toolbars so new resources stay consistent.
 */
export type CrudVerb =
    | "list"
    | "show"
    | "create"
    | "edit"
    | "delete"
    | "refresh"
    | "clone"
    | "custom"

export type ListQueryState = {
    page: number
    pageSize: number
    query: string
    sortBy: string
    sortDir: "asc" | "desc"
}

export type ResourceEndpoints = {
    /** e.g. "/posts" */
    listPath: string
    /** e.g. (id) => `/posts/${id}` */
    detailPath: (id: string) => string
}
