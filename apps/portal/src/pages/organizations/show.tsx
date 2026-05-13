import { useShow } from "@refinedev/core"
import type { Organization } from "better-auth/client"
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

export const OrganizationShow = () => {
    const { result: record } = useShow<Organization>({
        dataProviderName: "org",
        resource: "organizations",
    })

    return (
        <ShowView>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{record?.name}</CardTitle>
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
                            <h4 className="text-sm font-medium mb-2">Slug</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.slug ? record.slug : "-"}
                            </p>
                        </div>

                        <Separator />

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
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    )
}
