// React and Next import
import { useState, useCallback, useEffect } from 'react'
import { Inter } from "next/font/google"

// Internal imports
import { SlotCard } from '@organisms'
import { SlotProperties, SlotTypesEnum } from '@/common/types/slots-types'
import BookedSlotsModal from '@/common/components/organisms/Modals/BookedSlotsModal'
import { useAlert } from '@/providers/alert'
import { headers } from '@/common/constants'

// External imports
import Stack from '@mui/material/Stack'
import useSlots from '@/common/store/slots/slots'
import { Typography, Box } from '@mui/material'
import { EmptyMessages } from '@/common/types/empty-messages'
import { useErrorStore, useFavorities, useUserStore } from '@/common/store'

const inter = Inter({ subsets: ["latin"] })

const Home = () => {
  const { user } = useUserStore()
  const { favoriteSlots } = useFavorities()
  const { slotsArray } = useSlots()
  const { error, setError } = useErrorStore()
  const { setAlert } = useAlert()
  const [slots, setSlots] = useState<SlotProperties[]>([])
  const [filteredSlots, setFilteredSlots] = useState<SlotProperties[]>([])
  const [slot, setSlot] = useState<SlotProperties>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const fetchSlots = useCallback(async () => {
    const response = await fetch('/api/slots/getSlots', {
      headers: headers,
      method: 'GET',
    })

    if (response.ok) {
      const fetchedSlots = await response.json()
      setSlots(fetchedSlots)
      useSlots.setState({ slotsArray: fetchedSlots })
    } else {
      const errorResponse = await response.json()
      console.log(errorResponse.message)
    }
  }, [])

  const updateFavoriteSlots = useCallback(async () => {
    const removedFavoriteSlots = findNonExistentSlots(favoriteSlots, slotsArray)
    if (removedFavoriteSlots && removedFavoriteSlots.length > 0) {
      removedFavoriteSlots.forEach(async slot => {
        await fetch('/api/user/setFavoriteSlot', {
          body: JSON.stringify({
            user: user,
            slot: slot,
            toggle: true
          }),
          headers: headers,
          method: 'POST',
        }).then(async res => {
          const data = await res.json()
          useFavorities.setState({ favoriteSlots: data.favoriteSlots })
        })
      })
    }
  }, [])

  const clearErrorsFromFirebase = useCallback(async () => { // clear errors from firebase in database // TODO: this can be cron job from functions
    try {
        await fetch('/api/errors/deleteErrors', {
            headers: headers,
            method: 'DELETE',
        })
    } catch (error) {
        console.log(error)
    }
  }, [])

  const findNonExistentSlots = (arr1: SlotProperties[], arr2: SlotProperties[]): SlotProperties[] => {
    const carSlotsIds = arr2.map(slot => slot.id)
    return arr1.filter(slot => !carSlotsIds.includes(slot.id))
  }

  const hideModal = () => {
    setShowModal(false)
  }

  const save = () => {
    hideModal()
  }

  const handlerModal = (slot: SlotProperties) => {
    setSlot(slot)
    setShowModal(!showModal)
  }

  const getFavoriteSlots = (favoriteSlots: SlotProperties[]) => {
    if (selectedCategory === 'favorities') {
      return setFilteredSlots(favoriteSlots)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setFilteredSlots(slots)
    } else if (category === 'favorities') {
      setFilteredSlots(favoriteSlots || [])
    } else {
      setFilteredSlots(slots.filter(slot => slot.type === category))
    }
  }

  const getAvailableCategories = () => {
    const availableCategories: Record<string, string> = { all: 'All categories' }
    if (slots.some(slot => slot.type === SlotTypesEnum.CAR)) availableCategories[SlotTypesEnum.CAR] = 'Car slots'
    if (slots.some(slot => slot.type === SlotTypesEnum.DESK)) availableCategories[SlotTypesEnum.DESK] = 'Desk slots'
    availableCategories['favorities'] = 'Favorite slots'
    return availableCategories
  }

  useEffect(() => {
    fetchSlots().catch(console.error)
  }, [fetchSlots])

  useEffect(() => {
    if (error) {
      setAlert('', error, 'error')
      setTimeout(() => { setError(null) }, 3000)
    }
  }, [error, setAlert, setError])

  useEffect(() => {
    handleCategoryChange(selectedCategory)
  }, [slots, selectedCategory])

  useEffect(() => {
    updateFavoriteSlots().catch(console.error)
    clearErrorsFromFirebase().catch(console.error)
  }, [])

  return (
    <Box className={`${inter.className} mx-2 md:mx-0 mt-7 md:mt-10`}>
      {user && selectedCategory && <Box className="flex items-center justify-center pb-4 md:pb-8 flex-wrap">
        {Object.entries(getAvailableCategories())?.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`${selectedCategory === key ? 'dark:bg-blue-700' : 'dark:bg-gray-900'} text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800`}
            onClick={() => handleCategoryChange(key)}
          >
            {label}
          </button>
        ))}
      </Box>}
      {showModal && user && <BookedSlotsModal data={slot} onClose={hideModal} onConfirm={save} />}
      <Stack
        spacing={{ xs: 2, sm: 2, lg: 2, xl: 2, '2xl': 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        sx={{ justifyContent: 'center' }}
      >
        {filteredSlots?.map((slot: SlotProperties) => (
          <SlotCard key={slot.id} slot={slot} onHandleClick={handlerModal} handleFavoriteSlots={getFavoriteSlots} />
        ))}
      </Stack>
      {filteredSlots?.length === 0 && (
        <Box className="w-full min-h-14 flex justify-center items-center">
          <Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2">
            {EmptyMessages.NO_SLOTS}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Home