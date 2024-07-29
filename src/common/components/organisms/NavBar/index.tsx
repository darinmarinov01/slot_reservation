'use client'

// React and Next imports
import { useState, MouseEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

// Internal imports
import { Navigation } from '@/common/types/navigation-types'
import { RoleEnum } from '@/common/types/form-types'
import { useAuth } from '@hooks'
import { useUserStore } from '@store'

// External imports
import {
  AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, Avatar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AdbIcon from '@mui/icons-material/Adb'

// Navigation items
const navigation: Navigation[] = [
  { name: 'Home', href: '/home', current: false, isVisible: true, adminOnly: false },
  { name: 'Sign In', href: '/sign-in', current: true, isVisible: false, adminOnly: false },
  { name: 'Booked slots', href: '/admin/booked-slots', current: false, isVisible: false, adminOnly: true },
  { name: 'Slots', href: '/admin/slots', current: false, isVisible: false, adminOnly: true },
  { name: 'Users', href: '/admin/users', current: false, isVisible: false, adminOnly: true },
  { name: 'Errors', href: '/admin/errors', current: false, isVisible: false, adminOnly: true },
  { name: 'Sign Up', href: '/sign-up', current: false, isVisible: false, adminOnly: false }
]

const userMenuNavLinks: Navigation[] = [
  { name: 'Profile', href: '/profile', current: false, isVisible: false, adminOnly: false },
  { name: 'My Booked Slots', href: '/my-slots', current: false, isVisible: false, adminOnly: false }
]

const Navbar = () => {
  const router = useRouter()
  const { user } = useUserStore()
  const { logOut } = useAuth()
  const [filteredNavigation, setFilteredNavigation] = useState<Navigation[]>([])
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = (linkName: string) => {
    if (linkName === 'Logout') {
      logOut()
      router.push('/sign-in')
    }
    setAnchorElUser(null)
  }

  useEffect(() => {
    if (user?.role) {
      setFilteredNavigation(
        user.role === RoleEnum.ADMIN
          ? navigation.filter(page => page.isVisible || page.adminOnly)
          : navigation.filter(page => page.isVisible && !page.adminOnly)
      )
    } else {
      setFilteredNavigation(navigation.filter(page => !page.adminOnly))
    }
  }, [user])

  return (
    <AppBar position="static" color="transparent" sx={{ boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link className='flex justify-center items-center' href={'/home'}>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fill: 'whitesmoke' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'whitesmoke',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              className='text-white'
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {filteredNavigation.map((page) => (
                <MenuItem key={page.href} onClick={handleCloseNavMenu}>
                  <Link href={page.href} className={router.pathname.indexOf(page.href) > -1 ? 'text-black md:text-white' : 'text-gray-400 md:text-gray-500 hover:text-blue-700'}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fill: 'whitesmoke' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'whitesmoke',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {filteredNavigation.map((page) => (
              <Button
                key={page.href}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block', }}
              >
                <Link href={page.href} className={router.pathname.indexOf(page.href) > -1 ? 'text-white' : 'text-gray-500 hover:text-blue-700'}>
                  <Typography textAlign="center">{page.name}</Typography>
                </Link>
              </Button>
            ))}
          </Box>

          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open User Menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Typography className="text-white mr-2" textAlign="center">{user.name || 'Anonymous'}</Typography>
                  <Avatar alt="User Profile" src={user?.photoUrl || "/assets/avatar.png"} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={() => handleCloseUserMenu('')}
              >
                {userMenuNavLinks.map((page) => (
                  <MenuItem key={page.href} onClick={() => handleCloseUserMenu(page.name)}>
                    <Link href={page.href} className={router.pathname.indexOf(page.href) > -1 ? 'text-black' : 'text-gray-400 md:text-gray-500 hover:text-blue-700'}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem key='Logout' onClick={() => handleCloseUserMenu('Logout')}>
                  <Typography textAlign="center" className="text-blue-600 hover:text-blue-800">
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
