import { useShow } from "@refinedev/core"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ShowView } from "@/components/refine-ui/views/show-view"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Post } from "./types"

export const PostShow = () => {
    const { result: record } = useShow<Post>({})

    return (
        <ShowView>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{record?.title}</CardTitle>
                        <CardDescription>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    ID: {record?.id}
                                </span>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Created At
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.createdAt
                                    ? new Date(
                                          record.createdAt
                                      ).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-4">
                                Content
                            </h4>
                            <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert">
                                {record?.content ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {record.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No content available
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    )
}
