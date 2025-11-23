import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/menu/product-card';

describe('ProductCard', () => {
    const mockProduct = {
        id: '1',
        name: 'Espresso',
        description: 'Rich and bold coffee',
        price: 3500,
        imageUrl: '/test-image.jpg',
        isAvailable: true,
    };

    it('should render product information correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Espresso')).toBeInTheDocument();
        expect(screen.getByText('Rich and bold coffee')).toBeInTheDocument();
        expect(screen.getByText('$35.00')).toBeInTheDocument();
    });

    it('should render product image with correct src', () => {
        render(<ProductCard product={mockProduct} />);

        const image = screen.getByRole('img', { name: /espresso/i });
        expect(image).toBeInTheDocument();
    });

    it('should show "Add to Cart" button when available', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    });

    it('should show sold out status when product is not available', () => {
        const unavailableProduct = { ...mockProduct, isAvailable: false };
        render(<ProductCard product={unavailableProduct} />);

        expect(screen.getByText(/sold out/i)).toBeInTheDocument();
    });

    it('should display correct price format', () => {
        const expensiveProduct = { ...mockProduct, price: 15000 };
        render(<ProductCard product={expensiveProduct} />);

        expect(screen.getByText('$150.00')).toBeInTheDocument();
    });
});
