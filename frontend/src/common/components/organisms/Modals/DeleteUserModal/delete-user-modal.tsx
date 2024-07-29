'use client'
// React and next imports
import * as React from 'react'
// Internal imports
import { Button } from "@atoms"
import Modal from "../index"
import { useAlert } from "@/providers/alert"
import { headers } from '@/common/constants'
//External imports
import { SelectChangeEvent, Box, Typography } from "@mui/material"

type Props = {
    data?: any,
    onClose: () => void
    onConfirm?: () => void
}

const DeleteUserModal = ({ data, onClose, onConfirm }: Props) => {
    const { setAlert } = useAlert()

    const handleDeleteUser = async (event: SelectChangeEvent | any) => {
        event.preventDefault()
        if (data?.id) {
            try {
                await fetch('/api/user/deleteUser', {
                    body: JSON.stringify({...data}),
                    headers: headers,
                    method: 'PUT',
                }).then(async response => {
                    if (response.ok) {
                        await fetch('/api/bookedSlots/deleteBookedSlotsByUser', { // if slot is deleted, remove all booked slots connected with him
                            body: JSON.stringify({...data}),
                            headers: headers,
                            method: 'DELETE',
                        })
                    }
                })
            } catch (error) {
                console.log(error)
                setAlert('', `${error}`, 'error')
            }
            onClose()
            setAlert('', `User with email ${data.email} is deleted`, 'success')
        }
    }

    return (
        <>
            <Modal onClose={onClose} onConfirm={onConfirm}>
                <Box className="flex items-center justify-center text-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <Typography className="text-xl font-semibold text-gray-900 dark:text-white" variant='h3'>
                        Delete a user
                    </Typography>
                    <Button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </Button>
                </Box>
                <Box className="p-4 md:p-5 space-y-4">
                    <Typography className="text-base leading-relaxed text-gray-500 dark:text-gray-400" variant='body2'>
                        Are you sure you want to delete this user
                    </Typography>
                </Box>
                <Box className="flex items-center justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <Button onClick={handleDeleteUser} data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Delete</Button>
                </Box>
            </Modal>
        </>
    )
}

export default DeleteUserModal