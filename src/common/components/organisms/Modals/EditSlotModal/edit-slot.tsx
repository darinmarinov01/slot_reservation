'use client'

// React and next imports
import React, { useEffect, useState } from 'react'

// Internal imports
import { Button, TextField } from "@atoms"
import Modal from "../index"
import { SlotProperties } from '@/common/types/slots-types'
import { useAlert } from "@/providers/alert"
import { headers } from '@/common/constants'
// External imports
import { Box, FormLabel, Typography } from "@mui/material"

type Props = {
    data?: SlotProperties
    isOnlyRead?: boolean
    onClose: () => void
    onConfirm?: () => void
}

const EditSlotModal = ({ data, onClose, onConfirm, isOnlyRead }: Props) => {
    const { setAlert } = useAlert()
    const [slot, setSlot] = useState<SlotProperties | null>(null)
    const [location, setLocation] = useState<string>(data?.location || '')
    const [description, setDescription] = useState<string>(data?.description || '')

    const handleSlot = async () => {
        if (slot) {
            const slotData = {
                id: data?.id,
                type: data?.type,
                location,
                description,
            }
            try {
                await fetch('/api/slots/updateSlot', {
                    body: JSON.stringify(slotData),
                    headers: headers,
                    method: 'PUT',
                })
            } catch (error) {
                console.error(error)
                setAlert('', `${error}`, 'error')
            }
            onClose()
            setAlert('', `${'Slot is updated'}`, 'success')
        }
    }

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value)
    }

    useEffect(() => {
        setSlot(data || null)
    }, [data])

    return (
        <Modal onClose={onClose} onConfirm={onConfirm}>
            <Box className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <Typography variant="h3" className="text-xl font-semibold text-gray-900 dark:text-white">
                    {!isOnlyRead ? 'Edit booked slot' : 'Info about booked slot'}
                </Typography>
                <Button
                    onClick={onClose}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="default-modal"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                </Button>
            </Box>
            <Box className="p-4 md:p-5 space-y-4">
                <Typography variant="body2" className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Update slot information
                </Typography>
                <Box>
                    <FormLabel htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Location
                    </FormLabel>
                    <TextField
                        id="location"
                        value={location}
                        onChange={handleChange(setLocation)}
                        multiline
                        rows={4}
                        className="bg-gray-50 text-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        sx={{
                            '& .MuiInputBase-root': {
                                width: '100%',
                            },
                            '& .MuiInputBase-input': {
                                color: '#fff',
                            },
                        }}
                    />
                </Box>
                <Box>
                    <FormLabel htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Description
                    </FormLabel>
                    <TextField
                        id="description"
                        value={description}
                        onChange={handleChange(setDescription)}
                        multiline
                        rows={4}
                        className="bg-gray-50 text-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        sx={{
                            '& .MuiInputBase-root': {
                                width: '100%',
                            },
                            '& .MuiInputBase-input': {
                                color: '#fff',
                            },
                        }}
                    />
                </Box>
            </Box>
            <Box className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <Button
                    onClick={handleSlot}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    data-modal-hide="default-modal"
                >
                    Save
                </Button>
            </Box>
        </Modal>
    )
}

export default EditSlotModal
