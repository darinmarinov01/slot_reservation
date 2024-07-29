'use client'

// React and Next imports
import React, { useState, ChangeEvent } from 'react'
// Firebase imports
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { User } from 'firebase/auth'
// External Imports
import { Avatar, Box, Button, Typography } from '@mui/material'
// Internal Imports
import { useUserStore } from '@/common/store'
import { useAlert } from '@/providers/alert'

interface ProfilePictureProps {
    currentUser: User | null
    setCurrentPhotoUrl: (photo: string | null | undefined) => void
}

const ProfilePicture = ({ currentUser, setCurrentPhotoUrl }: ProfilePictureProps) => {
    const loggedUser = useUserStore((state) => state.user)
    const { setAlert } = useAlert()
    const [inputFile, setInputFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [photoUrl, setPhotoUrl] = useState(loggedUser?.photoUrl || null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = (e.target as any).files[0]
        setInputFile(file)
    }

    const handleUploadPhoto = () => {
        if (!inputFile) {
            setAlert('', `No file selected`, 'info')
            return
        }

        const storage = getStorage()
        const storageRef = ref(storage, `profile_pictures/${currentUser?.uid}`)
        const uploadTask = uploadBytesResumable(storageRef, inputFile)

        setUploading(true)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Handle progress
            },
            (error) => {
                setAlert('', `Error: ${error.message}`, 'error')
                setUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
                    setPhotoUrl(downloadURL)
                    setCurrentPhotoUrl(downloadURL)
                    setAlert('', `Photo uploaded successfully!`, 'success')
                    setUploading(false)
                })
            }
        )
    }

    return (
        <Box className="w-full h-full flex items-center bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700" sx={{ justifyContent: "center" }}>
            <Box className="p-6 h-full space-y-4 md:space-y-6 sm:p-8">
                <Avatar
                    alt="Profile Picture"
                    src={photoUrl || currentUser?.photoURL || ''}
                    sx={{ width: 170, height: 170, margin: "auto" }}
                />
                <label className="block text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                    Upload file
                </label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    onChange={handleFileChange}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                    SVG, PNG, JPG or GIF.
                </p>
                <Button className="text-white" onClick={handleUploadPhoto} disabled={uploading}>
                    {uploading ? (
                        <Typography
                            variant="body2"
                            component="p"
                            textAlign="center"
                            className="font-bold leading-tight tracking-tight text-blue-700 dark:text-blue-700"
                        >
                            Uploading
                        </Typography>
                    ) : (
                        <Typography
                            variant="body2"
                            component="p"
                            textAlign="center"
                            className="font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
                        >
                            Upload Photo
                        </Typography>
                    )}
                </Button>
                <Typography
                    variant="h4"
                    component="h3"
                    textAlign="center"
                    className="font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
                >
                    {currentUser?.displayName}
                </Typography>
                <Typography
                    variant="h5"
                    component="h4"
                    textAlign="center"
                    className="leading-tight tracking-tight text-gray-900 dark:text-white"
                >
                    {loggedUser?.role}
                </Typography>
            </Box>
        </Box>
    )
}

export default ProfilePicture
