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

const schema = z.object({
    name: z.string().min(1),
    slug: z
        .string()
        .min(2)
        .regex(/^[a-z0-9-]+$/i, "Slug: letters, numbers, hyphen"),
})

export function AdminOrganizationsPage() {
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
                throw new Error(error.message ?? "Create failed")
            }
        },
        onSuccess: async () => {
            toast.success("Organization created")
            await queryClient.invalidateQueries({ queryKey: ["organizations"] })
        },
    })

    const form = useForm({
        defaultValues: { name: "", slug: "" },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message ?? "Invalid")
                return
            }
            await create.mutateAsync(parsed.data)
        },
    })

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Create organization</CardTitle>
                    <CardDescription>
                        Uses{" "}
                        <code className="text-xs">
                            authClient.organization.create
                        </code>{" "}
                        (Better Auth organization plugin). Requires an
                        admin-capable session.
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
                                    <Label htmlFor={field.name}>Name</Label>
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
                                    <Label htmlFor={field.name}>Slug</Label>
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
                                {create.error.message}
                            </p>
                        ) : null}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={create.isPending}>
                            {create.isPending ? "Creating…" : "Create"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Organizations (session)</CardTitle>
                    <CardDescription>
                        Listing memberships via{" "}
                        <code className="text-xs">
                            /api/auth/organization/list
                        </code>
                        . For a global admin directory, add a dedicated API
                        route later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Id</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {q.isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="h-24 text-center"
                                        >
                                            Loading…
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
                                            No organizations.
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
