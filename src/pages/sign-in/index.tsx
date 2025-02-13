// React and Next import
import Head from 'next/head'

// Internal imports
import { SignInForm } from '@organisms'

// External imports
import Fingerprint from '@mui/icons-material/Fingerprint'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { Typography } from "@mui/material"

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign in to your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="bg-gray-50 dark:bg-gray-900">
        <Box className="flex flex-col items-center justify-start mt-7 md:mt-10 px-6 py-8 mx-auto lg:py-0">
          <Link href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <Fingerprint className="mr-2" />
            Parking system
          </Link>
          <Box className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <Box className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <Typography variant="h1" className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </Typography>
              <SignInForm />
            </Box>
          </Box>
        </Box>
      </section>
    </>
  )
}
export default SignIn