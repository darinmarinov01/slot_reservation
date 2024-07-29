import { createContext, useState, useEffect, ReactNode } from 'react'
import { AlertProps, NotificationTypes } from './alert.types'

const ALERT_TIME = 5000

interface AlertState {
  title: string
  text: string
  show: boolean
  type: NotificationTypes
}

interface AlertContextType extends AlertState {
  setAlert: (title: string, text: string, type: NotificationTypes) => void
  setShow: (show: boolean) => void
}

const initialState: AlertState = {
  title: '',
  text: '',
  show: false,
  type: 'success',
}

const AlertContext = createContext<AlertContextType>({
  ...initialState,
  setAlert: () => {},
  setShow: () => {},
})

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>(initialState)

  useEffect(() => {
    if (alertState.show) {
      const timer = setTimeout(() => setAlertState((prev) => ({ ...prev, show: false })), ALERT_TIME)
      return () => clearTimeout(timer)
    }
  }, [alertState.show])

  const setAlert = (title: string, text: string, type: NotificationTypes) => {
    setAlertState((prev) => ({
      ...prev,
      title,
      text,
      type,
      show: false,
    }))

    setTimeout(() => {
      setAlertState((prev) => ({
        ...prev,
        show: true,
      }))
    }, 300)
  }

  const setShow = (show: boolean) => {
    setAlertState((prev) => ({ ...prev, show }))
  }

  return (
    <AlertContext.Provider
      value={{
        ...alertState,
        setAlert,
        setShow,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContext
