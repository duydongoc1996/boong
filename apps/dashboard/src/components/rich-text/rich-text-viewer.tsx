import { useMemo } from "react"
import { extractPlainText } from "@/lib/rich-text/sanitize"
import { cn } from "@/utils"

type RichTextViewerProps = {
    value: string
    className?: string
}

export function RichTextViewer({ value, className }: RichTextViewerProps) {
    const text = useMemo(() => extractPlainText(value), [value])

    return (
        <div
            className={cn(
                "text-foreground whitespace-pre-wrap text-sm leading-relaxed",
                className
            )}
        >
            {text}
        </div>
    )
}
