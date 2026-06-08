import { createTheme } from '@mui/material/styles'
import { ptBR } from '@mui/material/locale'

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1a3a5c',
        light: '#2d5986',
        dark: '#0d1f33',
        contrastText: '#fff',
      },
      secondary: {
        main: '#c8922a',
        light: '#e0ac50',
        dark: '#9a6e1c',
        contrastText: '#fff',
      },
      background: {
        default: '#f4f6f9',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: '#f4f6f9',
            },
          },
        },
      },
    },
  },
  ptBR,
)

export default theme
