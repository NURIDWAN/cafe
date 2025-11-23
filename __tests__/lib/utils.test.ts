import { cn, formatPrice } from '@/lib/utils';

describe('Utils', () => {
    describe('cn (className merger)', () => {
        it('should merge class names correctly', () => {
            const result = cn('px-4', 'py-2', 'bg-blue-500');
            expect(result).toContain('px-4');
            expect(result).toContain('py-2');
            expect(result).toContain('bg-blue-500');
        });

        it('should handle conditional classes', () => {
            const isActive = true;
            const result = cn('base-class', isActive && 'active-class');
            expect(result).toContain('base-class');
            expect(result).toContain('active-class');
        });

        it('should filter out falsy values', () => {
            const result = cn('base', false, null, undefined, 'valid');
            expect(result).toContain('base');
            expect(result).toContain('valid');
        });
    });

    describe('formatPrice', () => {
        it('should format price correctly (price in cents)', () => {
            expect(formatPrice(1000)).toBe('$10.00');
            expect(formatPrice(2500)).toBe('$25.00');
        });

        it('should handle zero price', () => {
            expect(formatPrice(0)).toBe('$0.00');
        });

        it('should handle decimal prices', () => {
            expect(formatPrice(1550)).toBe('$15.50');
        });
    });
});
