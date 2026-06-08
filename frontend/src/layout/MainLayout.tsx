import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import GavelIcon from '@mui/icons-material/Gavel'
import { useAuth } from '@/contexts/AuthContext'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Serviços Cartorários', path: '/services', icon: <AssignmentIcon />, adminOnly: false },
  { label: 'Usuários', path: '/users', icon: <PeopleIcon />, adminOnly: true },
]

export default function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev)

  const handleNavClick = (path: string) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handleMenuClose()
    logout()
    navigate('/login')
  }

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ bgcolor: 'primary.main' }}>
        <GavelIcon sx={{ color: 'secondary.light', mr: 1 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
          Cartoflow
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'white' : 'primary.main',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {user?.perfil}
        </Typography>
        <Typography variant="body2" fontWeight={600} noWrap>
          {user?.nome}
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'primary.main' }}
        elevation={1}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <GavelIcon sx={{ color: 'secondary.light', mr: 1, display: { md: 'none' } }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, display: { md: 'none' } }}>
            Cartoflow
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

          <Tooltip title={user?.nome ?? ''}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, minWidth: 44, minHeight: 44 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: 14 }}>
                {user?.nome?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <AccountCircleIcon sx={{ mr: 1, fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.nome}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
