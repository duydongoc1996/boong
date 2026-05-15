import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useParams } from "@tanstack/react-router"
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
import { categoryRowSchema } from "@/lib/api/schemas"
import { breadcrumbI18n } from "@/lib/router-static-data"

const envelope = z.object({ data: categoryRowSchema.nullable() })

export const Route = createFileRoute("/$orgSlug/categories/$categoryId/")({
    staticData: breadcrumbI18n("category"),
    component: ShowCategoryPage,
})

function ShowCategoryPage() {
    const { orgSlug, categoryId } = useParams({
        strict: false,
    }) as { orgSlug: string; categoryId: string }

    const q = useQuery({
        queryKey: ["category", categoryId],
        queryFn: async () => {
            const raw = await apiFetch<unknown>(`/categories/${categoryId}`)
            return envelope.parse(raw).data
        },
    })

    if (q.isLoading) {
        return <p className="text-muted-foreground text-sm">Loading…</p>
    }
    if (!q.data) {
        return <p className="text-destructive text-sm">Not found.</p>
    }

    return (
        <Card className="max-w-md">
            <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                    <CardTitle>{q.data.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                        {q.data.id}
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link
                        to="/$orgSlug/categories/$categoryId/edit"
                        params={{ orgSlug, categoryId }}
                    >
                        Edit
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/$orgSlug/categories" params={{ orgSlug }}>
                        Back to list
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
