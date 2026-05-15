import { createFileRoute } from "@tanstack/react-router"
import { PostsListRouteView } from "@/components/resource/posts-list-route-view"
import { breadcrumbI18n } from "@/lib/router-static-data"

export const Route = createFileRoute("/$orgSlug/posts/")({
    staticData: breadcrumbI18n("posts"),
    component: PostsListRouteView,
})
