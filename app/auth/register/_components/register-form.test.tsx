import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RegisterForm from "./register-form";
import { registerStudentAction, registerTeacherAction } from "@/actions/public/auth";

// Mock next/navigation
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock server actions
vi.mock("@/actions/public/auth", () => ({
    registerStudentAction: vi.fn(),
    registerTeacherAction: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("RegisterForm", () => {
    it("renders the registration form correctly", () => {
        render(<RegisterForm />);

        expect(screen.getByText("إنشاء حساب")).toBeInTheDocument();
        expect(screen.getByLabelText(/الاسم الكامل/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/البريد الإلكتروني/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(screen.getByText("طالب")).toBeInTheDocument();
        expect(screen.getByText("معلم")).toBeInTheDocument();
    });

    it("switches roles when clicking role buttons", async () => {
        render(<RegisterForm />);

        const teacherButton = screen.getByText("معلم");
        fireEvent.click(teacherButton);

        expect(screen.getByText("إنشاء حساب معلم")).toBeInTheDocument();

        const studentButton = screen.getByText("طالب");
        fireEvent.click(studentButton);

        expect(screen.getByText("إنشاء حساب طالب")).toBeInTheDocument();
    });

    it("shows validation errors for empty fields on submit", async () => {
        render(<RegisterForm />);

        const submitButton = screen.getByRole("button", { name: /إنشاء حساب طالب/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("الاسم مطلوب")).toBeInTheDocument();
            expect(screen.getByText("البريد الإلكتروني مطلوب")).toBeInTheDocument();
            expect(screen.getByText("كلمة المرور يجب أن تكون 6 أحرف على الأقل")).toBeInTheDocument();
        });
    });

    it("shows error for mismatched passwords", async () => {
        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/الاسم الكامل/i), { target: { value: "سليمان" } });
        fireEvent.change(screen.getByLabelText(/البريد الإلكتروني/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/تأكيد كلمة المرور/i), { target: { value: "different_password" } });

        const submitButton = screen.getByRole("button", { name: /إنشاء حساب طالب/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("كلمات المرور غير متطابقة")).toBeInTheDocument();
        });
    });

    it("calls registerStudentAction on successful student registration", async () => {
        const mockAction = vi.mocked(registerStudentAction).mockResolvedValue({
            success: true,
            redirectTo: "/dashboard/student"
        });

        render(<RegisterForm />);

        fireEvent.change(screen.getByLabelText(/الاسم الكامل/i), { target: { value: "Suleiman" } });
        fireEvent.change(screen.getByLabelText(/البريد الإلكتروني/i), { target: { value: "student@example.com" } });
        fireEvent.change(screen.getByLabelText(/كلمة المرور/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/تأكيد كلمة المرور/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/كلمة مرور المحفظة/i), { target: { value: "1234" } });
        fireEvent.change(screen.getByLabelText(/رقم حساب شام كاش/i), { target: { value: "123456" } });

        const submitButton = screen.getByRole("button", { name: /إنشاء حساب طالب/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalledWith(expect.objectContaining({
                name: "Suleiman",
                email: "student@example.com"
            }));
        });
    });
});
