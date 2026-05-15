import {
    createParser,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    useQueryStates,
} from "nuqs"

const sortDirParser = parseAsStringLiteral([
    "asc",
    "desc",
] as const).withDefault("asc")

/** Reusable URL state for list views (pagination, text filter, sort). */
export function useListQueryState(defaults?: {
    pageSize?: number
    sortId?: string
}) {
    const pageSize = defaults?.pageSize ?? 10
    const sortIdDefault = defaults?.sortId ?? "createdAt"

    return useQueryStates(
        {
            page: parseAsInteger.withDefault(1),
            size: parseAsInteger.withDefault(pageSize),
            q: parseAsString.withDefault(""),
            sort: parseAsString.withDefault(sortIdDefault),
            dir: sortDirParser,
        },
        { history: "replace" }
    )
}

export const optionalStringParam = createParser({
    parse: (v) => (v === "" ? null : v),
    serialize: (v) => v ?? "",
})
