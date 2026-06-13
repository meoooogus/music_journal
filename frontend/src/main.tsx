import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './styles/tokens.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root element not found')

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
    <AuthProvider>
      <App />
      {/* Sonner — 앱 전역 토스트 */}
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { fontFamily: 'var(--w-font-sans)', fontSize: 13 } }}
      />
    </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
