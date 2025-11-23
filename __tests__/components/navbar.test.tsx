import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/navbar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}));

describe('Navbar', () => {
    it('should render cafe logo/name', () => {
        render(<Navbar />);

        expect(screen.getByText(/cafe aesthetica/i)).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
        render(<Navbar />);

        expect(screen.getAllByText(/home/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/menu/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/about/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/gallery/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/reservation/i).length).toBeGreaterThan(0);
    });

    it('should have sign in button', () => {
        render(<Navbar />);

        expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0);
    });

    it('should have shopping cart button', () => {
        render(<Navbar />);

        const cartButtons = screen.getAllByRole('button');
        expect(cartButtons.length).toBeGreaterThan(0);
    });

    it('should have correct links with href attributes', () => {
        render(<Navbar />);

        const homeLink = screen.getAllByRole('link', { name: /home/i })[0];
        expect(homeLink).toHaveAttribute('href', '/');

        const menuLink = screen.getAllByRole('link', { name: /menu/i })[0];
        expect(menuLink).toHaveAttribute('href', '/menu');

        const aboutLink = screen.getAllByRole('link', { name: /about/i })[0];
        expect(aboutLink).toHaveAttribute('href', '/about');
    });
});
