import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const orgApi = getRouteApi("/$orgSlug")

export const Route = createFileRoute("/$orgSlug/")({
    component: OrgHome,
})

function OrgHome() {
    const { org } = orgApi.useLoaderData()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>
                    Organization workspace for{" "}
                    <span className="font-mono">{org.slug}</span>. Pick a
                    section from the sidebar to manage resources.
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
