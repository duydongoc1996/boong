import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { PasswordInput } from "@/components/password-input"
import { SelectDropdown } from "@/components/select-dropdown"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { admin } from "@/data-provider/auth-provider"
import { roles } from "../data/data"
import type { User } from "../data/schema"

const baseSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.email({
        error: (iss) => (iss.input === "" ? "Email is required." : undefined),
    }),
    role: z.enum(["admin", "user"]),
    password: z.string(),
    isEdit: z.boolean(),
})

const formSchema = baseSchema.refine(
    ({ isEdit, password }) => (isEdit ? true : password.trim().length >= 8),
    {
        message: "Password must be at least 8 characters.",
        path: ["password"],
    }
)

type UserActionForm = z.infer<typeof formSchema>

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: User
}

export function UsersActionDialog({ open, onOpenChange, currentRow }: Props) {
    const isEdit = !!currentRow
    const queryClient = useQueryClient()

    const form = useForm<UserActionForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: currentRow?.name ?? "",
            email: currentRow?.email ?? "",
            role: currentRow?.role ?? "user",
            password: "",
            isEdit,
        },
    })

    useEffect(() => {
        form.reset({
            name: currentRow?.name ?? "",
            email: currentRow?.email ?? "",
            role: currentRow?.role ?? "user",
            password: "",
            isEdit,
        })
    }, [currentRow, isEdit, form])

    const mutation = useMutation({
        mutationFn: async (values: UserActionForm) => {
            if (isEdit && currentRow) {
                if (values.role !== currentRow.role) {
                    const r = await admin.setRole({
                        userId: currentRow.id,
                        role: values.role,
                    })
                    if (r.error) {
                        throw new Error(
                            r.error.message ?? "Could not update role."
                        )
                    }
                }
                if (values.password) {
                    const r = await admin.setUserPassword({
                        userId: currentRow.id,
                        newPassword: values.password,
                    })
                    if (r.error) {
                        throw new Error(
                            r.error.message ?? "Could not update password."
                        )
                    }
                }
                return
            }

            const r = await admin.createUser({
                name: values.name,
                email: values.email,
                password: values.password ?? "",
                role: values.role,
            })
            if (r.error) {
                throw new Error(r.error.message ?? "Could not create user.")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
            toast.success(isEdit ? "User updated." : "User created.")
            onOpenChange(false)
        },
        onError: (err: Error) => {
            toast.error(err.message)
        },
    })

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-start">
                    <DialogTitle>
                        {isEdit ? "Edit user" : "Add user"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the user's role or reset their password."
                            : "Create a new user with email and password."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="users-action-form"
                        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jane Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="jane@example.com"
                                            disabled={isEdit}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <SelectDropdown
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="Select a role"
                                        items={roles.map(
                                            ({ label, value }) => ({
                                                label,
                                                value,
                                            })
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {isEdit
                                            ? "New password (optional)"
                                            : "Password"}
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter className="gap-y-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="users-action-form"
                        disabled={mutation.isPending}
                    >
                        {isEdit ? "Save" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
