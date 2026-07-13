import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { WeatherProvider } from './context/WeatherContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CropDoctor from './pages/CropDoctor'
import SoilAnalysis from './pages/SoilAnalysis'
import CropRecommendation from './pages/CropRecommendation'
import Fertilizer from './pages/Fertilizer'
import PestDetection from './pages/PestDetection'
import Weather from './pages/Weather'
import Market from './pages/Market'
import Irrigation from './pages/Irrigation'
import YieldPredictor from './pages/YieldPredictor'
import Schemes from './pages/Schemes'
import Nearby from './pages/Nearby'
import FarmDiary from './pages/FarmDiary'
import AIAssistant from './pages/AIAssistant'
import Auth from './pages/Auth'

import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WeatherProvider>
          <Router>
            <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                color: '#251913',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(249, 115, 22, 0.12)',
              },
            }}
          />
          
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthLayout><Auth /></AuthLayout>} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crop-doctor" element={<CropDoctor />} />
                <Route path="/soil-analysis" element={<SoilAnalysis />} />
                <Route path="/crop-recommendation" element={<CropRecommendation />} />
                <Route path="/fertilizer" element={<Fertilizer />} />
                <Route path="/pest-detection" element={<PestDetection />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/market" element={<Market />} />
                <Route path="/irrigation" element={<Irrigation />} />
                <Route path="/yield" element={<YieldPredictor />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/nearby" element={<Nearby />} />
                <Route path="/farm-diary" element={<FarmDiary />} />
                <Route path="/ai" element={<AIAssistant />} />
              </Route>
            </Routes>
          
        </Router>
        </WeatherProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
