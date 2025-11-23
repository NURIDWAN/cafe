import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '@/app/login/page';

// Mock auth client first
const mockSignInEmail = jest.fn();
const mockSignInSocial = jest.fn();

jest.mock('@/lib/auth-client', () => ({
    authClient: {
        signIn: {
            email: (...args: any[]) => mockSignInEmail(...args),
            social: (...args: any[]) => mockSignInSocial(...args),
        },
    },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(() => ({
        get: jest.fn(() => null),
    })),
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Login Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render login form with all fields', () => {
        render(<SignIn />);

        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
    });

    it('should have required attributes on form inputs', () => {
        render(<SignIn />);

        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        expect(usernameInput).toBeRequired();
        expect(passwordInput).toBeRequired();
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should accept user input for username and password', async () => {
        const user = userEvent.setup();
        render(<SignIn />);

        const usernameInput = screen.getByLabelText(/username or email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin123');

        expect(usernameInput).toHaveValue('admin');
        expect(passwordInput).toHaveValue('admin123');
    });

    it('should render Google sign-in button', () => {
        render(<SignIn />);

        const googleButton = screen.getByRole('button', { name: /login with google/i });
        expect(googleButton).toBeInTheDocument();
    });

    it('should render terms of service and privacy policy links', () => {
        render(<SignIn />);

        expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
    });

    it('should have correct placeholder text', () => {
        render(<SignIn />);

        const usernameInput = screen.getByPlaceholderText(/admin or admin@example.com/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/);

        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    it('should display separator between credential and social login', () => {
        render(<SignIn />);

        expect(screen.getByText(/or continue with/i)).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
        render(<SignIn />);

        const form = screen.getByRole('button', { name: /^sign in$/i }).closest('form');
        expect(form).toBeInTheDocument();
    });
});
