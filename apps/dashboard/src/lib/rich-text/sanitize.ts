import DOMPurify from "isomorphic-dompurify"
import { z } from "zod"

const inlineContentSchema: z.ZodType<unknown> = z.lazy(() =>
    z.union([
        z.string(),
        z.object({
            type: z.string(),
            text: z.string().optional(),
            styles: z.record(z.string(), z.unknown()).optional(),
            href: z.string().optional(),
            content: z.array(inlineContentSchema).optional(),
        }),
    ])
)

const blockSchema: z.ZodType<unknown> = z.lazy(() =>
    z.object({
        id: z.string().optional(),
        type: z.string(),
        props: z.record(z.string(), z.unknown()).optional(),
        content: z.union([z.array(inlineContentSchema), z.string()]).optional(),
        children: z.array(blockSchema).optional(),
    })
)

const richTextDocumentSchema = z.array(blockSchema)

function parseRichTextDocument(raw: string): unknown[] | null {
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        const result = richTextDocumentSchema.safeParse(parsed)
        return result.success ? (result.data as unknown[]) : null
    } catch {
        return null
    }
}

/** Plain text suitable for a simple editor when stored content is a JSON document. */
export function contentToEditableText(raw: string): string {
    const doc = parseRichTextDocument(raw)
    if (doc !== null && doc.length > 0) return extractPlainText(raw)
    return raw
}

export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
    })
}

export function extractPlainText(raw: string): string {
    const doc = parseRichTextDocument(raw)
    if (!doc) return raw

    const parts: string[] = []
    const walk = (nodes: unknown[]) => {
        for (const node of nodes) {
            if (typeof node === "string") {
                parts.push(node)
                continue
            }
            if (!node || typeof node !== "object") continue
            const obj = node as Record<string, unknown>
            if (typeof obj.text === "string") {
                parts.push(obj.text)
            }
            if (Array.isArray(obj.content)) {
                walk(obj.content)
            }
            if (Array.isArray(obj.children)) {
                walk(obj.children)
            }
        }
    }
    walk(doc)
    return parts.join(" ").replace(/\s+/g, " ").trim()
}
