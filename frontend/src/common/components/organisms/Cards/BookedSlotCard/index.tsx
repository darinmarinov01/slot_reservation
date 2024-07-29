'use client'

// Next imports
import Image from 'next/image'
// Internal imports
import { SlotTypesEnum, BookedSlots, SlotProgress, SlotProgressColor } from '@/common/types/slots-types'
import { calculateProgress, dateTimeFilter } from '@/common/utils'
import { RoundIcon } from "@atoms"
//Extarnal imports
import Typography from '@mui/material/Typography'
import { TrashIcon } from '@heroicons/react/24/solid'
import Box from '@mui/material/Box'

type BookedSlotTypes = {
    data: any,
    onHandleClick: (slot: BookedSlots) => void,
    onHandleDeleteClick: (slot: BookedSlots) => void,
    isDeleted: boolean
}

const BookedCardSlot = ({ data, onHandleClick, onHandleDeleteClick, isDeleted = false }: BookedSlotTypes) => {
    const onHandleDeleteSlot = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        onHandleDeleteClick(data)
    }

    const progressPercentageCalculate = (slot: BookedSlots) => {
        const progress = calculateProgress(slot)
        return progress.toFixed(1) + '%'
    }

    return (
        <Box className="min-h-full" onClick={() => { onHandleClick(data) }}>
            <Box className="relative">
                <Box className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <Box className="bg-blue-700 h-2.5" style={{width : progressPercentageCalculate(data)}}></Box>
                </Box>
                {isDeleted && <RoundIcon onClick={(e) => onHandleDeleteSlot(e)} additionalCss={'absolute z-[20] left-3 top-[60px]'} icon={<TrashIcon />} />}
                <Box>
                    {data?.slot?.free && (
                        <Image className="w-full h-[300px] object-cover"
                            width='300'
                            height='300'
                            src="/assets/224_green_169949.webp"
                            alt="Sunset in the mountains"
                        />
                    )}
                    {!data.slot.free && (
                        <Image className="w-full h-[300px] object-cover"
                            width='300'
                            height='300'
                            src="/assets/221_ruby-red_cb0914.webp"
                            alt="Sunset in the mountains"
                        />
                    )}
                </Box>
                <Box className='flex'>
                    <Typography className='text-white text-lg ml-3 mr-2 mt-3 font-bold' variant="body2"> Slot Information: </Typography>
                </Box>
                <Box className="border-gray-500 w-full border-2 mt-3 mb-2"></Box>
                <Box
                    className={`text-xs absolute top-0 right-0 ${data.progress == SlotProgress.COMPLETED ? SlotProgressColor.RED : data.progress == SlotProgress.IN_PROGRESS ? SlotProgressColor.ORANGE : SlotProgressColor.GREEN} px-10 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out`}>
                    {data.progress}
                </Box>
                <Box
                    className="text-xs absolute top-0 left-0 bg-gray-500 px-10 py-2 text-white mt-3 ml-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                    {data.slot.type === SlotTypesEnum.DESK ? 'Desk' : 'Car'}
                </Box>
            </Box>
            <Box className="px-4 py-2 mb-auto">
                <Box className='flex'>
                    <Typography className='text-white text-lg mr-2 max-w-28 w-full' variant="body2"> Location: </Typography> <Typography className='text-white text-lg font-medium' variant="h2"> {data.slot.location} </Typography>
                </Box>
                <Box className='flex'>
                    <Typography className='text-white text-lg mr-2 max-w-28 w-full' variant="body2"> Description: </Typography> <Typography className='text-white text-lg font-medium' variant="h5"> {data.slot.description} </Typography>
                </Box>
            </Box>
            <Box className='flex'>
                <Typography className='text-white text-lg ml-3 mr-2 mt-3 font-bold' variant="body2"> Date Information: </Typography>
            </Box>
            <Box className="border-gray-500 w-full border-2 mt-2 mb-2"></Box>
            <Box className="px-4 py-2 mb-auto">
                <Box className='flex'>
                    <Typography className='text-white text-lg mr-2 max-w-28 w-full' variant="body2"> Start Date: </Typography> <Typography className='text-white text-lg font-bold' variant="h5"> {dateTimeFilter(data.startDate, 'ca')} </Typography>
                </Box>
                <Box className='flex'>
                    <Typography className='text-white text-lg mr-2 max-w-28 w-full' variant="body2"> End Date: </Typography> <Typography className='text-white text-lg font-bold' variant="h5"> {dateTimeFilter(data.endDate, 'ca')} </Typography>
                </Box>
            </Box>
            <Box className="px-6 py-1 flex flex-row items-center justify-between bg-gray-100">
                <Box className='flex'>
                    <Typography className='text-black text-lg font-bold' variant="h5"> {data.description} </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default BookedCardSlot