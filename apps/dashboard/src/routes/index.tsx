import { useI18nContext } from "@boong/i18n"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/")({
    beforeLoad: async () => {
        const session = await authClient.getSession()
        if (session.data?.session) {
            throw redirect({ to: "/home" })
        }
    },
    component: IndexPage,
})

function IndexPage() {
    const { LL } = useI18nContext()
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{LL.landing.title()}</CardTitle>
                    <CardDescription>
                        {LL.landing.description()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link to="/signin">{LL.landing.signIn()}</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/signup">{LL.landing.signUp()}</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
