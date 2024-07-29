import { Notification } from '@organisms'
import useAlert from './hooks/useAlert'

const AlertPopup = () => {
  const { title, text, type, show, setShow } = useAlert()
  return (
    <Notification
      title={title}
      message={text}
      show={show}
      setShow={setShow}
      variant={type}
    />
    
  )
}

export default AlertPopup