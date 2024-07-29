//@ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react"
import FullCalendar, { EventApi, EventClickArg, EventMouseEnterArg, EventMouseLeaveArg } from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import allLocales from "@fullcalendar/core/locales-all"
import interactionPlugin from "@fullcalendar/interaction"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { TrashIcon } from '@heroicons/react/24/solid'
import Box from '@mui/material/Box'

// Internal imports
import { BookedSlots } from "@/common/types/slots-types"
import { convertDataToEvents } from "@/common/utils"
import { DeleteSlotModal, EditBookedSlotsModal } from "@organisms"
import { RoundIcon } from "@atoms"
import { headers } from '@/common/constants'

function AdminBookedSlots() {
  const calendarRef = useRef<FullCalendar | null>(null)
  const [events, setEvents] = useState<EventApi[]>([])
  const [event, setEvent] = useState<EventApi | null>(null)
  const [slots, setSlots] = useState<BookedSlots[]>([])
  const [slot, setSlot] = useState<BookedSlots | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tooltipContent, setTooltipContent] = useState<string>("")
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const clickedSlot = slots.find(slot => slot.id === clickInfo.event.id)
    if (clickedSlot) {
      setSlot(clickedSlot)
      setShowModal(true)
    }
  }, [slots])

  const fetchSlots = useCallback(async () => {
    setIsLoading(true)
    const response = await fetch('/api/bookedSlots/getAllSlots', {
      headers: headers,
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()
      const convertedEvents = convertDataToEvents(data)
      setEvents(convertedEvents)
      setSlots(data)
      setIsLoading(false)
    } else {
      const errorResponse = await response.json()
      console.log(errorResponse.message)
    }
  }, [])

  const renderEventContent = (eventInfo: EventApi): React.ReactNode => {
    return (
      <Box
        data-tooltip-id={eventInfo.id}
        data-tooltip-content={eventInfo.title}
        style={{ display: 'flex', alignItems: 'center' }}
        className="fc-event-title"
      >
        <RoundIcon onClick={(e) => onHandleDeleteSlot(e, eventInfo)} additionalCss={'scale-75'} icon={<TrashIcon />} />
        {eventInfo.event.title}
      </Box>
    )
  }

  const hideModal = () => {
    setShowModal(false)
  }

  const hideDeleteModal = () => {
    setShowDeleteModal(false)
    fetchSlots()  // Refresh the slots after successful deletion
  }

  const eventMouseEnter = (ev: EventMouseEnterArg) => {
    setEvent(ev.event)
    setTooltipContent(ev.event.title)
    setTooltipPosition({ x: ev.jsEvent.clientX, y: ev.jsEvent.clientY })
    setTooltipVisible(true)
  }

  const eventMouseLeave = (ev: EventMouseLeaveArg) => {
    setTooltipVisible(false)
    setTooltipPosition({ x: 0, y: 0 })
  }

  const onHandleDeleteSlot = (event: React.MouseEvent<HTMLButtonElement>, eventInfo: EventApi) => {
    event.preventDefault()
    event.stopPropagation()
    const clickedSlot = slots.find(slot => slot.id === eventInfo.event.id)
    if (clickedSlot) {
      setSlot(clickedSlot)
      setShowDeleteModal(true)
    }
  }

  useEffect(() => {
    fetchSlots().catch(console.error)
  }, [fetchSlots])

  return (
    <Box className="bg-white p-6 mt-7 md:mt-10">
      {showModal && <EditBookedSlotsModal data={slot} onClose={hideModal} isOnlyRead={true} />}
      {showDeleteModal && <DeleteSlotModal data={slot} isBookedSlot={true} onClose={hideDeleteModal} />}

      <Box className="calendar-wrp">
        {!isLoading ? (
          <>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              editable={true}
              events={events}
              locales={allLocales}
              locale="en-US"
              eventMouseEnter={eventMouseEnter}
              eventMouseLeave={eventMouseLeave}
              eventClick={handleEventClick}
              displayEventTime={false}
              eventContent={renderEventContent}
            />
            {tooltipVisible && <ReactTooltip
              id={event?.id}
              content={tooltipContent}
              isOpen={tooltipVisible}
              positionStrategy="fixed"
              opacity="1"
              delayShow={1000}
              delayHide={10}
              style={{ zIndex: '999', backgroundColor: 'bg-gray-900' }}
              position={{ y: tooltipPosition.y, x: tooltipPosition.x }}
            />}
          </>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            editable={true}
            events={[]}
            locales={allLocales}
            locale="en-US"
          />
        )}
      </Box>
    </Box>
  )
}

export default AdminBookedSlots
