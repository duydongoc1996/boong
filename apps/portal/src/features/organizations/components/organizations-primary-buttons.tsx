import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrganizations } from "./organizations-provider"

export function OrganizationsPrimaryButtons() {
    const { setOpen } = useOrganizations()
    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen("add")}>
                <span>New Organization</span> <Building2 size={18} />
            </Button>
        </div>
    )
}
