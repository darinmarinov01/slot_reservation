'use client'
// React and next imports
import * as React from 'react'
import { useCallback, useEffect, useState } from "react"
// Internal imports
import { Button, Select, TextField } from "@atoms"
import Modal from "../index"
import { dateTimeFilter, isNotAvailable } from '@/common/utils'
import DateTimeRangePicker from '@/common/components/atoms/DateTimeRangePicker'
import { SlotProperties, BookedSlots } from '@/common/types/slots-types'
import { useUserStore } from '@store'
import { useAlert } from "@/providers/alert"
import { headers } from '@/common/constants'
//External imports
import Typography from '@mui/material/Typography'
import { MenuItem, SelectChangeEvent, Box, FormLabel, List, ListItem, ListItemText } from "@mui/material"
import dayjs, { Dayjs } from 'dayjs'
// Firebase imports
import { collection, query, where, onSnapshot, doc } from "firebase/firestore"
import { db } from '@/firebase/firebase-config'

type Props = {
    data?: any,
    onClose: () => void
    onConfirm?: () => void,
}

const today = dayjs()

const BookedSlotsModal = ({ data, onClose, onConfirm }: Props) => {
    const user = useUserStore((state) => state.user)
    const { setAlert } = useAlert()
    const [slotDates, setSlotDates] = useState<any[]>([])
    const [bookedTimes, setBookedTimes] = useState<any[]>([])
    const [slots, setSlots] = useState<SlotProperties[]>([])
    const [slot, setSlot] = useState<SlotProperties>(data)
    const [startDate, setStartDate] = useState<Dayjs>(today)
    const [endDate, setEndDate] = useState<Dayjs>(today)
    const [description, setDescription] = useState<string>('')
    const [available, setAvailable] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(true)

    const fetchSlots = useCallback(async () => {
        const response = await fetch('/api/slots/getSlots', {
            headers: headers,
            method: 'Get',
        })
        if (response.ok) {
            const fetchedSlots = await response.json()
            setSlots(fetchedSlots)
            // Set the default slot if data is provided
            if (data?.id) {
                const selectedSlot = fetchedSlots.find((sl: SlotProperties) => sl.id == data.id)
                setSlot(selectedSlot)
            }
        } else {
            const errorResponse = await response.json()
            console.log(errorResponse.message)
        }
    }, [data?.id])

    const fetchBookedSlots = useCallback(async () => {
        if (!slot?.id) return;

        const response = await fetch('/api/bookedSlots/getAllSlots', {
            headers: headers,
            method: 'GET',
        })

        if (response.ok) {
            const bookedSlots = await response.json()
            const filteredSlotsById = bookedSlots?.filter((sl: BookedSlots) => sl?.slot?.id == slot.id) || []
            const filteredSlotsByDate = filteredSlotsById.filter((sl: BookedSlots) => dayjs(sl?.endDate) > today) || []
            const mappedSlots = filteredSlotsByDate.map((slot: BookedSlots) => ({ ...slot, startDate: new Date(slot.startDate), endDate: new Date(slot.endDate) }))
            setSlotDates(mappedSlots)
        } else {
            const errorResponse = await response.json()
            console.log(errorResponse.message)
        }
    }, [slot?.id])

    const handleSlotsChange = (event: SelectChangeEvent | any) => {
        setSlot(event.target.value)
    }

    const handleBookASlot = async () => {
        if (slot && startDate && endDate && user) {
            const data = {
                user: user,
                slot: slot,
                startDate: startDate,
                endDate: endDate,
                description: description
            }
            try {
                await fetch('/api/bookedSlots/createSlot', {
                    body: JSON.stringify({
                        ...data
                    }),
                    headers: headers,
                    method: 'Post',
                }).then(() => {
                    setAlert('', `${'New booked slot is added'}`, 'success')
                })
            } catch (err) {
                console.log(err)
                setAlert('', `${err}`, 'error')
            }
            onClose()
        }
    }

    const onHandleStartDate = (date: Dayjs) => {
        if (date) {
            setStartDate(date)
        }
        return date
    }

    const onHandleEndDate = (date: Dayjs) => {
        if (date) {
            setEndDate(date)
        }
        return date
    }

    const checkAvailability = (startDate: Dayjs | undefined, endDate: Dayjs | undefined, bookedTimes: any[]) => {
        if (startDate && endDate) {
            const notAvailable = isNotAvailable(startDate.toDate(), endDate.toDate(), bookedTimes)
            setDisabled(notAvailable)
            setAvailable(notAvailable)
        } else {
            setDisabled(true)
            setAvailable(false)
        }
    }

    useEffect(() => {
        if (slot?.id) {
            const slotDocRef = doc(db, "slots", slot.id)
            const q = query(collection(db, "bookedSlots"), where("endDate", ">=", (today as any).$d), where('slot', '==', slotDocRef))
            const period: any = []

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (querySnapshot.empty) {
                    setAvailable(false)
                    
                    if (!startDate && !endDate) {
                        setDisabled(true)
                    }
                }

                querySnapshot.forEach((bookedSlots) => {
                    const data = bookedSlots.data()
                    period.push({
                        unavailableDateStart: data.startDate,
                        unavailableDateEnd: data.endDate
                    })

                    setBookedTimes(period)
                    checkAvailability(startDate, endDate, period)
                })

                if (dayjs(startDate) <= today || dayjs(endDate) <= dayjs(startDate)) {
                    setDisabled(true)
                } else {
                    checkAvailability(startDate, endDate, period)
                }
            })
            return () => unsubscribe()
        }
    }, [startDate, endDate, slot?.id])

    useEffect(() => {
        fetchSlots().catch(console.error)
    }, [fetchSlots, user])

    useEffect(() => {
        fetchBookedSlots().catch(console.error)
    }, [fetchBookedSlots, slot, user])

    return (
        <>
            <Modal onClose={onClose} onConfirm={onConfirm}>
                <Box className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <Typography className="text-xl font-semibold text-gray-900 dark:text-white" variant='h3'>
                        Book a slot
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
                        Book your favorite place
                    </Typography>
                    {slots?.length && slot && <Box className="text-white">
                        <FormLabel
                            htmlFor="slots"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Slots
                        </FormLabel>
                        <Select
                            className="bg-gray-50 text-white bordertext-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            labelId="slot"
                            id="slot"
                            value={slot}
                            label="Slots"
                            placeholder='Selected slot'
                            onChange={(e) => handleSlotsChange(e)}
                        >
                            {slots?.map((slot: any, index: number) => (
                                <MenuItem key={slot + index} value={slot}>{slot.location}</MenuItem>
                            ))}
                        </Select>
                    </Box>}
                    <Box className="text-white">
                        <FormLabel
                            htmlFor="slots"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Appointment start and end date
                        </FormLabel>
                        <DateTimeRangePicker 
                            dates={{ startDate: slotDates[0], endDate: slotDates[slotDates.length - 1] }}
                            notAvailable={available} 
                            onChangeStartDate={onHandleStartDate} 
                            onChangeEndDate={onHandleEndDate} 
                            isNewSlot={true}
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
                            sx={{
                                // Root class for the input field
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
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                        />
                    </Box>
                </Box>
                <Box>
                    <Typography className='text-white px-6'>
                        {slotDates.length > 0 ? 'Upcoming occupied slots:' : 'No any occupied slots!'}
                    </Typography>
                    <List className='text-white px-4'>
                        {slotDates && slotDates?.map((sl: any) => (
                            <ListItem key={sl.id} className='py-0'>
                                <ListItemText
                                    className='text-white'
                                    primary={`${dateTimeFilter(sl?.startDate, 'ca')} to ${dateTimeFilter(sl?.endDate, 'ca')} from ${sl?.user?.name ? sl?.user?.name : 'Deleted User'}`}
                                />
                            </ListItem>
                        ))
                        }
                    </List>
                </Box>
                <Box className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <Button onClick={handleBookASlot} data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={disabled}>Save</Button>
                </Box>
            </Modal>
        </>
    )
}

export default BookedSlotsModal
