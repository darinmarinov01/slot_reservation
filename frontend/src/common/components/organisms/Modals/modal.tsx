//@ts-nocheck
// Next imports
import { useSearchParams, usePathname } from "next/navigation"
// Internal imports
import { ModalTypes } from "@/common/types/modal-types"
//External imports
import ReactDOM from "react-dom"
import Box from '@mui/material/Box'

    type BackdropProps = {
        onClose?: () => void,
        background?: string
    }

    const ModalBackdrop: React.FC<BackdropProps> = ({
        onClose,
    }) => {
        return <Box
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-20 bg-opacity-75 bg-black flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full h-full"
            onClick={onClose}>
        </Box>
    }

    type ContentProps = {
        header?: string,
        children?: React.ReactNode
        onCancel?: () => void,
        onScroll?: () => void,
        onConfirm?: () => void,
        additional?: string
    }

    const ModalContent: React.FC<ContentProps> = ({
        onScroll,
        children,
    }) => {
        return (<Box className="fixed top-24 m-auto left-0 right-0 z-50 p-4 w-full max-w-2xl max-h-full">
            <Box className="relative bg-white rounded-lg shadow dark:bg-gray-800" onScroll={onScroll}>
                {children}
            </Box>
        </Box>)
    }


const Modal:React.FC<ModalTypes> = ({
    children,
    onScroll,
    onClose,
    onConfirm,
}) => {
    const searchParams = useSearchParams()
    const modal = searchParams?.get('modal')
    const pathname = usePathname() || ''

    return (<>
      {true && ReactDOM.createPortal(<ModalBackdrop onClose={onClose} />, document.getElementById('modal-backdrop'))}
      {true && ReactDOM.createPortal(<ModalContent onConfirm={onConfirm} onScroll={onScroll}>{children}</ModalContent>, document.getElementById('modal-content'))}
    </>)
}

export default Modal