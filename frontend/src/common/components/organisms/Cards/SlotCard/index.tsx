'use client'

// Next imports
import Image from 'next/image'
// Internal imports
import { SlotTypesEnum, SlotProperties } from '@/common/types/slots-types'
import { RoundIcon } from "@atoms"
import { useFavorities, useUserStore } from '@store'
import { useAlert } from "@/providers/alert"
import { headers } from '@/common/constants'
// Extra imports
import Typography from '@mui/material/Typography'
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid'
import Box from '@mui/material/Box'

type SlotTypes = {
  slot: SlotProperties,
  isDeleted?: boolean,
  onHandleClick: (slot: SlotProperties) => void,  
  handleFavoriteSlots?: (slots: SlotProperties[]) => void,  
}

const SlotCard = ({ slot, isDeleted = false, onHandleClick, handleFavoriteSlots}: SlotTypes) => {
  const { setAlert } = useAlert()
  const { favoriteSlots , setFavoriteSlots} = useFavorities()
  const { user } = useUserStore()

  const isFavoriteSlot = (slot: SlotProperties) => {
    return favoriteSlots?.some((s: SlotProperties) => s.id === slot.id)
  }

  const toggleSlot = async (event: React.MouseEvent<HTMLButtonElement>, slot: SlotProperties) => {
    event.preventDefault()
    event.stopPropagation()

    if (user) {
      try {
        const response = await fetch('/api/user/setFavoriteSlot', {
          body: JSON.stringify({
            user,
            slot,
            toggle: isFavoriteSlot(slot)
          }),
          headers,
          method: 'POST',
        })

        const data = await response.json().then(d => {
          setFavoriteSlots(d.favoriteSlots)
          if(handleFavoriteSlots) {
            handleFavoriteSlots(d?.favoriteSlots || [])
          }
        })

        const toggle = isFavoriteSlot(slot)
        setAlert('', `${toggle ? 'Favorite slot is removed' : 'New slot is added to favorites'}`, 'success')
      } catch (err) {
        console.error(err)
        setAlert('', `${err}`, 'error')
      }
    }
  }

  const onHandleDeleteSlot = async (event: React.MouseEvent<HTMLButtonElement>, slot: SlotProperties) => {
    event.preventDefault()
    event.stopPropagation()

    // Handle slot deletion logic here
  }

  return (
    <Box onClick={() => onHandleClick(slot)} className="rounded md:mx-0 overflow-hidden shadow-lg flex flex-col min-w-full sm:min-w-[380px] md:min-w-[400px] min-h-full">
      <Box className="relative">
        {user && (
          <RoundIcon
            onClick={(e) => toggleSlot(e, slot)}
            iconFillColor={isFavoriteSlot(slot) ? 'red' : ''}
            additionalCss="absolute z-[20] right-3 top-[8px]"
            icon={<HeartIcon />}
          />
        )}
        {isDeleted && (
          <RoundIcon
            onClick={(e) => onHandleDeleteSlot(e, slot)}
            additionalCss="absolute z-[20] left-3 top-[60px]"
            icon={<TrashIcon />}
          />
        )}
        <Box>
          <Image
            className="w-full h-[300px] object-cover"
            width="400"
            height="400"
            src={slot.type === SlotTypesEnum.CAR ? "/assets/224_green_169949.webp" : "/assets/desk.jpeg"}
            alt={slot.type === SlotTypesEnum.CAR ? "Car" : "Desk"}
          />
          <Box className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></Box>
        </Box>
        <Box className="text-xs absolute top-0 left-0 bg-gray-500 px-2 md:px-10 py-2 md:py-3 text-white mt-3 ml-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
          {slot.type === SlotTypesEnum.CAR ? 'Car' : 'Desk'}
        </Box>
      </Box>
      <Box className="px-3 md:px-6 py-2 md:py-4 mb-auto">
        <Box className="flex">
          <Typography className="text-white text-lg mr-2" variant="body2">Location:</Typography>
          <Typography className="text-white text-lg font-bold max-w-64" variant="h2">{slot.location}</Typography>
        </Box>
        <Box className="flex">
          <Typography className="text-white text-lg mr-2" variant="body2">Description:</Typography>
          <Typography className="text-white text-lg font-bold max-w-64" variant="h5">{slot.description}</Typography>
        </Box>
      </Box>
      <Box className="px-6 py-1 flex flex-row items-center justify-between bg-gray-100"></Box>
    </Box>
  )
}

export default SlotCard
