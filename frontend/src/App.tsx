import { CssBaseline } from '@mui/material'
import { AuthProvider } from '@/contexts/AuthContext'
import AppRouter from '@/routes/AppRouter'
import theme from '@/theme'
import { ThemeProvider } from '@mui/material/styles'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
