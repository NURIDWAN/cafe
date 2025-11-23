/**
 * Contact Actions Tests
 * Note: These are integration tests that would require database setup
 * In a real scenario, you'd use a test database or mock the database calls
 */

import { submitContactMessage } from '@/app/actions/contact';

// Mock the database
jest.mock('@/db/drizzle', () => ({
    db: {
        insert: jest.fn(() => ({
            values: jest.fn(() => Promise.resolve()),
        })),
    },
}));

// Mock nanoid
jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'test-id-123'),
}));

describe('Contact Actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('submitContactMessage', () => {
        it('should validate required fields', async () => {
            const formData = new FormData();
            formData.set('name', '');
            formData.set('email', '');
            formData.set('message', '');

            const result = await submitContactMessage({}, formData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('fix the errors');
        });

        it('should validate email format', async () => {
            const formData = new FormData();
            formData.set('name', 'John Doe');
            formData.set('email', 'invalid-email');
            formData.set('message', 'Test message here');

            const result = await submitContactMessage({}, formData);

            expect(result.success).toBe(false);
        });

        it('should validate name minimum length', async () => {
            const formData = new FormData();
            formData.set('name', 'J');
            formData.set('email', 'john@example.com');
            formData.set('message', 'Test message here');

            const result = await submitContactMessage({}, formData);

            expect(result.success).toBe(false);
        });

        it('should validate message minimum length', async () => {
            const formData = new FormData();
            formData.set('name', 'John Doe');
            formData.set('email', 'john@example.com');
            formData.set('message', 'Short');

            const result = await submitContactMessage({}, formData);

            expect(result.success).toBe(false);
        });

        it('should accept valid contact form data', async () => {
            const formData = new FormData();
            formData.set('name', 'John Doe');
            formData.set('email', 'john@example.com');
            formData.set('message', 'This is a valid test message with enough characters');

            const result = await submitContactMessage({}, formData);

            expect(result.success).toBe(true);
            expect(result.message).toContain('get back to you');
        });
    });
});
