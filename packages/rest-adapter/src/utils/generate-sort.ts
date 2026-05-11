import type { CrudSorting } from "@refinedev/core"

export function generateSort(sorters?: CrudSorting) {
    return { sort: sorters }
}
