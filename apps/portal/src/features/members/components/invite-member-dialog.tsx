import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
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
import { organization } from "@/data-provider/auth-provider"
import { membersQueryKey } from "../data/members"
import { orgRoleSchema } from "../data/schema"

const formSchema = z.object({
    email: z.email({
        error: (iss) => (iss.input === "" ? "Email is required." : undefined),
    }),
    role: orgRoleSchema,
})

type InviteForm = z.infer<typeof formSchema>

const roleOptions = [
    { label: "Member", value: "member" },
    { label: "Admin", value: "admin" },
    { label: "Owner", value: "owner" },
] as const

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    organizationId: string
}

export function InviteMemberDialog({
    open,
    onOpenChange,
    organizationId,
}: Props) {
    const queryClient = useQueryClient()

    const form = useForm<InviteForm>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", role: "member" },
    })

    const mutation = useMutation({
        mutationFn: async (values: InviteForm) => {
            const r = await organization.inviteMember({
                email: values.email,
                role: values.role,
                organizationId,
            })
            if (r.error) {
                throw new Error(r.error.message ?? "Could not send invitation.")
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: membersQueryKey(organizationId),
            })
            toast.success("Invitation sent.")
            form.reset()
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
                    <DialogTitle>Invite member</DialogTitle>
                    <DialogDescription>
                        Send an email invitation to join this organization.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="invite-member-form"
                        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
                        className="space-y-4"
                    >
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
                                        items={roleOptions.map(
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
                        form="invite-member-form"
                        disabled={mutation.isPending}
                    >
                        Send invitation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
