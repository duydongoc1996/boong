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

const orgRouteApi = getRouteApi("/$orgSlug")

const schema = z.object({
    name: z.string().min(1),
})

export const Route = createFileRoute("/$orgSlug/categories/new")({
    staticData: breadcrumbI18n("new"),
    component: NewCategoryPage,
})

function NewCategoryPage() {
    const { LL } = useI18nContext()
    const { orgId } = orgRouteApi.useLoaderData()
    const { orgSlug } = useParams({ strict: false }) as { orgSlug: string }
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const create = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            await apiFetch("/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, orgId }),
            })
        },
        onSuccess: async () => {
            toast.success(LL.categories.new.success())
            await queryClient.invalidateQueries({
                queryKey: ["categories", orgId],
            })
            await navigate({
                to: "/$orgSlug/categories",
                params: { orgSlug },
            })
        },
        onError: (err) => {
            toast.error(translateError(LL, err))
        },
    })

    const form = useForm({
        defaultValues: { name: "" },
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
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>{LL.categories.new.title()}</CardTitle>
                <CardDescription>
                    {LL.categories.new.description()}
                </CardDescription>
            </CardHeader>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    void form.handleSubmit()
                }}
            >
                <CardContent className="grid gap-4">
                    <form.Field name="name">
                        {(field) => (
                            <div className="grid gap-2">
                                <Label htmlFor={field.name}>
                                    {LL.categories.new.fieldName()}
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
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={create.isPending}>
                        {create.isPending
                            ? LL.common.saving()
                            : LL.common.save()}
                    </Button>
                    <Button variant="outline" type="button" asChild>
                        <Link to="/$orgSlug/categories" params={{ orgSlug }}>
                            {LL.common.cancel()}
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
