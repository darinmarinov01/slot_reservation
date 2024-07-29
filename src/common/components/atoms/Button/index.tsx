'use client'

import React, {FC} from 'react'
import Button from '@mui/material/Button'
import { ButtonProps } from '@mui/material/Button'

const MuiButton: FC<ButtonProps> = (props) => {
  return (
    <Button 
     {...props}
    >
     {props.children}
    </Button>
  )
}

export default MuiButton