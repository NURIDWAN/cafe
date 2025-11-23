# Unit Testing Guide

## Setup
Unit testing sudah dikonfigurasi menggunakan:
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **@testing-library/user-event**: User interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

## Test Structure

### Tests Location
```
__tests__/
├── components/       # Component tests
│   ├── contact-form.test.tsx
│   ├── product-card.test.tsx
│   └── navbar.test.tsx
├── pages/            # Page tests
│   └── login.test.tsx
├── actions/          # Server action tests
│   └── contact.test.ts
└── lib/              # Utility function tests
    └── utils.test.ts
```

### What's Tested

#### 1. Utility Functions (`__tests__/lib/utils.test.ts`)
- ✅ `cn()` - className merger
  - Merging multiple classes
  - Conditional classes
  - Filtering falsy values
- ✅ `formatPrice()` - Price formatting
  - Default USD currency
  - Decimal handling

#### 2. Components

**ContactForm** (`__tests__/components/contact-form.test.tsx`)
- ✅ Renders all form fields
- ✅ Required field validation
- ✅ User input handling
- ✅ Email type validation

**ProductCard** (`__tests__/components/product-card.test.tsx`)
- ✅ Product information display
- ✅ Image rendering
- ✅ Add to cart button
- ✅ Availability status
- ✅ Price formatting

**Navbar** (`__tests__/components/navbar.test.tsx`)
- ✅ Logo/brand display
- ✅ Navigation links
- ✅ Sign in button
- ✅ Shopping cart button
- ✅ Correct href attributes

#### 3. Pages

**Login Page** (`__tests__/pages/login.test.tsx`)
- ✅ Form field rendering
- ✅ Required attributes
- ✅ User input handling
- ✅ Placeholder text
- ✅ Google sign-in button
- ✅ Terms & privacy links
- ✅ Form structure

#### 3. Server Actions (`__tests__/actions/contact.test.ts`)
- ✅ Required field validation
- ✅ Email format validation
- ✅ Name minimum length
- ✅ Message minimum length
- ✅ Valid data acceptance

## Writing New Tests

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### User Interaction Test
```typescript
import userEvent from '@testing-library/user-event';

it('should handle button click', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

### Server Action Test
```typescript
describe('myAction', () => {
  it('should validate input', async () => {
    const formData = new FormData();
    formData.set('field', 'value');
    
    const result = await myAction({}, formData);
    expect(result.success).toBe(true);
  });
});
```

## Best Practices

1. **Use descriptive test names**: `it('should validate email format')`
2. **Test user behavior**: Focus on what users do, not implementation
3. **Mock external dependencies**: Database, APIs, etc.
4. **Keep tests isolated**: Each test should be independent
5. **Test edge cases**: Empty inputs, max lengths, etc.

## Coverage Goals

Aim for:
- **Utility functions**: 100% coverage
- **Components**: 80%+ coverage
- **Server actions**: 80%+ coverage

## Continuous Integration

Add to your CI/CD pipeline:
```yaml
- name: Run tests
  run: npm test -- --ci --coverage
```

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module '@/...'`
**Fix**: Check `moduleNameMapper` in `jest.config.ts`

**Issue**: `ReferenceError: window is not defined`
**Fix**: Ensure `testEnvironment: 'jsdom'` in config

**Issue**: Mock not working
**Fix**: Clear mocks in `beforeEach()` with `jest.clearAllMocks()`

## Next Steps

To expand test coverage:
1. Add tests for ReservationForm
2. Add tests for admin components
3. Add E2E tests with Playwright/Cypress
4. Add API route tests
