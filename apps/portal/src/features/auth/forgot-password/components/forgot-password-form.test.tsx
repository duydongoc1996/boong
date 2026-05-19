import { beforeEach, describe, expect, it, vi } from "vitest"
import { type Locator, userEvent } from "vitest/browser"
import { type RenderResult, render } from "vitest-browser-react"
import { ForgotPasswordForm } from "./forgot-password-form"

const requestPasswordResetMock = vi.fn()

vi.mock("@/data-provider", () => ({
    requestPasswordReset: requestPasswordResetMock,
}))

describe("ForgotPasswordForm", () => {
    let screen: RenderResult
    let emailInput: Locator
    let continueButton: Locator

    beforeEach(async () => {
        vi.clearAllMocks()
        requestPasswordResetMock.mockResolvedValue({ data: {}, error: null })

        screen = await render(<ForgotPasswordForm />)
        emailInput = screen.getByRole("textbox", { name: /^Email$/i })
        continueButton = screen.getByRole("button", { name: /^Continue$/i })
    })

    it("renders email field and continue button", async () => {
        await expect.element(emailInput).toBeInTheDocument()
        await expect.element(continueButton).toBeInTheDocument()
    })

    it("shows validation when submitting empty form", async () => {
        await userEvent.click(continueButton)
        await expect
            .element(screen.getByText(/^Please enter your email\.$/i))
            .toBeInTheDocument()
    })

    it("calls forgetPassword and resets the form on success", async () => {
        await userEvent.fill(emailInput, "a@b.com")
        await userEvent.click(continueButton)

        await vi.waitFor(() =>
            expect(requestPasswordResetMock).toHaveBeenCalledOnce()
        )
        expect(requestPasswordResetMock).toHaveBeenCalledWith(
            expect.objectContaining({ email: "a@b.com" })
        )

        await expect.element(emailInput).toHaveValue("")
    })
})
