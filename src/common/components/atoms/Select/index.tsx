'use client'

import {FC} from 'react'
import Select, {SelectProps} from '@mui/material/Select'

const MuiSelectField: FC<SelectProps> = (props) => {
 return (
  <Select {...props} />
 )
}

export default MuiSelectField