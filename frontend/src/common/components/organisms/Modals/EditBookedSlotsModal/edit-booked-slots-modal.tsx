'use client'
// React and next imports
import * as React from 'react'
import { useEffect, useState, useCallback } from "react"
// Internal imports
import { Button, Select, TextField } from "@atoms"
import DateTimeRangePicker from '@/common/components/atoms/DateTimeRangePicker'
import Modal from "../index"
import { isNotAvailable } from '@/common/utils'
import { SlotProperties } from '@/common/types/slots-types'
import { User } from '@/common/types/user-types'
import { useUserStore } from '@store'
import { useAlert } from "@/providers/alert"
import { headers } from '@/common/constants'
// Firebase imports
import { collection, query, where, onSnapshot, doc } from "firebase/firestore"
import { db } from '@/firebase/firebase-config'
//External imports
import Typography from '@mui/material/Typography'
import { MenuItem, SelectChangeEvent, Box, FormLabel } from "@mui/material"
import dayjs, { Dayjs } from 'dayjs'

type Props = {
    data?: any
    isOnlyRead?: boolean
    onClose: () => void
    onConfirm?: () => void
}

type BookedSlotData = {
    id: string,
    user: User,
    slot: SlotProperties,
    startDate: Dayjs,
    endDate: Dayjs,
    description: string
}

const today = dayjs()

const EditBookedSlotsModal = ({ data, onClose, onConfirm, isOnlyRead }: Props) => {
    const user = useUserStore((state) => state.user)
    const { setAlert } = useAlert()
    const [bookedTimes, setBookedTimes] = useState<any[]>([])
    const [slot, setSlot] = useState<SlotProperties | null>(null)
    const [startDate, setStartDate] = useState<Dayjs>(dayjs(data?.startDate))
    const [endDate, setEndDate] = useState<Dayjs>(dayjs(data?.endDate))
    const [description, setDescription] = useState<string>(data?.description)
    const [available, setAvailable] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(true)

    const fetchBookedSlots = useCallback((slotId: string) => {
        const slotDocRef = doc(db, "slots", slotId)
        const q = query(collection(db, "bookedSlots"), where("endDate", ">=", today.toDate()), where('slot', '==', slotDocRef))
        const period: any = []

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                setAvailable(false)
                if (!startDate && !endDate) {
                    setDisabled(true)
                }
            }

            querySnapshot.forEach((bookedSlot) => {
                if (bookedSlot.id !== data.id) {
                    const slotData = bookedSlot.data()
                    period.push({
                        unavailableDateStart: slotData.startDate,
                        unavailableDateEnd: slotData.endDate
                    })
                }

                setBookedTimes(period)
                if (startDate && endDate) {
                    const notAvailable = isNotAvailable(startDate.toDate(), endDate.toDate(), period)
                    setDisabled(notAvailable)
                    setAvailable(notAvailable)
                }
            })
        })

        return unsubscribe
    }, [startDate, endDate, data.id])

    const handleBookASlot = async () => {
        if (slot && startDate && endDate && user) {
            const bookedSlotData: BookedSlotData = {
                id: data?.id,
                user: user,
                slot: slot,
                startDate: startDate,
                endDate: endDate,
                description: description
            }

            try {
                const response = await fetch('/api/bookedSlots/updateSlot', {
                    body: JSON.stringify(bookedSlotData),
                    headers: headers,
                    method: 'PUT',
                })

                if (!response.ok) {
                    throw new Error('Failed to update the slot')
                }

                setAlert('', 'Slot is Updated', 'success')
                onClose()
            } catch (error) {
                console.error(error)
                setAlert('', `${error}`, 'error')
            }
        }
    }

    const onHandleStartDate = (date: Dayjs) => {
        setStartDate(date)
    }

    const onHandleEndDate = (date: Dayjs) => {
        setEndDate(date)
    }

    const onHandleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    useEffect(() => {
        if (slot?.id) {
            const unsubscribe = fetchBookedSlots(slot.id)
            return () => unsubscribe()
        }
    }, [fetchBookedSlots, slot?.id])

    useEffect(() => {
        setSlot(data?.slot)
    }, [data])

    return (
        <>
            <Modal onClose={onClose} onConfirm={onConfirm}>
                <Box className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <Typography className="text-xl font-semibold text-gray-900 dark:text-white" variant='h3'>
                        {!isOnlyRead ? 'Edit booked slot' : 'Info about booked slot'}
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
                        Update slot information
                    </Typography>
                    {slot && (
                        <Box className="text-white">
                            <FormLabel
                                htmlFor="slots"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Selected Slot
                            </FormLabel>
                            <Select
                                className="pointer-events-none opacity-70 bg-gray-50 text-white bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                labelId="slot"
                                id="slot"
                                value={slot}
                                label="Slots"
                                placeholder='Selected slot'
                            >
                                <MenuItem>{slot.location}</MenuItem>
                            </Select>
                        </Box>
                    )}
                    <Box className="text-white">
                        <FormLabel
                            htmlFor="slots"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Appointment start and end date
                        </FormLabel>
                        <DateTimeRangePicker
                            dates={{ startDate: data.startDate, endDate: data.endDate }}
                            notAvailable={available}
                            onChangeStartDate={onHandleStartDate}
                            onChangeEndDate={onHandleEndDate}
                            isNewSlot={false}
                            isOnlyPreiview={false}
                        />
                    </Box>
                    <Box className="text-white">
                        <FormLabel
                            htmlFor="slots"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Additional Information
                        </FormLabel>
                        <TextField
                            disabled={isOnlyRead}
                            sx={{
                                "& .MuiInputBase-root": {
                                    width: "100%",
                                },
                                "& .MuiInputBase-input": {
                                    color: "#fff",
                                },
                            }}
                            className="bg-gray-50 text-white bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            value={description}
                            onChange={onHandleDescription}
                        />
                    </Box>
                </Box>
                {!isOnlyRead && (
                    <Box className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <Button onClick={handleBookASlot} disabled={disabled} data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</Button>
                    </Box>
                )}
            </Modal>
        </>
    )
}

export default EditBookedSlotsModal
