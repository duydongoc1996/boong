import { beforeEach, describe, expect, it, vi } from "vitest"
import { type Locator, userEvent } from "vitest/browser"
import { type RenderResult, render } from "vitest-browser-react"
import { SignUpForm } from "./sign-up-form"

const FORM_MESSAGES = {
    nameEmpty: "Please enter your name.",
    emailEmpty: "Please enter your email.",
    passwordEmpty: "Please enter your password.",
    confirmPasswordEmpty: "Please confirm your password.",
    passwordMismatch: "Passwords don't match.",
} as const

const navigate = vi.fn()
const signUpEmail = vi.fn()

vi.mock("@/data-provider", () => ({
    signUp: {
        email: signUpEmail,
    },
}))

vi.mock("@tanstack/react-router", async (importOriginal) => {
    const actual =
        await importOriginal<typeof import("@tanstack/react-router")>()
    return {
        ...actual,
        useNavigate: () => navigate,
    }
})

describe("SignUpForm", () => {
    let screen: RenderResult
    let nameInput: Locator
    let emailInput: Locator
    let passwordInput: Locator
    let confirmPasswordInput: Locator
    let submitButton: Locator

    beforeEach(async () => {
        vi.clearAllMocks()
        signUpEmail.mockResolvedValue({ data: { user: {} }, error: null })

        screen = await render(<SignUpForm />)
        nameInput = screen.getByRole("textbox", { name: /^Name$/i })
        emailInput = screen.getByRole("textbox", { name: /^Email$/i })
        passwordInput = screen.getByLabelText(/^Password$/i)
        confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/i)
        submitButton = screen.getByRole("button", { name: /^Create Account$/i })
    })

    it("renders fields and submit button", async () => {
        await expect.element(nameInput).toBeInTheDocument()
        await expect.element(emailInput).toBeInTheDocument()
        await expect.element(passwordInput).toBeInTheDocument()
        await expect.element(confirmPasswordInput).toBeInTheDocument()
        await expect.element(submitButton).toBeInTheDocument()
    })

    it("shows validation messages when submitting empty form", async () => {
        await userEvent.click(submitButton)

        await expect
            .element(screen.getByText(FORM_MESSAGES.nameEmpty))
            .toBeInTheDocument()
        await expect
            .element(screen.getByText(FORM_MESSAGES.emailEmpty))
            .toBeInTheDocument()
        await expect
            .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
            .toBeInTheDocument()
        await expect
            .element(screen.getByText(FORM_MESSAGES.confirmPasswordEmpty))
            .toBeInTheDocument()
    })

    it("shows a mismatch error when passwords do not match", async () => {
        await userEvent.fill(nameInput, "Jane")
        await userEvent.fill(emailInput, "a@b.com")
        await userEvent.fill(passwordInput, "1234567")
        await userEvent.fill(confirmPasswordInput, "7654321")

        await userEvent.click(submitButton)
        await expect
            .element(screen.getByText(FORM_MESSAGES.passwordMismatch))
            .toBeInTheDocument()
    })

    it("calls signUp.email and navigates on success", async () => {
        await userEvent.fill(nameInput, "Jane")
        await userEvent.fill(emailInput, "a@b.com")
        await userEvent.fill(passwordInput, "1234567")
        await userEvent.fill(confirmPasswordInput, "1234567")

        await userEvent.click(submitButton)

        await vi.waitFor(() => expect(signUpEmail).toHaveBeenCalledOnce())
        expect(signUpEmail).toHaveBeenCalledWith({
            name: "Jane",
            email: "a@b.com",
            password: "1234567",
        })
        await vi.waitFor(() =>
            expect(navigate).toHaveBeenCalledWith({ to: "/", replace: true })
        )
    })
})
