import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import type { MemberRow } from "../data/schema"

type DialogType = "invite" | "cancel" | "remove" | "update-role"

type Ctx = {
    open: DialogType | null
    setOpen: (t: DialogType | null) => void
    currentRow: MemberRow | null
    setCurrentRow: React.Dispatch<React.SetStateAction<MemberRow | null>>
    canManage: boolean
}

const MembersContext = React.createContext<Ctx | null>(null)

export function MembersProvider({
    children,
    canManage,
}: {
    children: React.ReactNode
    canManage: boolean
}) {
    const [open, setOpen] = useDialogState<DialogType>(null)
    const [currentRow, setCurrentRow] = useState<MemberRow | null>(null)

    return (
        <MembersContext
            value={{ open, setOpen, currentRow, setCurrentRow, canManage }}
        >
            {children}
        </MembersContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMembers = () => {
    const ctx = React.useContext(MembersContext)
    if (!ctx) {
        throw new Error("useMembers has to be used within <MembersProvider>")
    }
    return ctx
}
