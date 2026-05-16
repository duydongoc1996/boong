import { useI18nContext } from "@boong/i18n"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { authClient } from "@/lib/auth-client"
import { listSessionOrganizations } from "@/lib/auth-org"
import { translateError } from "@/lib/i18n-errors"

const schema = z.object({
    name: z.string().min(1),
    slug: z
        .string()
        .min(2)
        .regex(/^[a-z0-9-]+$/i, "SLUG_INVALID"),
})

export function AdminOrganizationsPage() {
    const { LL } = useI18nContext()
    const queryClient = useQueryClient()
    const q = useQuery({
        queryKey: ["organizations"],
        queryFn: listSessionOrganizations,
    })

    const create = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const { error } = await authClient.organization.create({
                name: values.name,
                slug: values.slug.toLowerCase(),
            })
            if (error) {
                throw error
            }
        },
        onSuccess: async () => {
            toast.success(LL.admin.organizations.create.success())
            await queryClient.invalidateQueries({ queryKey: ["organizations"] })
        },
        onError: (err) => {
            toast.error(translateError(LL, err, "createOrgFailed"))
        },
    })

    const form = useForm({
        defaultValues: { name: "", slug: "" },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                const code = parsed.error.issues[0]?.message
                const err =
                    code === "SLUG_INVALID"
                        ? { code: "SLUG_INVALID" }
                        : parsed.error
                toast.error(translateError(LL, err, "invalidInput"))
                return
            }
            await create.mutateAsync(parsed.data)
        },
    })

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {LL.admin.organizations.create.title()}
                    </CardTitle>
                    <CardDescription>
                        {LL.admin.organizations.create.description()}
                    </CardDescription>
                </CardHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        void form.handleSubmit()
                    }}
                >
                    <CardContent className="grid gap-4">
                        <form.Field name="name">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>
                                        {LL.admin.organizations.create.fieldName()}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onChange={(ev) =>
                                            field.handleChange(ev.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="slug">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>
                                        {LL.admin.organizations.create.fieldSlug()}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onChange={(ev) =>
                                            field.handleChange(ev.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </form.Field>
                        {create.error ? (
                            <p className="text-destructive text-sm">
                                {translateError(
                                    LL,
                                    create.error,
                                    "createOrgFailed"
                                )}
                            </p>
                        ) : null}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={create.isPending}>
                            {create.isPending
                                ? LL.admin.organizations.create.submitting()
                                : LL.admin.organizations.create.submit()}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{LL.admin.organizations.list.title()}</CardTitle>
                    <CardDescription>
                        {LL.admin.organizations.list.description()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {LL.admin.organizations.list.columnName()}
                                    </TableHead>
                                    <TableHead>
                                        {LL.admin.organizations.list.columnSlug()}
                                    </TableHead>
                                    <TableHead>
                                        {LL.admin.organizations.list.columnId()}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {q.isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="h-24 text-center"
                                        >
                                            {LL.common.loading()}
                                        </TableCell>
                                    </TableRow>
                                ) : q.data?.length ? (
                                    q.data.map((o) => (
                                        <TableRow key={o.id}>
                                            <TableCell>{o.name}</TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {o.slug}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {o.id}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="h-24 text-center"
                                        >
                                            {LL.admin.organizations.list.empty()}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
