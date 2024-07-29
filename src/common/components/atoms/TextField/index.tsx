'use client'

import {FC} from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

const MuiTextField: FC<TextFieldProps> = (props) => {
 return (
  <TextField {...props} />
 )
}

export default MuiTextField