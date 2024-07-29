'use client'

// React and Next imports
import React, { useState, ChangeEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
// Firebase imports
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth'
import { User as FirebaseUser } from 'firebase/auth'
// External Imports
import { Box, Button, FormGroup, FormLabel, TextField, Typography } from '@mui/material'
// Internal Imports
import { LoginProviderType } from '@/common/types/user-types'
import { useUserStore } from '@/common/store'
import { useAlert } from '@/providers/alert'
import { headers } from '@/common/constants'
import { useAuth } from '@/common/hooks'

interface ProfilePictureProps {
    currentUser: FirebaseUser | null
    currentPhotoUrl: string | null | undefined
    setCurrentUser: (user: FirebaseUser) => void
}

const ProfileDetailForm = ({ currentUser, setCurrentUser, currentPhotoUrl }: ProfilePictureProps) => {
    const router = useRouter()
    const loggedUser = useUserStore((state) => state.user)
    const { logOut } = useAuth()
    const { setAlert } = useAlert()
    const [password, setPassword] = useState(loggedUser?.password || null)
    const [email, setEmail] = useState(loggedUser?.email || null)
    const [name, setName] = useState(loggedUser?.name || null)
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl || null)


    const updateUserProfile = async () => {
        const response = await fetch('/api/user/updateUserProfile', {
            body: JSON.stringify({
                user: { ...loggedUser, password, email, name, photoUrl: photoUrl ? photoUrl : loggedUser?.photoUrl },
            }),
            headers: headers,
            method: 'POST',
        })

        return response.ok
    }

    const handleUpdateProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const auth = getAuth()
        const user = auth.currentUser

        if (user) {
            try {
                if (photoUrl || name) {
                    await updateProfile(user, { displayName: name, photoURL: photoUrl })
                    await updateUserProfile().then(response => {
                        if (response) {
                            setAlert('', 'Profile updated successfully!', 'success')
                        } else {
                            setAlert('', 'Profile update unsuccessful!', 'error')
                        }
                    })
                }

                if (loggedUser && name) {
                    loggedUser.name = name
                    useUserStore.setState({ user: loggedUser })
                }

                if (loggedUser?.provider !== LoginProviderType.GOOLGE_LOGIN) {
                    await handleChangeEmail(user)
                    await handleChangePassword(user)

                    if (password && email) {
                        if (password !== loggedUser?.password || email !== loggedUser?.email) {
                            setTimeout(() => {
                                logOut()
                                router.push('/sign-in')
                            }, 1000)
                        }
                    }
                }

                setCurrentUser(user)
            } catch (error: unknown) {
                const { message } = (error as Error)
                setAlert('', `Error: ${message}`, 'error')
            }
        } else {
            setAlert('', 'No user is signed in.', 'info')
        }
    }

    const handleChangePassword = async (user: FirebaseUser) => {
        if (user && password && password !== loggedUser?.password) {
            try {
                if (user.email && loggedUser?.password) {
                    const credential = EmailAuthProvider.credential(user.email, loggedUser.password)
                    await reauthenticateWithCredential(user, credential)
                    await updatePassword(user, password)
                    await updateUserProfile().then(response => {
                        if (response) {
                            setAlert('', `Password updated successfully!`, 'success')
                        } else {
                            setAlert('', `Password update unsuccessfully!`, 'error')
                        }
                    })
                }
            } catch (error) {
                const { message } = (error as Error)
                setAlert('', `Error: ${message}`, 'error')
            }
        }
    }

    const handleChangeEmail = async (user: FirebaseUser) => {
        if (user && email && email !== user.email) {
            try {
                if (user.email && loggedUser?.password) {
                    const credential = EmailAuthProvider.credential(user.email, loggedUser.password)
                    await reauthenticateWithCredential(user, credential)
                    await updateEmail(user, email)
                    await updateUserProfile().then(response => {
                        if (response) {
                            setAlert('', `Email updated successfully!`, 'success')
                        } else {
                            setAlert('', `Email update unsuccessfully!`, 'error')
                        }
                    })
                }
            } catch (error) {
                const { message } = (error as Error)
                setAlert('', `Error: ${message}`, 'error')
            }
        }
    }

    useEffect(() => {
        if (currentUser && loggedUser) {
            setName(loggedUser?.name)
            setEmail(currentUser.email)
            setPassword(loggedUser?.password)
            if (currentPhotoUrl) {
                setPhotoUrl(currentPhotoUrl)
            }
            setCurrentUser(currentUser)
        }
    }, [currentUser, currentPhotoUrl])

    return (
        <>
            <FormGroup className="gap-4 pb-5 text-white">
                <Box className="text-white mb-6">
                    <FormLabel
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Name
                    </FormLabel>
                    <TextField
                        className="bg-gray-50 bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        size="small"
                        required
                        type="name"
                        color="primary"
                        placeholder="John Doe"
                        variant="filled"
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                color: "#fff",
                            },
                        }}
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                </Box>
                <Box className="text-white mb-6">
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
                        disabled={loggedUser?.provider == LoginProviderType.GOOLGE_LOGIN}
                        variant="filled"
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                color: "#fff",
                            },
                        }}
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <Typography component="p" variant="body1" className="py-2 px-1 text-sm">
                        {loggedUser?.provider == LoginProviderType.GOOLGE_LOGIN ? "*Note: Google profile can't change their email" : ''}
                    </Typography>
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
                        disabled={loggedUser?.provider == LoginProviderType.GOOLGE_LOGIN}
                        variant="filled"
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                color: "#fff",
                            },
                        }}
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                    <Typography component="p" variant="body1" className="py-2 px-1 text-sm">
                        {loggedUser?.provider == LoginProviderType.GOOLGE_LOGIN ? "*Note: Google profile can't change their password" : ''}
                    </Typography>
                </Box>
            </FormGroup>
            {loggedUser?.provider !== LoginProviderType.GOOLGE_LOGIN && <Typography component="p" variant="body2" className="">
                *Note: Changing email or password will log you out automatically
            </Typography>}
            <Box className="flex justify-end items-end min-h-20">
                <Button
                    onClick={handleUpdateProfile}
                    variant="contained"
                    type="button"
                    className="w-60 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    Update Profile
                </Button>
            </Box>
        </>
    )
}

export default ProfileDetailForm
