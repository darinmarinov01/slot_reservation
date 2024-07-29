'use client'

// Internal imports
import { useEffect } from 'react'
import { RoundIcon } from "@atoms"

// External imports
import { InformationCircleIcon, CheckCircleIcon, HandThumbDownIcon, HandRaisedIcon } from '@heroicons/react/24/solid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type NotificationProps = {
    title: string
    message: string
    show: boolean
    setShow: (show: boolean) => void
    variant: 'success' | 'error' | 'info' | 'warning'
}

const Notification = ({ title, message, show, setShow, variant }: NotificationProps) => {

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setShow(false)
            }, 5000) // Auto-hide after 5 seconds

            return () => clearTimeout(timer)
        }
    }, [show, setShow])

    if (!show) return null

    const variantStyles = {
        success: 'bg-teal-100 border-t-4 border-teal-500 text-teal-900',
        error: 'bg-red-100 border-t-4 border-red-500 text-red-700',
        info: 'bg-blue-100 border-t-4 border-blue-500 text-blue-700',
        warning: 'bg-yellow-100 border-t-4 border-yellow-500 text-yellow-700'
    }

    const variantIcons = {
        success: (
            <RoundIcon additionalCss={'scale-75'} icon={<CheckCircleIcon />} />
        ),
        error: (
            <RoundIcon additionalCss={'scale-75'} icon={<HandThumbDownIcon />} />
        ),
        info: (
           <RoundIcon additionalCss={'scale-75'} icon={<InformationCircleIcon />} />
        ),
        warning: (
            <RoundIcon additionalCss={'scale-75'} icon={<HandRaisedIcon />} />
        )
    }

    return (
        <Box className={`z-50 fixed bottom-0 left-0 right-0 rounded-b px-4 py-3 shadow-md ${variantStyles[variant]}`} role="alert">
            <Box className="flex items-center justify-center">
                <Box className="py-1">
                    {variantIcons[variant]}
                </Box>
                <Box>
                    <Typography className='text-white text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2">{title}</Typography>
                    <Typography variant='h2' className="text-xl pb-3">{message}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Notification
