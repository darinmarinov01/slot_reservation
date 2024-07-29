'use client'

// React imports
import { useState, useEffect, useCallback, useMemo } from 'react'

// External imports
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import Box from '@mui/material/Box'

type Props = {
  dates: { startDate: Date, endDate: Date } 
  onChangeStartDate: (val: Dayjs) => void
  onChangeEndDate: (val: Dayjs) => void
  notAvailable: boolean,
  isNewSlot: boolean,
  isOnlyPreiview: boolean
}

const today = dayjs()

const DateTimeRangePicker = ({ dates, onChangeStartDate, onChangeEndDate, notAvailable, isNewSlot = false, isOnlyPreiview = false }: Props) => {
  const [dateFrom, setDateFrom] = useState<Dayjs>(isNewSlot ? dayjs(dates.startDate).add(60, 'minutes') : dayjs(dates.startDate))
  const [dateTo, setDateTo] = useState<Dayjs>(isNewSlot ? dayjs(dates.endDate).add(3, 'hours') : dayjs(dates.endDate))
  const [disableTimes, setDisableTimes] = useState({
    startDate: false,
    endDate: false,
    past: true,
  })
  const [minutesStep, setMinutesStep] = useState(15)

  const shouldDisableTime = useCallback((time: Dayjs, clockType: string, isStart: boolean) => {
    if (clockType === 'minutes') {
      return (isStart ? dateFrom.isBefore(today) : dateTo.isBefore(today)) || notAvailable
    }
    return false
  }, [dateFrom, dateTo, notAvailable])

  const shouldDisableDay = useCallback((day: Dayjs) => day.day() === 0 || day.day() === 6, [])

  const handleDateFromChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setDateFrom(newValue)
      if (newValue.isAfter(dateTo)) setDateTo(newValue)
      onChangeStartDate(newValue)
    }
  }

  const handleDateToChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isAfter(dateFrom)) {
      setDateTo(newValue)
      onChangeEndDate(newValue)
    }
  }

  useEffect(() => {
    setDisableTimes({
      startDate: dateFrom.isBefore(today),
      endDate: today.isAfter(dateTo),
      past: today.isAfter(dateFrom) && today.isAfter(dateTo),
    })
    setMinutesStep(dateFrom.isSame(dateTo, 'day') && dateFrom.isSame(dateTo, 'hour') ? 45 : 15)
  }, [dateFrom, dateTo])

  const dateTimePickerStyles = useMemo(() => ({
    "& .MuiInputBase-root": {
      color: "#fff",
      width: "100%",
    },
    "& .MuiFormLabel-root": {
      color: "#fff",
    },
    "& .MuiSvgIcon-root": {
      fill: "#fff",
    },
  }), [])

  return (
    <Box className="flex text-white gap-10 mt-5">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          disabled={isOnlyPreiview}
          className={`bg-gray-50 border text-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${disableTimes.startDate ? 'pointer-events-none opacity-50' : ''}`}
          label="Start date and time"
          value={dateFrom}
          minDate={dateFrom}
          maxDate={dateTo.add(1, 'days')}
          shouldDisableDate={shouldDisableDay}
          shouldDisableTime={(time, clockType) => shouldDisableTime(time, clockType, true)}
          disablePast={disableTimes.startDate}
          timeSteps={{ minutes: 15 }}
          ampm={false}
          onChange={handleDateFromChange}
          sx={dateTimePickerStyles}
        />
        <DateTimePicker
          disabled={isOnlyPreiview}
          className={`bg-gray-50 border text-white border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${disableTimes.endDate ? 'pointer-events-none opacity-50' : ''}`}
          label="End date and time"
          value={dateTo}
          minDate={dateFrom}
          shouldDisableDate={shouldDisableDay}
          shouldDisableTime={(time, clockType) => shouldDisableTime(time, clockType, false)}
          disablePast={!disableTimes.past}
          closeOnSelect={false}
          timeSteps={{ minutes: minutesStep }}
          ampm={false}
          onChange={handleDateToChange}
          sx={dateTimePickerStyles}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default DateTimeRangePicker
