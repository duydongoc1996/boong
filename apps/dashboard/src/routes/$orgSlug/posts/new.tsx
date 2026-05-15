import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { breadcrumbI18n } from "@/lib/router-static-data"
import { postsListSearchDefaults } from "@/lib/table/posts-list-search"

const orgRouteApi = getRouteApi("/$orgSlug")

const schema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
})

export const Route = createFileRoute("/$orgSlug/posts/new")({
    staticData: breadcrumbI18n("new"),
    component: NewPostPage,
})

function NewPostPage() {
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug } = useParams({ strict: false }) as { orgSlug: string }
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const create = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            await apiFetch("/posts", {
                method: "POST",
                orgId,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
        },
        onSuccess: async () => {
            toast.success("Post created")
            await queryClient.invalidateQueries({ queryKey: ["posts", orgId] })
            await navigate({
                to: "/$orgSlug/posts",
                params: { orgSlug },
                search: postsListSearchDefaults,
            })
        },
    })

    const form = useForm({
        defaultValues: { title: "", content: "" },
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
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>New post</CardTitle>
                <CardDescription>
                    Create a post in this organization.
                </CardDescription>
            </CardHeader>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    void form.handleSubmit()
                }}
            >
                <CardContent className="grid gap-4">
                    <form.Field name="title">
                        {(field) => (
                            <div className="grid gap-2">
                                <Label htmlFor={field.name}>Title</Label>
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
                    <form.Field name="content">
                        {(field) => (
                            <div className="grid gap-2">
                                <Label htmlFor={field.name}>Content</Label>
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
                <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={create.isPending}>
                        {create.isPending ? "Saving…" : "Save"}
                    </Button>
                    <Button variant="outline" type="button" asChild>
                        <Link
                            to="/$orgSlug/posts"
                            params={{ orgSlug }}
                            search={postsListSearchDefaults}
                        >
                            Cancel
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
