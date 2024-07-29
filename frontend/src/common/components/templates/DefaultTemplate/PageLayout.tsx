import { Navbar, Footer } from '@organisms'
import { RouteGuard } from '../RouteGuard/RouteGuard'
import Box from '@mui/material/Box'
import { ReactNode } from 'react'

interface PageLayout {
    children: ReactNode
}

// TODO: find proper type of children
const PageLayout = ({ children }: PageLayout) => {
    return (
        <RouteGuard>
            <Navbar />
            <main className='min-h-[79vh] md:min-h-[75vh]'>
            {children}
            </main>
            <Box id="modal-backdrop" />
            <Box id="modal-content" />
            <Footer/>
        </RouteGuard>
    )
}

export default PageLayout