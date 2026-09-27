# Multi-Partner Insurance Onboarding

This is a single-page insurance onboarding application where multiple insurance partners share the same product flow.

Users can browse plans, customize coverage, log in with OTP, complete KYC and personal details, add nominee information, review their application, make a payment, and view the final result.

The application supports partner-based branding and light/dark themes.

## Link
insurance-onboarding-multi-platform.netlify.app

## Quick Start

```bash
npm install
npm run dev
```

The app will run at:

```bash
http://localhost:5173
```

Other available scripts:

```bash
npm run build
npm run test
npm run typecheck
npm run lint
```

Node.js 20+ is required.

---

## Payment Setup (Optional)

The app works without any setup using a mock payment gateway.

To test Razorpay sandbox integration:

```bash
cp .env.example .env.local
```

Add your Razorpay Test Key:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

Only the publishable Key ID is required.

---

## Test Credentials

| Field              | Value                                       |
| ------------------ | ------------------------------------------- |
| Mobile             | Any valid 10-digit number starting with 6-9 |
| OTP                | 123456                                      |
| PAN                | Any valid PAN format (ABCDE1234F)           |
| DOB                | Any age between 18 and 100                  |
| Mock Payment       | Pay = Success, Failed Payment = Failure     |
| Razorpay Test Card | 4111 1111 1111 1111                         |

You can switch partners and themes at any time. The selected branding and theme are persisted after refresh.

---

## User Flow

1. Home Page
2. Plan Details
3. Buy Now
4. Login
5. KYC Details
6. Personal Details
7. Nominee Details
8. Review
9. Payment
10. Result Screen

### Notes

- Home and Plan Detail pages are public.
- All onboarding routes are protected.
- After login, users are redirected back to the page they came from.
- Refreshing the page does not lose progress.
- Current onboarding step is reflected in the URL.
- Starting a new purchase clears previous onboarding data.

---

## Project Structure

```txt
src/
  components/
  features/
    partners/
    theme/
    auth/
    plans/
    onboarding/
    payment/
    notifications/
  lib/
  types/
```

### Main Tech Stack

- React
- TypeScript
- React Router
- Zustand
- TanStack Query
- Tailwind CSS v4
- Vitest

---

## Architecture Decisions

### Mock API Layer

Instead of using a public API, I created a mock API layer because insurance-specific data such as coverage, terms, premium calculations, and nominee rules are not available in generic APIs.

The API layer is separated into `*.api.ts` files, making it easy to replace with a real backend later.

### Multi-Partner Branding

Partner configuration is managed from a single registry.

Adding a new partner only requires adding one entry to the partner configuration.

Brand colors are applied through CSS variables so the UI updates automatically when the active partner changes.

### Authentication

The login flow uses mobile number and OTP authentication.

Since this is a frontend-only project, OTP verification is mocked, but the auth flow still includes:

- Access tokens
- Refresh tokens
- Session restoration
- Silent token refresh

The structure closely matches how a real backend integration would work.

### Refresh-Safe Onboarding

The onboarding state is stored in persisted Zustand stores.

If the user refreshes the page, progress is restored automatically.

A step guard prevents users from skipping required steps.

### Payment Flow

If a Razorpay key is provided, the Razorpay sandbox is used.

Otherwise, the app falls back to a mock payment gateway so the complete flow can always be tested.

### Clean Reset

Logout and "Browse More Plans" both clear onboarding data to ensure each purchase starts fresh.

---

## Extra Features

- Silent token refresh
- Resume onboarding after refresh
- Step guard protection
- Deep-linkable onboarding steps
- Search and filtering
- URL-based filters and quote configuration
- Debounced search
- Request cancellation
- Skeleton loaders
- Error and empty states
- Global error boundary
- Route-level code splitting
- Form validation
- Toast notifications
- Light/Dark mode
- Accessibility improvements
- Unit tests for core business logic

---
