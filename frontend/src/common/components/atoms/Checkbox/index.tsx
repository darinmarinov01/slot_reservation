'use client'

import {FC} from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

const MuiCheckbox: FC<CheckboxProps & {label?: string}> = (props) => {
 return(
  <FormGroup>
      <FormControlLabel control={<Checkbox {...props} />} label={props.label} />
 </FormGroup>
 )
}

export default MuiCheckbox