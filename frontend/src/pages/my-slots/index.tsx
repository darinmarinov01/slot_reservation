// React and Next import
import { useCallback, useEffect, useState } from "react"
import Head from 'next/head'

// Firebase imporst
import 'firebase/firestore'

// Internal imports
import { SlotProperties, BookedSlots, BookedSlotsWithProgress } from '@/common/types/slots-types'
import { EmptyMessages } from '@/common/types/empty-messages'
import { useFavorities, useUserStore, useSlots } from '@store'
import { TabNav, SlotCard, BookedCardSlot, DeleteSlotModal, EditBookedSlotsModal, BookedSlotsModal } from "@organisms"
import { slotStatus } from '@/common/utils'
import { headers } from '@/common/constants'

// External imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import dayjs, { Dayjs } from 'dayjs'
import { BeakerIcon, HeartIcon } from '@heroicons/react/24/solid'

const now = dayjs()
const endOfDay = now.endOf('day')
const startOfDay = now.startOf('day')

const MySlots = () => {
  const user = useUserStore((state) => state.user)
  const { slotsArray } = useSlots()
  const { favoriteSlots } = useFavorities()
  const tabs = [{ name: 'Booking history', icon: BeakerIcon }, { name: 'Favorites', icon: HeartIcon }]
  const [upcomingSlots, setUpcomingSlots] = useState<BookedSlots[]>([])
  const [todaySlots, setTodaySlots] = useState<BookedSlots[]>([])
  const [pastSlots, setPastSlots] = useState<BookedSlots[]>([])
  const [slot, setSlot] = useState<SlotProperties>()
  const [activeTab, setActiveTab] = useState(0)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showBookedModal, setShowBookedModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const fetchBookedSlots = useCallback(async () => {
    if (user) {
      const response = await fetch('/api/bookedSlots/getSlotsByUser', {
        body: JSON.stringify({ user }),
        headers: headers,
        method: 'POST',
      })

      if (response.ok) {
        const fetchedSlots = await response.json()
        setUpcomingSlots([])
        setTodaySlots([])
        setPastSlots([])

        fetchedSlots.forEach(async (slot: BookedSlotsWithProgress) => {
          if (slot) {
            const startDate = dayjs(slot.startDate)
            const endDate = dayjs(slot.endDate)
            slot.progress = slotProgress(slot)
            slot.startDate = new Date(slot.startDate)
            slot.endDate = new Date(slot.endDate)

            if (endDate < now) {
              setPastSlots(prevArray => [...prevArray, slot])
            } else if ((startDate >= startOfDay || startDate <= startOfDay) && startDate <= endOfDay) {
              setTodaySlots(prevArray => [...prevArray, slot])
            } else if (startDate > now) {
              setUpcomingSlots(prevArray => [...prevArray, slot])
            }
          }
        })
      } else {
        const errorResponse = await response.json()
        console.log(errorResponse.message)
      }
    }
  }, [user, showModal, showDeleteModal, activeTab])

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

  const handlerModal = (slot: SlotProperties) => {
    setSlot(slot)
    setShowModal(true)
  }

  const handlerBookedSlotModal = (slot: any) => {
    setSlot(slot)
    setShowBookedModal(true)
  }

  const handlerDeleteModal = (slot: any) => {
    setSlot(slot)
    setShowDeleteModal(true)
  }

  const tabChangeHandler = (index: number) => {
    setActiveTab(index)
  }

  const hideModal = () => {
    setShowModal(false)
    setShowDeleteModal(false)
    setShowBookedModal(false)
  }

  const save = () => {
    hideModal()
  }

  const slotProgress = (slot: BookedSlots) => {
    if (slot?.id) {
      const startDate = dayjs(slot.startDate)
      const endDate = dayjs(slot.endDate)
      return slotStatus(startDate, endDate, now)
    }
  }

  const findNonExistentSlots = (arr1: SlotProperties[], arr2: SlotProperties[]): SlotProperties[] => {
    const carSlotsIds = arr2.map(slot => slot.id)
    return arr1.filter(slot => !carSlotsIds.includes(slot.id));
  }

  useEffect(() => {
    fetchBookedSlots().catch(console.error)
  }, [fetchBookedSlots])

  useEffect(() => {
    updateFavoriteSlots().catch(console.error)
  }, [])

  return (
    <>
      <Head>
        <title>My All Slots</title>
        <meta name="description" content="All slots to current user" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="bg-gray-50 dark:bg-gray-900">
        {showModal && <EditBookedSlotsModal data={slot} onClose={hideModal} onConfirm={save} />}
        {showDeleteModal && <DeleteSlotModal data={slot} isBookedSlot={true} onClose={hideModal} onConfirm={save} />}
        {showBookedModal && user && <BookedSlotsModal data={slot} onClose={hideModal} onConfirm={save} />}

        <TabNav tabs={tabs} onTabChange={tabChangeHandler} activeTab={activeTab} />

        {activeTab == 0 && <>
          {upcomingSlots && <Box className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
            <Typography className='text-white text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> Upcomming bookings: </Typography>
            <Box className="border-gray-200 w-full border-2 mt-2 mb-8"></Box>

            <Box className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {upcomingSlots?.map((slot: BookedSlots) => (
                <Box key={slot.id} className="group">
                  <Box className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg bg-gray-700 xl:aspect-h-8 xl:aspect-w-7">
                    <BookedCardSlot data={slot} onHandleClick={handlerModal} onHandleDeleteClick={handlerDeleteModal} isDeleted={true} />
                  </Box>
                </Box>
              ))}
            </Box>
            {upcomingSlots.length == 0 && <Box className="w-full min-h-14 flex justify-center items-center text-center"><Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> {EmptyMessages.NO_UPCOMMING_BOOKINGS} </Typography></Box>}
          </Box>}

          {todaySlots && <Box className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
            <Typography className='text-white text-2xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> Todays bookings: </Typography>
            <Box className="border-gray-200 w-full border-2 mt-2 mb-8"></Box>

            <Box className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {todaySlots?.map((slot: BookedSlots) => (
                <Box key={slot.id} className="group">
                  <Box className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg bg-gray-700 xl:aspect-h-8 xl:aspect-w-7">
                    <BookedCardSlot data={slot} onHandleClick={handlerModal} onHandleDeleteClick={handlerDeleteModal} isDeleted={true} />
                  </Box>
                </Box>
              ))}
            </Box>
            {todaySlots.length == 0 && <Box className="w-full min-h-14 flex justify-center items-center"><Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> {EmptyMessages.NO_TODAYS_BOOKINGS} </Typography></Box>}
          </Box>}

          {pastSlots && <Box className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
            <Typography className='text-white text-2xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> Past bookings: </Typography>
            <Box className="border-gray-200 w-full border-2 mt-2 mb-8"></Box>

            <Box className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {pastSlots?.map((slot: BookedSlots) => (
                <Box key={slot.id} className="group">
                  <Box className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg bg-gray-700 xl:aspect-h-8 xl:aspect-w-7 pointer-events-none opacity-40">
                    <BookedCardSlot data={slot} onHandleClick={handlerModal} onHandleDeleteClick={handlerDeleteModal} isDeleted={false} />
                  </Box>
                </Box>
              ))}
            </Box>
            {pastSlots.length == 0 && <Box className="w-full min-h-14 flex justify-center items-center"><Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> {EmptyMessages.NO_PAST_BOOKINGS} </Typography></Box>}
          </Box>}
        </>}
        {activeTab == 1 && <>
          {favoriteSlots?.length > 0 && <Box className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
            <Typography className='text-white text-2xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> Favorite slots: </Typography>
            <Box className="border-gray-200 w-full border-2 mt-2 mb-8"></Box>

            <Box className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {favoriteSlots?.map((slot: SlotProperties) => (
                <Box key={slot.id} className="group">
                  <Box className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg bg-gray-700 xl:aspect-h-8 xl:aspect-w-7">
                    <SlotCard slot={slot} onHandleClick={handlerBookedSlotModal    } isDeleted={false} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>}
          {favoriteSlots?.length == 0 && <Box className="w-full min-h-96 flex justify-center items-center"><Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> {EmptyMessages.NO_FAVORITE_SLOTS} </Typography></Box>}
        </>}
      </section>
    </>

  )
}
export default MySlots