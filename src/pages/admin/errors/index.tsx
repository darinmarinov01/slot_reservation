// React and Next import
import { useState, useCallback, useEffect } from 'react'

// Internal imports
import { FirebaseErrorMessageWithId } from '@/common/types/firebase-errors'
import { dateTimeFilter } from '@/common/utils'
import { headers } from '@/common/constants'

// External imports
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material'

const Errors = () => {
  const [errors, setErrors] = useState<FirebaseErrorMessageWithId[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const errorsPerPage = 5

  const fetchErrors = useCallback(async () => {
    const response = await fetch('/api/errors/getErrors', {
      headers: headers,
      method: 'Get',
    })

    if (response.ok) {
      const fetchedErrors = await response.json()
      setErrors(fetchedErrors)
    } else {
      const errorResponse = await response.json()
      console.log(errorResponse.message)
    }
  }, [])

  useEffect(() => {
    fetchErrors()
      .catch(console.error)
  }, [fetchErrors])

  // Pagination logic
  const totalPages = Math.ceil(errors.length / errorsPerPage)
  const currentErrors = errors.slice((currentPage - 1) * errorsPerPage, currentPage * errorsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <section className="bg-white dark:bg-gray-900 antialiased mt-7 md:mt-10">
      <Box className="mx-auto text-center">
        <Typography className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
          Errors
        </Typography>
      </Box>
      <Box className="px-4 py-4 mx-auto lg:px-6 sm:py-16 lg:py-6">
        <Box className="flow-root mx-auto mt-8 min-h-[500px]">
          <Box className="-my-4 Boxide-y Boxide-gray-200 dark:Boxide-gray-700">
            {currentErrors.map(err => (
              <Box key={err.id} className="flex flex-col gap-2 py-2 sm:gap-6 sm:flex-row">
                <Typography className="md:w-32 text-lg font-normal text-gray-500 sm:text-right dark:text-gray-400 shrink-0"
                  variant='body2'><span className='block sm:hidden'>Date: </span>{dateTimeFilter(new Date(err?.dateCreated), 'ca')}
                </Typography>
                <Box className='w-full'>
                  <Typography className="text-lg font-semibold text-gray-900 dark:text-white"
                    variant='h3'><span className='block sm:hidden'>Reason:</span> {err.message}
                  </Typography>
                  <Box className="w-full flex justify-end flex-col items-end text-right text-lg font-normal text-gray-900 dark:text-gray-400">
                    <Typography variant="body1" className="text-right text-lg font-normal text-gray-900 dark:text-gray-400">User:</Typography>
                    <Typography variant="body1" className="text-right text-lg font-normal text-gray-900 dark:text-white">{err.user}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Pagination Controls */}
        <List className="flex justify-center mt-6" aria-label="Page navigation example">
          {Array.from({ length: totalPages }, (_, index) => (
            <ListItem key={index} onClick={() => handlePageClick(index + 1)} className={`cursor-pointer flex items-center mx-0 my-2 px-0 h-8 w-8 text-sm`}>
              <ListItemText
                className={`${currentPage === index + 1 ? 'dark:bg-sky-700' : ''} flex items-center justify-center px-1 h-6 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                primary={index + 1}
              />
            </ListItem>
          ))
          }
        </List>
      </Box>
    </section>
  )
}

export default Errors
