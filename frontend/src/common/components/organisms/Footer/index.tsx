'use client'

// External Imports
import Box from '@mui/material/Box'
import AdbIcon from '@mui/icons-material/Adb'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
// Internal Imports
import { useUserStore } from '@/common/store'

const Footer = () => {
  const router = useRouter()
  const { user } = useUserStore()

  return (
    <footer className='sticky top-[100vh] mx-5'>
      <Box className="bg-gray-800 mt-8 w-full mx-auto p-4 rounded-lg flex items-center md:justify-between">
        <Box className="flex">
          <Link className='flex justify-center items-center' href={'/home'}>
            <AdbIcon sx={{ display: { xs: 'flex' }, mr: 1, fill: 'whitesmoke' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex' },
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
        </Box>
        <Typography component="span" className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 All Rights Reserved.
        </Typography>
        <List className="flex flex-wrap items-center text-lg md:text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          {user && <ListItem className="hover:underline me-4 md:me-6">
            <Link href={router.asPath == '/profile' ? '/home' : '/profile'}
            >
              <Typography textAlign="center">{router.asPath == '/profile' ? 'Home' : 'Profile'}</Typography>
            </Link>
          </ListItem>}
        </List>
      </Box>
    </footer>
  )
}
export default Footer