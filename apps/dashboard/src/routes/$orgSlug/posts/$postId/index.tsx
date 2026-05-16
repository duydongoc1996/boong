import { useI18nContext } from "@boong/i18n"
import { useQuery } from "@tanstack/react-query"
import {
    createFileRoute,
    getRouteApi,
    Link,
    useParams,
} from "@tanstack/react-router"
import { z } from "zod"
import { RichTextViewer } from "@/components/rich-text/rich-text-viewer"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { apiFetch } from "@/lib/api/http"
import { postRowSchema } from "@/lib/api/schemas"
import { breadcrumbI18n } from "@/lib/breadcrumb"
import { postsListSearchDefaults } from "@/lib/table/posts-list-search"

const orgRouteApi = getRouteApi("/$orgSlug")

const envelope = z.object({ data: postRowSchema.nullable() })

export const Route = createFileRoute("/$orgSlug/posts/$postId/")({
    staticData: breadcrumbI18n("post"),
    component: ShowPostPage,
})

function ShowPostPage() {
    const { LL } = useI18nContext()
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug, postId } = useParams({
        strict: false,
    }) as { orgSlug: string; postId: string }

    const q = useQuery({
        queryKey: ["post", orgId, postId],
        queryFn: async () => {
            const raw = await apiFetch<unknown>(`/posts/${postId}`, { orgId })
            return envelope.parse(raw).data
        },
    })

    if (q.isLoading) {
        return (
            <p className="text-muted-foreground text-sm">
                {LL.common.loading()}
            </p>
        )
    }
    if (!q.data) {
        return (
            <p className="text-destructive text-sm">
                {LL.posts.show.notFound()}
            </p>
        )
    }

    return (
        <Card className="max-w-3xl">
            <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                    <CardTitle>{q.data.title}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                        {q.data.id}
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link
                        to="/$orgSlug/posts/$postId/edit"
                        params={{ orgSlug, postId }}
                    >
                        {LL.common.edit()}
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                <RichTextViewer value={q.data.content} />
                <Button variant="ghost" size="sm" asChild>
                    <Link
                        to="/$orgSlug/posts"
                        params={{ orgSlug }}
                        search={postsListSearchDefaults}
                    >
                        {LL.common.backToList()}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
