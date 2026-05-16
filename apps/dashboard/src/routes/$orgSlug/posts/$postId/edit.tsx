import { useI18nContext } from "@boong/i18n"
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
import { postRowSchema } from "@/lib/api/schemas"
import { breadcrumbI18n } from "@/lib/breadcrumb"
import { translateError } from "@/lib/i18n-errors"
import {
    contentToEditableText,
    extractPlainText,
} from "@/lib/rich-text/sanitize"

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

const one = z.object({ data: postRowSchema.nullable() })

export const Route = createFileRoute("/$orgSlug/posts/$postId/edit")({
    staticData: breadcrumbI18n("edit"),
    component: EditPostPage,
})

function EditPostPage() {
    const { LL } = useI18nContext()
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug, postId } = useParams({
        strict: false,
    }) as { orgSlug: string; postId: string }

    const detail = useQuery({
        queryKey: ["post", orgId, postId],
        queryFn: async () => {
            const raw = await apiFetch<unknown>(`/posts/${postId}`, { orgId })
            return one.parse(raw).data
        },
    })

    if (detail.isLoading || !detail.data) {
        return (
            <p className="text-muted-foreground text-sm">
                {LL.common.loading()}
            </p>
        )
    }

    return (
        <EditPostFormInner
            orgId={orgId}
            orgSlug={orgSlug}
            postId={postId}
            initial={detail.data}
        />
    )
}

function EditPostFormInner({
    orgId,
    orgSlug,
    postId,
    initial,
}: {
    orgId: string
    orgSlug: string
    postId: string
    initial: z.infer<typeof postRowSchema>
}) {
    const { LL } = useI18nContext()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const update = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            await apiFetch(`/posts/${postId}`, {
                method: "PATCH",
                orgId,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    orgId,
                }),
            })
        },
        onSuccess: async () => {
            toast.success(LL.common.saved())
            await queryClient.invalidateQueries({
                queryKey: ["post", orgId, postId],
            })
            await queryClient.invalidateQueries({ queryKey: ["posts", orgId] })
            await navigate({
                to: "/$orgSlug/posts/$postId",
                params: { orgSlug, postId },
            })
        },
        onError: (err) => {
            toast.error(translateError(LL, err))
        },
    })

    const form = useForm({
        defaultValues: {
            title: initial.title,
            content: contentToEditableText(initial.content),
        },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                toast.error(translateError(LL, parsed.error, "invalidInput"))
                return
            }
            await update.mutateAsync(parsed.data)
        },
    })

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>{LL.posts.edit.title()}</CardTitle>
                <CardDescription>{initial.id}</CardDescription>
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
                                    {LL.posts.edit.fieldTitle()}
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
                                    {LL.posts.edit.fieldContent()}
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
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={update.isPending}>
                        {update.isPending
                            ? LL.common.saving()
                            : LL.common.save()}
                    </Button>
                    <Button variant="outline" type="button" asChild>
                        <Link
                            to="/$orgSlug/posts/$postId"
                            params={{ orgSlug, postId }}
                        >
                            {LL.common.cancel()}
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
