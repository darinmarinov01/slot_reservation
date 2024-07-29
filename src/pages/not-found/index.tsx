// React and Next import
import { useRouter } from "next/router"

// Internal imports
import { Button } from "@atoms"
import Box from '@mui/material/Box'
import { Typography } from "@mui/material"

const NotFound = () => {
  const router = useRouter()

  return (
    <section className="bg-white dark:bg-gray-900 mt-40">
      <Box className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <Box className="mx-auto max-w-screen-sm text-center">
          <Typography variant="h1" className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-400 dark:text-primary-500">404</Typography>
          <Typography className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something&lsquo;s missing.</Typography>
          <Typography className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can&lsquo;t find that page. You&lsquo;ll find lots to explore on the home page. </Typography>
          <Button onClick={() => router.push('/home')} data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Back to home</Button>
        </Box>
      </Box>
    </section>
  )
}

export default NotFound