import { createFileRoute } from "@tanstack/react-router"
import { PostsListRouteView } from "@/components/resource/posts-list-route-view"
import { breadcrumbI18n } from "@/lib/router-static-data"
import {
    postsListSearchDefaults,
    postsListSearchSchema,
} from "@/lib/table/posts-list-search"

export const Route = createFileRoute("/$orgSlug/posts/")({
    staticData: breadcrumbI18n("posts"),
    validateSearch: (raw) =>
        postsListSearchSchema.parse({
            ...postsListSearchDefaults,
            ...(typeof raw === "object" && raw !== null ? raw : {}),
        }),
    component: PostsListRouteView,
})
