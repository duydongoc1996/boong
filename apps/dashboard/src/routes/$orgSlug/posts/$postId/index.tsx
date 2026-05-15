import { useQuery } from "@tanstack/react-query"
import {
    createFileRoute,
    getRouteApi,
    Link,
    useParams,
} from "@tanstack/react-router"
import { z } from "zod"
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
import { breadcrumbI18n } from "@/lib/router-static-data"
import { postsListSearchDefaults } from "@/lib/table/posts-list-search"

const orgRouteApi = getRouteApi("/$orgSlug")

const envelope = z.object({ data: postRowSchema.nullable() })

export const Route = createFileRoute("/$orgSlug/posts/$postId/")({
    staticData: breadcrumbI18n("post"),
    component: ShowPostPage,
})

function ShowPostPage() {
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
        return <p className="text-muted-foreground text-sm">Loading…</p>
    }
    if (!q.data) {
        return <p className="text-destructive text-sm">Post not found.</p>
    }

    return (
        <Card className="max-w-xl">
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
                        Edit
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm whitespace-pre-wrap">{q.data.content}</p>
                <Button variant="ghost" size="sm" asChild>
                    <Link
                        to="/$orgSlug/posts"
                        params={{ orgSlug }}
                        search={postsListSearchDefaults}
                    >
                        Back to list
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
