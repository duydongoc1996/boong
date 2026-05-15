import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createFileRoute,
    getRouteApi,
    Link,
    useNavigate,
    useParams,
} from "@tanstack/react-router"
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
import { apiFetch } from "@/lib/api/http"
import { categoryRowSchema } from "@/lib/api/schemas"
import { breadcrumbI18n } from "@/lib/router-static-data"

const orgRouteApi = getRouteApi("/$orgSlug")

const schema = z.object({
    name: z.string().min(1),
})

const one = z.object({ data: categoryRowSchema.nullable() })

export const Route = createFileRoute("/$orgSlug/categories/$categoryId/edit")({
    staticData: breadcrumbI18n("edit"),
    component: EditCategoryPage,
})

function EditCategoryPage() {
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug, categoryId } = useParams({
        strict: false,
    }) as { orgSlug: string; categoryId: string }

    const detail = useQuery({
        queryKey: ["category", categoryId],
        queryFn: async () => {
            const raw = await apiFetch<unknown>(`/categories/${categoryId}`)
            return one.parse(raw).data
        },
    })

    if (detail.isLoading || !detail.data) {
        return <p className="text-muted-foreground text-sm">Loading…</p>
    }

    return (
        <EditCategoryFormInner
            orgId={orgId}
            orgSlug={orgSlug}
            categoryId={categoryId}
            initial={detail.data}
        />
    )
}

function EditCategoryFormInner({
    orgId,
    orgSlug,
    categoryId,
    initial,
}: {
    orgId: string
    orgSlug: string
    categoryId: string
    initial: z.infer<typeof categoryRowSchema>
}) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const update = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            await apiFetch(`/categories/${categoryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, orgId }),
            })
        },
        onSuccess: async () => {
            toast.success("Saved")
            await queryClient.invalidateQueries({
                queryKey: ["category", categoryId],
            })
            await queryClient.invalidateQueries({
                queryKey: ["categories", orgId],
            })
            await navigate({
                to: "/$orgSlug/categories/$categoryId",
                params: { orgSlug, categoryId },
            })
        },
    })

    const form = useForm({
        defaultValues: { name: initial.name },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message ?? "Invalid")
                return
            }
            await update.mutateAsync(parsed.data)
        },
    })

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>Edit category</CardTitle>
                <CardDescription>{initial.id}</CardDescription>
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
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={update.isPending}>
                        {update.isPending ? "Saving…" : "Save"}
                    </Button>
                    <Button variant="outline" type="button" asChild>
                        <Link
                            to="/$orgSlug/categories/$categoryId"
                            params={{ orgSlug, categoryId }}
                        >
                            Cancel
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
