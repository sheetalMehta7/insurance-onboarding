import { Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import PlansHome from '@/features/plans/pages/PlansHome'
import LoginPage from '@/features/auth/pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<PlansHome />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
