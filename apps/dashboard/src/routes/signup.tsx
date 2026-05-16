import { useI18nContext } from "@boong/i18n"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
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
import { authClient } from "@/lib/auth-client"
import { translateError } from "@/lib/i18n-errors"

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
})

export const Route = createFileRoute("/signup")({
    component: SignUpPage,
})

function SignUpPage() {
    const navigate = useNavigate()
    const { LL } = useI18nContext()

    const signUp = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const { error } = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
            })
            if (error) {
                throw error
            }
        },
        onSuccess: () => {
            toast.success(LL.signUp.success())
            navigate({ to: "/signin" })
        },
        onError: (error) => {
            toast.error(translateError(LL, error, "signUpFailed"))
        },
    })

    const form = useForm({
        defaultValues: { name: "", email: "", password: "" },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                toast.error(translateError(LL, parsed.error, "invalidInput"))
                return
            }
            await signUp.mutateAsync(parsed.data)
        },
    })

    return (
        <div className="flex min-h-svh items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{LL.signUp.title()}</CardTitle>
                    <CardDescription>{LL.signUp.description()}</CardDescription>
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
                                        {LL.signUp.fieldName()}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onChange={(ev) =>
                                            field.handleChange(ev.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        autoComplete="name"
                                    />
                                    {field.state.meta.errors[0] ? (
                                        <p className="text-destructive text-sm">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="email">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>
                                        {LL.signUp.fieldEmail()}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        type="email"
                                        value={field.state.value}
                                        onChange={(ev) =>
                                            field.handleChange(ev.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        autoComplete="email"
                                    />
                                    {field.state.meta.errors[0] ? (
                                        <p className="text-destructive text-sm">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="password">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>
                                        {LL.signUp.fieldPassword()}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        type="password"
                                        value={field.state.value}
                                        onChange={(ev) =>
                                            field.handleChange(ev.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        autoComplete="new-password"
                                    />
                                    {field.state.meta.errors[0] ? (
                                        <p className="text-destructive text-sm">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        </form.Field>
                        {signUp.error ? (
                            <p className="text-destructive text-sm">
                                {translateError(
                                    LL,
                                    signUp.error,
                                    "signUpFailed"
                                )}
                            </p>
                        ) : null}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <Button
                            type="submit"
                            disabled={signUp.isPending}
                            className="w-full sm:w-auto"
                        >
                            {signUp.isPending
                                ? LL.signUp.submitting()
                                : LL.signUp.submit()}
                        </Button>
                        <Button
                            variant="ghost"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link to="/signin">
                                {LL.signUp.haveAccountLink()}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
