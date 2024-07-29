//@ts-nocheck

// React imports
import { useCallback, useEffect, useState } from "react"
import { TrashIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid'

// Internal imports
import { SlotProperties, SlotTypesEnum } from "@/common/types/slots-types"
import { DeleteSlotModal, EditSlotModal, CreateSlotModal } from "@organisms"
import { RoundIcon, Button } from "@atoms"
import { useSlots } from "@/common/store"
import { Typography } from "@mui/material"
import { EmptyMessages } from "@/common/types/empty-messages"
import { headers } from '@/common/constants'

// External imports
import Box from '@mui/material/Box'

function Slots() {
    const { slotsArray } = useSlots()
    const [slots, setSlots] = useState<SlotProperties[]>([])
    const [currentSlot, setCurrentSlot] = useState<SlotProperties | null>(null)
    const [modals, setModals] = useState({ showDeleteModal: false, showEditModal: false, showCreateModal: false })
    const [sortConfig, setSortConfig] = useState<{ key: keyof SlotProperties, direction: 'asc' | 'desc' }>({ key: 'location', direction: 'asc' })

    const fetchSlots = useCallback(async () => {
        try {
            const response = await fetch('/api/slots/getSlots', {
                headers: headers,
                method: 'GET',
            })

            if (!response.ok) throw new Error(await response.json())

            const data = await response.json()
            setSlots(data)
            useSlots.setState({ slotsArray: data })
        } catch (error) {
            console.error("Failed to fetch slots:", error)
        }
    }, [])

    const openModal = (slot: SlotProperties | null, modalType: 'showDeleteModal' | 'showEditModal' | 'showCreateModal') => {
        setCurrentSlot(slot)
        setModals((prev) => ({ ...prev, [modalType]: true }))
    }

    const closeModal = () => {
        setModals({ showDeleteModal: false, showEditModal: false, showCreateModal: false })
        setCurrentSlot(null)
    }

    const handleDeleteConfirm = async () => {
        closeModal()
    }

    const handleEditConfirm = async () => {
        closeModal()
    }

    const sortSlots = (key: keyof SlotProperties, direction: 'asc' | 'desc', slotList: SlotProperties[] = slots) => {
        setSortConfig({ key, direction })
        const sortedUsers = [...slotList].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        })
        setSlots(sortedUsers)
    }

    const handleSort = (key: keyof SlotProperties) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        sortSlots(key, direction)
    }

    const renderSortArrow = (key: keyof SlotProperties) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '↑' : '↓'
        }
        return ''
    }

    useEffect(() => {
        fetchSlots()
    }, [fetchSlots, modals.showDeleteModal, modals.showEditModal, modals.showCreateModal])

    return (
        <Box className="relative overflow-x-auto shadow-md sm:rounded-lg mt-7 md:mt-10">
            {modals.showDeleteModal && currentSlot && <DeleteSlotModal data={currentSlot} isBookedSlot={false} onClose={closeModal} onConfirm={handleDeleteConfirm} />}
            {modals.showEditModal && currentSlot && <EditSlotModal data={currentSlot} onClose={closeModal} onConfirm={handleEditConfirm} />}
            {modals.showCreateModal && <CreateSlotModal onClose={closeModal} onConfirm={handleEditConfirm} />}
            <Button onClick={(e) => { e.preventDefault(); openModal(null, 'showCreateModal') }} data-modal-hide="default-modal" type="button" className="text-white mt-0 mb-10 flex self-end ml-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Slot</Button>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <Box className="flex items-center cursor-pointer" onClick={() => handleSort('location')}>
                                Location {renderSortArrow('location')}
                            </Box>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <Box className="flex items-center cursor-pointer" onClick={() => handleSort('type')}>
                                Type {renderSortArrow('type')}
                            </Box>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <Box className="flex items-center cursor-pointer" onClick={() => handleSort('description')}>
                                Description {renderSortArrow('description')}
                            </Box>
                        </th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Edit</span></th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{slot.location}</th>
                            <td className="px-6 py-4">{slot.type === SlotTypesEnum.CAR ? 'Car' : 'Desk'}</td>
                            <td className="px-6 py-4">{slot.description}</td>
                            <td className="px-6 py-4 flex justify-end">
                                <RoundIcon onClick={(e) => { e.preventDefault(); openModal(slot, 'showEditModal') }} additionalCss="cursor-pointer" icon={<WrenchScrewdriverIcon />} />
                                <RoundIcon onClick={(e) => { e.preventDefault(); openModal(slot, 'showDeleteModal') }} additionalCss="cursor-pointer" icon={<TrashIcon />} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {slots?.length == 0 && <Box className="mt-10 w-full min-h-14 flex justify-center items-center"><Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> {EmptyMessages.NO_SLOTS} </Typography></Box>}
        </Box>
    )
}

export default Slots
