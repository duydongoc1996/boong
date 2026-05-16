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
    email: z.string().email(),
    password: z.string().min(8),
})

export const Route = createFileRoute("/signin")({
    component: SignInPage,
})

function SignInPage() {
    const navigate = useNavigate()
    const { LL } = useI18nContext()

    const signIn = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const { error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            })
            if (error) {
                throw error
            }
        },
        onSuccess: async () => {
            toast.success(LL.signIn.success())
            await navigate({ to: "/home" })
        },
        onError: (error) => {
            toast.error(translateError(LL, error, "signInFailed"))
        },
    })

    const form = useForm({
        defaultValues: { email: "", password: "" },
        onSubmit: async ({ value }) => {
            const parsed = schema.safeParse(value)
            if (!parsed.success) {
                toast.error(translateError(LL, parsed.error, "invalidInput"))
                return
            }
            await signIn.mutateAsync(parsed.data)
        },
    })

    return (
        <div className="flex min-h-svh items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{LL.signIn.title()}</CardTitle>
                    <CardDescription>{LL.signIn.description()}</CardDescription>
                </CardHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        void form.handleSubmit()
                    }}
                >
                    <CardContent className="grid gap-4">
                        <form.Field name="email">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor={field.name}>
                                        {LL.signIn.fieldEmail()}
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
                                        {LL.signIn.fieldPassword()}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        type="password"
                                        value={field.state.value}
                                        onChange={(ev) =>
                                            field.handleChange(ev.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        autoComplete="current-password"
                                    />
                                    {field.state.meta.errors[0] ? (
                                        <p className="text-destructive text-sm">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        </form.Field>
                        {signIn.error ? (
                            <p className="text-destructive text-sm">
                                {translateError(
                                    LL,
                                    signIn.error,
                                    "signInFailed"
                                )}
                            </p>
                        ) : null}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <Button
                            type="submit"
                            disabled={signIn.isPending}
                            className="w-full sm:w-auto"
                        >
                            {signIn.isPending
                                ? LL.signIn.submitting()
                                : LL.signIn.submit()}
                        </Button>
                        <Button
                            variant="ghost"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link to="/signup">
                                {LL.signIn.createAccountLink()}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
