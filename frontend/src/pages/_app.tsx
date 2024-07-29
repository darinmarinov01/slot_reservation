import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { PageLayout } from '@templates'
import { AlertPopup, AlertProvider } from '@/providers/alert'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <AlertProvider>
        <>
          <AlertPopup />
          <Component {...pageProps} />
        </>
      </AlertProvider>
    </PageLayout>
  )
}
