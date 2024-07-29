'use client'

// React and Next import
import { useState, MouseEvent, ChangeEvent } from "react"
import { useRouter } from "next/router"

// Firebase imporst
import 'firebase/firestore'
import { FirebaseError } from "firebase-admin"

// Internal imports
import { TextField, Button } from "@atoms"
import { RegistrationType, LoginEnum, RoleEnum } from '@/common/types/form-types'
import { useAuth } from '@hooks'

// External imports
import Fingerprint from '@mui/icons-material/Fingerprint'
import GoogleIcon from '@mui/icons-material/Google'
import { FormLabel, FormGroup, Box, Typography } from '@mui/material'

const SignUpForm = () => {
    const [data, setData] = useState<RegistrationType>({
        name: '',
        email: '',
        password: '',
        loginType: LoginEnum.NORMAL,
        role: RoleEnum.NORMAL,
        isDeleted: false,
        dateCreated: new Date(Date.now()),
        favoriteSlots: []
    })
    const router = useRouter()
    const { signUpWithGoogle, signUp } = useAuth()

    const handleSignUp = async (event: MouseEvent<HTMLButtonElement>) => {
        await signUp(data.email, data.password, data.name)
            .then(() => router.push('/home'))
            .catch((error: FirebaseError) => alert(error))
    }

    const handleSignUpWithGoogle = async (event: MouseEvent<HTMLButtonElement>) => {
        await signUpWithGoogle()
            .then(() => router.push('/home'))
            .catch((error: FirebaseError) => alert(error.message))
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, attribute: string) => {
        setData({
            ...data,
            [attribute]: event.target.value
        })
    }

    return (
        <form className="space-y-4 md:space-y-6" action="#">
            <FormGroup className="space-y-4 md:space-y-6">
                <FormGroup className="flex items-center justify-between gap-3">
                    <Button
                        onClick={handleSignUpWithGoogle}
                        variant="contained"
                        type="button"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        <GoogleIcon className="mr-2" />
                        Sign up with Google
                    </Button>
                </FormGroup>
                <Box className="flex items-center justify-between">
                    <Box className="border-gray-500 w-2/4 border-2"></Box>
                    <Typography className="text-zinc-400 px-4">OR</Typography>
                    <Box className="border-gray-500 w-2/4 border-2"></Box>
                </Box>
                <Box className="text-white">
                    <FormLabel
                        required
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Name
                    </FormLabel>
                    <TextField
                        className="bg-gray-50 bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        size="small"
                        required
                        type="text"
                        color="primary"
                        placeholder="John Doe"
                        variant="filled"
                        fullWidth
                        sx={{
                            // Root class for the input field
                            "& .MuiInputBase-root": {
                                color: "#fff",
                            },
                        }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'name')}
                    />
                </Box>
                <Box className="text-white">
                    <FormLabel
                        required
                        htmlFor="name"
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'email')}
                    />
                </Box>
                <Box>
                    <FormLabel
                        required
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'password')}
                    />
                </Box>
                <Box className="flex items-center justify-between gap-3">
                    <Button
                        onClick={handleSignUp}
                        variant="contained"
                        type="button"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        <Fingerprint className="mr-2" />
                        Sign up
                    </Button>
                </Box>
            </FormGroup>
        </form>
    )
}

export default SignUpForm