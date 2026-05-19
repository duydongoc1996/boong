import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
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
import { requestPasswordReset } from "@/data-provider/auth-provider"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    email: z.email({
        error: (iss) =>
            iss.input === "" ? "Please enter your email." : undefined,
    }),
})

export function ForgotPasswordForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLFormElement>) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)

        const result = await requestPasswordReset({
            email: data.email,
            redirectTo: `${window.location.origin}/reset-password`,
        })

        setIsLoading(false)

        if (result.error) {
            toast.error(result.error.message ?? "Could not send reset email.")
            return
        }

        form.reset()
        toast.success(`Email sent to ${data.email}`)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("grid gap-2", className)}
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
                <Button className="mt-2" disabled={isLoading}>
                    Continue
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <ArrowRight />
                    )}
                </Button>
            </form>
        </Form>
    )
}
