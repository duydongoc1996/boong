import type {
    BaseRecord,
    CreateParams,
    DataProvider,
    DeleteOneParams,
    GetListParams,
    GetOneParams,
    UpdateParams,
} from "@refinedev/core"
import { authClient } from "@/lib/auth/auth-client"

type OrgCreateArgs = Parameters<typeof authClient.organization.create>[0]
type OrgUpdateArgs = Parameters<typeof authClient.organization.update>[0]

export const orgProvider: DataProvider = {
    getApiUrl: () => "/api/auth/organization",
    getList: async <TData extends BaseRecord = BaseRecord>(
        _params: GetListParams
    ) => {
        const { data, error } = await authClient.organization.list()

        if (error) throw error

        const orgs = data ?? []

        return {
            data: orgs as unknown as TData[],
            total: orgs.length,
        }
    },

    getOne: async <TData extends BaseRecord = BaseRecord>(
        params: GetOneParams
    ) => {
        const { id } = params
        const { data, error } =
            await authClient.organization.getFullOrganization({
                query: {
                    organizationId: String(id),
                },
            })

        if (error) throw error

        return {
            data: data as unknown as TData,
        }
    },

    create: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: CreateParams<TVariables>
    ) => {
        const { data, error } = await authClient.organization.create(
            params.variables as OrgCreateArgs
        )
        if (error) throw error
        return { data: data as unknown as TData }
    },

    update: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: UpdateParams<TVariables>
    ) => {
        const { data, error } = await authClient.organization.update(
            params.variables as OrgUpdateArgs
        )
        if (error) throw error
        return { data: data as unknown as TData }
    },

    deleteOne: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: DeleteOneParams<TVariables>
    ) => {
        const { error } = await authClient.organization.delete({
            organizationId: String(params.id),
        })
        if (error) throw error
        return { data: {} as unknown as TData }
    },
}

type UpdateMemberArgs = Parameters<
    typeof authClient.organization.updateMemberRole
>[0]

export const memberProvider: DataProvider = {
    getApiUrl: () => "/api/auth/organization",
    getList: async <TData extends BaseRecord = BaseRecord>(
        params: GetListParams
    ) => {
        // Better Auth uses the active org by default,
        // but we allow override via meta.organizationId
        const { data, error } = await authClient.organization.listMembers({
            query: params.meta?.organizationId
                ? { organizationId: String(params.meta.organizationId) }
                : undefined,
        })

        if (error) throw error
        const members = (data?.members ?? []) as unknown as TData[]
        const total = data?.total ?? 0

        return {
            data: members,
            total,
        }
    },

    getOne: async <TData extends BaseRecord = BaseRecord>(
        _params: GetOneParams
    ) => {
        return { data: {} as unknown as TData }
    },
    create: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        _params: CreateParams<TVariables>
    ) => {
        return { data: {} as unknown as TData }
    },
    update: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: UpdateParams<TVariables>
    ) => {
        const { data, error } = await authClient.organization.updateMemberRole({
            ...(params.variables as UpdateMemberArgs),
            memberId: String(params.id),
        })
        if (error) throw error
        return { data: data as unknown as TData }
    },

    deleteOne: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: DeleteOneParams<TVariables>
    ) => {
        const { error } = await authClient.organization.removeMember({
            memberIdOrEmail: String(params.id),
            // Optional: allow passing orgId in delete as well
            organizationId: params.meta?.organizationId
                ? String(params.meta.organizationId)
                : undefined,
        })
        if (error) throw error
        return { data: {} as unknown as TData }
    },
}

type InviteArgs = Parameters<typeof authClient.organization.inviteMember>[0]

export const invitationProvider: DataProvider = {
    getList: async <TData extends BaseRecord = BaseRecord>(
        params: GetListParams
    ) => {
        const { data, error } = await authClient.organization.listInvitations({
            query: params.meta?.organizationId
                ? { organizationId: String(params.meta.organizationId) }
                : undefined,
        })

        if (error) throw error
        const invites = data ?? []

        return {
            data: invites as unknown as TData[],
            total: invites.length,
        }
    },

    getOne: async <TData extends BaseRecord = BaseRecord>(
        params: GetOneParams
    ) => {
        const { id } = params
        const { data, error } = await authClient.organization.getInvitation({
            query: {
                id: String(id),
            },
        })
        if (error) throw error
        return { data: data as unknown as TData }
    },
    update: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        _params: UpdateParams<TVariables>
    ) => {
        return { data: {} as unknown as TData }
    },
    create: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: CreateParams<TVariables>
    ) => {
        const { data, error } = await authClient.organization.inviteMember(
            params.variables as InviteArgs
        )
        if (error) throw error
        return { data: data as unknown as TData }
    },

    deleteOne: async <
        TData extends BaseRecord = BaseRecord,
        TVariables = Record<string, unknown>,
    >(
        params: DeleteOneParams<TVariables>
    ) => {
        const { error } = await authClient.organization.cancelInvitation({
            invitationId: String(params.id),
        })
        if (error) throw error
        return { data: {} as unknown as TData }
    },

    getApiUrl: () => "/api/auth/organization/invitation",
}
