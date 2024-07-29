'use client'

// React and Next import
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

// Firebase imporst
import 'firebase/firestore'
import { FirebaseError } from "firebase-admin"

// Internal imports
import { TextField, Button, Checkbox } from "@atoms"
import { LoginType } from '@/common/types/form-types'
import { useAuth } from '@hooks'
import { headers } from '@/common/constants'
import { useAlert } from "@/providers/alert"

// External imports
import Fingerprint from '@mui/icons-material/Fingerprint'
import { Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'

const SignInForm = () => {
    const { setAlert } = useAlert()
    const router = useRouter()
    const { signInWithGoogle, logIn, triggerResetEmail } = useAuth()
    const [data, setData] = useState<LoginType>({
        email: '',
        password: ''
    })
    const handleGoogleSignIn = async () =>
        await signInWithGoogle()
            .then(() => router.push('/home'))
            .catch((error: FirebaseError) => alert(error.message))


    const handleSignIn = async (e: React.MouseEvent) => {
        await logIn(data.email, data.password)
            .then(async (resp) => {
                //update password when login is successful (need to find user by email)
                const response = await fetch('/api/user/updateUserByEmail', {
                    body: JSON.stringify({
                      data: {...data},
                    }),
                    headers: headers,
                    method: 'POST',
                })
                if (response.ok) {
                    const user = await response.json() 

                    if(user.isDeleted) {
                        setAlert('','You are not allowed to login', 'warning')
                    } else {
                        setAlert('',`Welcome ${data.email}`, 'info')
                    }

                    router.push('/home')
                } else {
                    router.push('/home')
                    setAlert('', `There is some problem with your credentials.`, 'error')
                }
            })
            .catch((error: FirebaseError) => alert(error.message))
    }

    const handleForgotPassword = async () => {
        if(data.email) {
            await triggerResetEmail(data.email)
            .then(() => {
                router.push('/home')
            })
            .catch((error: FirebaseError) => alert(error.message))
        }
    }

    // TODO: Make it like in sign-up and then 
    // see how we can combine them and reuse it.
    const handleInputChange = () => { }

    return (
        <form className="space-y-4 md:space-y-6" action="#">
            <Box className="flex items-center justify-between">
                <Button
                    onClick={handleGoogleSignIn}
                    variant="contained"
                    type="button"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    <GoogleIcon className="mr-2" />
                    Sign in with Google
                </Button>
            </Box>
            <Box className="flex items-center justify-between">
                <Box className="border-gray-500 w-2/4 border-2"></Box>
                <Typography className="text-zinc-400 px-4">OR</Typography>
                <Box className="border-gray-500 w-2/4 border-2"></Box>
            </Box>
            <Box className="text-white">
                <FormLabel
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Email
                </FormLabel>
                <TextField
                    className="bg-gray-50 bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    size="small"
                    required
                    type="email"
                    color="primary"
                    placeholder="name@company.com"
                    variant="filled"
                    fullWidth
                    sx={{
                        // Root class for the input field
                        "& .MuiInputBase-root": {
                            color: "#fff",
                        },
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setData({
                            ...data,
                            email: e.target.value
                        })
                    }}
                />
            </Box>
            <Box>
                <FormLabel
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Password
                </FormLabel>
                <TextField
                    className="bg-gray-50 bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    size="small"
                    required
                    type="password"
                    color="primary"
                    placeholder="••••••••"
                    variant="filled"
                    fullWidth
                    sx={{
                        // Root class for the input field
                        "& .MuiInputBase-root": {
                            color: "#fff",
                        },
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setData({
                            ...data,
                            password: e.target.value
                        })
                    }}
                />
            </Box>
            <Box className="flex items-center justify-end">
                <Link onClick={handleForgotPassword} className="text-sm font-medium text-white hover:underline dark:text-primary-500" href="/#">Forgot password?</Link>
            </Box>
            <Button
                onClick={handleSignIn}
                variant="contained"
                type="button"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
                <Fingerprint className="mr-2" />
                Sign in
            </Button>

            <Typography className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/sign-up">Sign up</Link>
            </Typography>
        </form>
    )
}

export default SignInForm