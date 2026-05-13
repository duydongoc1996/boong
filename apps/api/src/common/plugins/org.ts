import Elysia, { status } from "elysia"

const ORG_ID_HEADER = "x-org-id"

export const macroOrg = new Elysia({ name: "macro-org" }).macro({
    withOrg: {
        resolve({ headers }) {
            const orgId = headers[ORG_ID_HEADER]

            if (!orgId) {
                return status(403, {
                    message: "Organization ID is required",
                })
            }
            return {
                orgId,
            }
        },
    },
})
