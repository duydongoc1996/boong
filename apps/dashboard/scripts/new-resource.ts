#!/usr/bin/env bun
/**
 * Scaffold org-scoped CRUD routes + a list view stub.
 *
 * Usage: bun run new-resource -- tags
 */
import fs from "node:fs"
import path from "node:path"

const name = process.argv[2]
if (!name || !/^[a-z][a-z0-9-]*$/i.test(name)) {
    console.error('Usage: bun run new-resource -- <name>   e.g. "tags"')
    process.exit(1)
}

const slug = name.toLowerCase()
const pascal = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")

const root = path.resolve(import.meta.dir, "..")
const routesDir = path.join(root, "src", "routes", "$orgSlug", slug)
const idDir = path.join(routesDir, "$id")
const componentPath = path.join(
    root,
    "src",
    "components",
    "resource",
    `${slug}-list-route-view.tsx`
)

fs.mkdirSync(idDir, { recursive: true })

const listRouteFile = `import { createFileRoute } from "@tanstack/react-router"
import { ${pascal}ListRouteView } from "@/components/resource/${slug}-list-route-view"

export const Route = createFileRoute("/$orgSlug/${slug}/")({
    component: ${pascal}ListRouteView,
})
`

const newRouteFile = `import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/$orgSlug/${slug}/new")({
    component: NewPage,
})

function NewPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>New ${pascal}</CardTitle>
                <CardDescription>
                    Replace with POST <code className="text-xs">/api/${slug}</code>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
`

const showRouteFile = `import { createFileRoute } from "@tanstack/react-router"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/$orgSlug/${slug}/$id")({
    component: ShowPage,
})

function ShowPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>${pascal} detail</CardTitle>
                <CardDescription>
                    Replace with GET{" "}
                    <code className="text-xs">/api/${slug}/:id</code>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
`

const listViewFile = `import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getRouteApi } from "@tanstack/react-router"

const orgRouteApi = getRouteApi("/$orgSlug")

export function ${pascal}ListRouteView() {
    orgRouteApi.useLoaderData()
    return (
        <Card>
            <CardHeader>
                <CardTitle>${pascal}</CardTitle>
                <CardDescription>
                    Generated stub — connect to{" "}
                    <code className="text-xs">/api/${slug}</code> and TanStack Table
                    (see posts/categories).
                </CardDescription>
            </CardHeader>
        </Card>
    )
}
`

fs.writeFileSync(path.join(routesDir, "index.tsx"), listRouteFile)
fs.writeFileSync(path.join(routesDir, "new.tsx"), newRouteFile)
fs.writeFileSync(path.join(idDir, "index.tsx"), showRouteFile)
fs.writeFileSync(componentPath, listViewFile)

console.log(
    `Created ${path.relative(root, routesDir)} and ${path.relative(root, componentPath)}`
)
