import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { Loader2, LogIn } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { IconFacebook, IconGithub } from "@/assets/brand-icons"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { resetAuthAtoms, signIn } from "@/data-provider/auth-provider"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    email: z.email({
        error: (iss) =>
            iss.input === "" ? "Please enter your email." : undefined,
    }),
    password: z
        .string()
        .min(1, "Please enter your password.")
        .min(7, "Password must be at least 7 characters long."),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
    redirectTo?: string
}

export function UserAuthForm({
    className,
    redirectTo,
    ...props
}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)

        const result = await signIn.email({
            email: data.email,
            password: data.password,
        })

        setIsLoading(false)

        if (result.error) {
            toast.error(result.error.message ?? "Sign in failed.")
            return
        }

        resetAuthAtoms()
        toast.success(`Welcome back, ${data.email}!`)
        navigate({ to: redirectTo || "/", replace: true })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("grid gap-3", className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="name@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            <Link
                                to="/forgot-password"
                                className="absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75"
                            >
                                Forgot password?
                            </Link>
                        </FormItem>
                    )}
                />
                <Button className="mt-2" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <LogIn />
                    )}
                    Sign in
                </Button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                    >
                        <IconGithub className="h-4 w-4" /> GitHub
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                    >
                        <IconFacebook className="h-4 w-4" /> Facebook
                    </Button>
                </div>
            </form>
        </Form>
    )
}
