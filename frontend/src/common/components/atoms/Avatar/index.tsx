'use client'

import {FC} from 'react'
import Avatar, {AvatarProps} from '@mui/material/Avatar'

export const MuiAvatar: FC<AvatarProps> = (props) => {
  return (
   <Avatar
   {...props}
 />
  )
}

export default MuiAvatar
