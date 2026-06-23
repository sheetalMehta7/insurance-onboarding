import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'

// Route-level code splitting: each page/journey step is its own chunk.
const PlansHome = lazy(() => import('@/features/plans/pages/PlansHome'))
const PlanDetail = lazy(() => import('@/features/plans/pages/PlanDetail'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const NotFound = lazy(() => import('@/components/layout/NotFound'))

const OnboardingLayout = lazy(() => import('@/features/onboarding/OnboardingLayout'))
const KycStep = lazy(() => import('@/features/onboarding/pages/KycStep'))
const PersonalStep = lazy(() => import('@/features/onboarding/pages/PersonalStep'))
const NomineeStep = lazy(() => import('@/features/onboarding/pages/NomineeStep'))
const ReviewStep = lazy(() => import('@/features/onboarding/pages/ReviewStep'))
const PaymentStep = lazy(() => import('@/features/onboarding/pages/PaymentStep'))
const ResultStep = lazy(() => import('@/features/onboarding/pages/ResultStep'))

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public browsing */}
        <Route path="/" element={<PlansHome />} />
        <Route path="/plans/:planId" element={<PlanDetail />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected purchase journey */}
        <Route
          path="/onboarding/:planId"
          element={
            <ProtectedRoute>
              <OnboardingLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="kyc" replace />} />
          <Route path="kyc" element={<KycStep />} />
          <Route path="personal" element={<PersonalStep />} />
          <Route path="nominee" element={<NomineeStep />} />
          <Route path="review" element={<ReviewStep />} />
          <Route path="payment" element={<PaymentStep />} />
          <Route path="result" element={<ResultStep />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
