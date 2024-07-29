import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { SlotProgress, BookedSlots, SlotProgressColor } from '../types/slots-types'
import { EventInput } from '../types/slots-types'
import dayjs, { Dayjs } from 'dayjs'
import { Timestamp } from 'firebase/firestore'

type UnavailablePeriods = {
  unavailableDateStart: Date,
  unavailableDateEnd: Date,
}

export function isNotAvailable(startDate: Date, endDate: Date, unavailablePeriods: UnavailablePeriods[]) {
  if (!unavailablePeriods || unavailablePeriods.length == 0) {
    return false
  }

  let isNotAvailable = false
  unavailablePeriods.forEach((period: any) => {
    const min = period.unavailableDateStart.toDate()
    const max = period.unavailableDateEnd.toDate()

    if (startDate <= min && min <= endDate) return isNotAvailable = true
    if (startDate <= max && max <= endDate) return isNotAvailable = true
    if (min < startDate && endDate < max) return isNotAvailable = true
  })

  return isNotAvailable
}

export function slotStatus(startDate: Dayjs, endDate: Dayjs, currentDate: Dayjs) {

  if (currentDate < startDate) {
    return SlotProgress.NOT_STARTED
  }
  if (currentDate >= startDate && currentDate <= endDate) {
    return SlotProgress.IN_PROGRESS
  }
  if (currentDate > endDate) {
    return SlotProgress.COMPLETED
  }

  return undefined
}

export function getDocData(doc: any) {
  if (!doc.exists) return null

  return {
    id: doc.id,
    ...doc.data(),
  }
}

export const setCookie = (name: string, value, options = {}) => {
  Cookies.set(name, value, options)
}

export const getCookie = (name: string) => {
  return Cookies.get(name)
}

export const removeCookie = (name: string) => {
  Cookies.remove(name)
}

export const decodeAccessToken = (accessToken: string) => jwtDecode(accessToken)

// Helper date format methods
const dateFormatter = (locale: string) => {
  const localeState = locale ? locale : 'fr-ca'
  return new Intl.DateTimeFormat(
    localeState,
    { year: 'numeric', month: '2-digit', day: '2-digit' }
  )
}

const timeFormatter = (hourCycleMode: any) => {
  return new Intl.DateTimeFormat(
    'en-gb',
    { hour: '2-digit', minute: '2-digit', hourCycle: hourCycleMode }
  )
}

const dateTimeFormatter = (locale: string) => {
  const localeState = locale ? locale : 'fr-ca'
  return new Intl.DateTimeFormat(
    localeState,
    { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
  )
}

// Convert from date to string format
export const dateFilter = (date: Date, locale: string) => {
  return dateFormatter(locale).format(date)
}

export const timeFilter = (date: Date) => {
  return timeFormatter('h23').format(date)
}

export const dateTimeFilter = (date: Date, locale: string) => {
  return dateTimeFormatter(locale).format(date)
}

const convertTimestampToISOString = (date: string): string => {
  return date.replace(/\.000Z$/, '')
}

// Convert bookedSlots to event data for fullevent calendar
export const convertDataToEvents = (data: BookedSlots[]): any[] => {
  return data.map((item) => {
      const title = `(${timeFilter(new Date(item.startDate))} - ${timeFilter(new Date(item.endDate))}) - ${item.slot?.location} => ${item.user?.name}`

      return {
          id: item.id,
          start: convertTimestampToISOString(item.startDate),
          end: convertTimestampToISOString(item.endDate),
          title: title,
          slot: item.slot,
          user: item.user,
      }
  })
}

// Convert slots dates to dayjs dates
export const convertDates = (data: BookedSlots[]): any[] => {
  return data.map((item) => {
      return {
          ...item,
          startDate: dayjs(data.startDate),
          endDate: dayjs(data.endDate)
      }
  })
}

export const calculateProgress = (event: BookedSlots): number => {
  const startDate = event.startDate
  const endDate = event.endDate
  const currentDate = new Date()

  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsedTime = Math.max(currentDate.getTime() - startDate.getTime(), 0)

  return totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0
}