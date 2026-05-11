import type { CrudFilters, CrudSorting, DataProvider } from "@refinedev/core"
import { stringify } from "qs"
import { generatePagination } from "./utils/generate-pagination.js"
import {
    generateFilter,
    generateSort,
    handleResponse,
    isMethodWithBody,
} from "./utils/index.js"

interface QueryParams {
    filters?: CrudFilters
    page?: number
    pageSize?: number
    sort?: CrudSorting
    [key: string]: unknown
}

export const dataProvider = (
    apiUrl: string
): Omit<
    Required<DataProvider>,
    "createMany" | "updateMany" | "deleteMany"
> => ({
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        const { headers, method = "GET" } = meta ?? {}

        const query: QueryParams = {
            ...generateFilter(filters),
            ...generatePagination(pagination),
            ...generateSort(sorters),
        }

        const url = `${apiUrl}/${resource}${Object.keys(query).length ? `?${stringify(query)}` : ""}`

        const { responseData } = await handleResponse(
            await fetch(url, {
                method,
                headers: { ...(headers as Record<string, string>) },
            })
        )

        return {
            data: responseData.data,
            total: responseData.total,
        }
    },

    getMany: async ({ resource, ids, meta }) => {
        const { headers, method = "GET" } = meta ?? {}
        const url = `${apiUrl}/${resource}?${stringify({ id: ids })}`

        const { responseData } = await handleResponse(
            await fetch(url, {
                method,
                headers: headers as Record<string, string>,
            })
        )

        return { data: responseData.data }
    },

    create: async ({ resource, variables, meta }) => {
        const { headers, method = "POST" } = meta ?? {}

        const { responseData } = await handleResponse(
            await fetch(`${apiUrl}/${resource}`, {
                method,
                body: JSON.stringify(variables),
                headers: {
                    "Content-Type": "application/json",
                    ...(headers as Record<string, string>),
                },
            })
        )

        return { data: responseData.data }
    },

    update: async ({ resource, id, variables, meta }) => {
        const { headers, method = "PATCH" } = meta ?? {}

        const { responseData } = await handleResponse(
            await fetch(`${apiUrl}/${resource}/${id}`, {
                method,
                body: JSON.stringify(variables),
                headers: {
                    "Content-Type": "application/json",
                    ...(headers as Record<string, string>),
                },
            })
        )

        return { data: responseData.data }
    },

    getOne: async ({ resource, id, meta }) => {
        const { headers, method = "GET" } = meta ?? {}

        const { responseData } = await handleResponse(
            await fetch(`${apiUrl}/${resource}/${id}`, {
                method,
                headers: headers as Record<string, string>,
            })
        )

        return { data: responseData.data }
    },

    deleteOne: async ({ resource, id, variables, meta }) => {
        const { headers, method = "DELETE" } = meta ?? {}

        const { responseData } = await handleResponse(
            await fetch(`${apiUrl}/${resource}/${id}`, {
                method,
                body: variables ? JSON.stringify(variables) : undefined,
                headers: {
                    "Content-Type": "application/json",
                    ...(headers as Record<string, string>),
                },
            })
        )

        return { data: responseData.data }
    },

    getApiUrl: () => apiUrl,

    custom: async ({
        url,
        method,
        filters,
        sorters,
        payload,
        query,
        headers,
    }) => {
        const q: QueryParams = {
            ...generateFilter(filters),
            ...generateSort(sorters),
            ...query,
        }

        const requestUrl = `${url}${Object.keys(q).length ? `?${stringify(q)}` : ""}`

        const { responseData } = await handleResponse(
            await fetch(requestUrl, {
                method: method.toUpperCase(),
                headers: {
                    "Content-Type": "application/json",
                    ...(headers as Record<string, string>),
                },
                body: isMethodWithBody(method)
                    ? JSON.stringify(payload)
                    : undefined,
            })
        )

        return { data: responseData.data }
    },
})
