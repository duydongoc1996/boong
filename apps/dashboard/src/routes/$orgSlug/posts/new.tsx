import { useI18nContext } from "@boong/i18n"
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
import { RichTextEditor } from "@/components/rich-text/rich-text-editor"
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
import { breadcrumbI18n } from "@/lib/breadcrumb"
import { translateError } from "@/lib/i18n-errors"
import { extractPlainText } from "@/lib/rich-text/sanitize"
import { postsListSearchDefaults } from "@/lib/table/posts-list-search"

const orgRouteApi = getRouteApi("/$orgSlug")

const schema = z.object({
    title: z.string().min(1).max(200),
    content: z
        .string()
        .min(1)
        .max(100_000)
        .refine((raw) => extractPlainText(raw).trim().length > 0, {
            message: "Content must not be empty",
        }),
})

export const Route = createFileRoute("/$orgSlug/posts/new")({
    staticData: breadcrumbI18n("new"),
    component: NewPostPage,
})

function NewPostPage() {
    const { LL } = useI18nContext()
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
            toast.success(LL.posts.new.success())
            await queryClient.invalidateQueries({ queryKey: ["posts", orgId] })
            await navigate({
                to: "/$orgSlug/posts",
                params: { orgSlug },
                search: postsListSearchDefaults,
            })
        },
        onError: (err) => {
            toast.error(translateError(LL, err))
        },
    })

    const form = useForm({
        defaultValues: { title: "", content: "" },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                toast.error(translateError(LL, parsed.error, "invalidInput"))
                return
            }
            await create.mutateAsync(parsed.data)
        },
    })

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>{LL.posts.new.title()}</CardTitle>
                <CardDescription>{LL.posts.new.description()}</CardDescription>
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
                                <Label htmlFor={field.name}>
                                    {LL.posts.new.fieldTitle()}
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
                    <form.Field name="content">
                        {(field) => (
                            <div className="grid gap-2">
                                <Label htmlFor={field.name}>
                                    {LL.posts.new.fieldContent()}
                                </Label>
                                <RichTextEditor
                                    value={field.state.value}
                                    onChange={(next) =>
                                        field.handleChange(next)
                                    }
                                />
                            </div>
                        )}
                    </form.Field>
                    {create.error ? (
                        <p className="text-destructive text-sm">
                            {translateError(LL, create.error)}
                        </p>
                    ) : null}
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={create.isPending}>
                        {create.isPending
                            ? LL.common.saving()
                            : LL.common.save()}
                    </Button>
                    <Button variant="outline" type="button" asChild>
                        <Link
                            to="/$orgSlug/posts"
                            params={{ orgSlug }}
                            search={postsListSearchDefaults}
                        >
                            {LL.common.cancel()}
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
