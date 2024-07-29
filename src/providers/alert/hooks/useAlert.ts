import { useContext } from 'react'
import AlertContext from '../alert'

const useAlert = () => useContext(AlertContext)

export default useAlert