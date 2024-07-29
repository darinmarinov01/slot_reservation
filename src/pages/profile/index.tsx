// React and Next imports
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// Firebase imports
import { getAuth } from 'firebase/auth'
import { firebaseAuth } from "@/firebase/firebase-config"
// External Imports
import { Box, Grid, Typography } from '@mui/material'
// Internal Imports
import { ProfileDetailForm, ProfilePicture } from '@organisms'

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(firebaseAuth?.currentUser)
  const [photoUrl, setPhotoUrl] = useState<string | null | undefined>()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User Profile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="bg-gray-50 dark:bg-gray-900">
        <Box className="flex flex-col mt-7 md:mt-10 px-6 py-8 mx-auto lg:py-0 font-semibold text-gray-900 dark:text-white">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <ProfilePicture currentUser={currentUser} setCurrentPhotoUrl={setPhotoUrl} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box className="w-full h-full flex flex-col bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <Box className="h-full p-6 space-y-4 md:space-y-6 sm:p-8">
                  <Box className="h-full" component="form">
                    <Typography component="h1" variant="h5" className="pb-5">
                      General Information
                    </Typography>
                    <ProfileDetailForm currentUser={currentUser} setCurrentUser={setCurrentUser} currentPhotoUrl={photoUrl} />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className="w-full p-5 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <Link href="/my-slots">
                  <Typography component="h1" variant="h6" className="hover:text-blue-700">
                    My Booked Slots
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </section>
    </>
  )
}

export default Profile
