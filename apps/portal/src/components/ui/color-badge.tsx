import { Badge } from "@/components/ui/badge"

export function BlueBadge({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {children}
            </Badge>
        </div>
    )
}

export function GreenBadge({ children }: { children: React.ReactNode }) {
    return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            {children}
        </Badge>
    )
}

export function SkyBadge({ children }: { children: React.ReactNode }) {
    return (
        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {children}
        </Badge>
    )
}

export function PurpleBadge({ children }: { children: React.ReactNode }) {
    return (
        <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            {children}
        </Badge>
    )
}

export function RedBadge({ children }: { children: React.ReactNode }) {
    return (
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
            {children}
        </Badge>
    )
}
