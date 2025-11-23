import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/contact/contact-form';

// Mock the server action
jest.mock('@/app/actions/contact', () => ({
    submitContactMessage: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('ContactForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all form fields', () => {
        render(<ContactForm />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should have required attributes on inputs', () => {
        render(<ContactForm />);

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const messageInput = screen.getByLabelText(/message/i);

        expect(nameInput).toBeRequired();
        expect(emailInput).toBeRequired();
        expect(messageInput).toBeRequired();
    });

    it('should accept user input', async () => {
        const user = userEvent.setup();
        render(<ContactForm />);

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const messageInput = screen.getByLabelText(/message/i);

        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(messageInput, 'Hello, this is a test message');

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john@example.com');
        expect(messageInput).toHaveValue('Hello, this is a test message');
    });

    it('should show email type validation', () => {
        render(<ContactForm />);

        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute('type', 'email');
    });
});
