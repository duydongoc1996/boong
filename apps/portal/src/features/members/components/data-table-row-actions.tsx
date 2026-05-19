import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { Row } from "@tanstack/react-table"
import { Ban, ShieldCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MemberRow } from "../data/schema"
import { useMembers } from "./members-provider"

type Props = { row: Row<MemberRow> }

export function DataTableRowActions({ row }: Props) {
    const { setOpen, setCurrentRow, canManage } = useMembers()
    const r = row.original
    const canCancel = canManage && r.status === "pending"
    const canUpdateRole =
        canManage && r.status === "joined" && r.role !== "owner"
    const canRemove = canManage && r.status === "joined" && r.role !== "owner"

    if (!canCancel && !canUpdateRole && !canRemove) {
        return null
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                {canCancel && (
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(r)
                            setOpen("cancel")
                        }}
                    >
                        Cancel invitation
                        <DropdownMenuShortcut>
                            <Ban size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
                {canUpdateRole && (
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(r)
                            setOpen("update-role")
                        }}
                    >
                        Update role
                        <DropdownMenuShortcut>
                            <ShieldCheck size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                )}
                {canRemove && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(r)
                                setOpen("remove")
                            }}
                            className="text-red-500!"
                        >
                            Remove member
                            <DropdownMenuShortcut>
                                <Trash2 size={16} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
