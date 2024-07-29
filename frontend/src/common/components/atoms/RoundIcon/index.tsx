'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Props = {
    icon?: React.ReactNode
    label?: string,
    additionalCss?: string,
    width?: string,
    height?: string,
    iconFillColor?: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const RoundIcon = ({
    icon,
    label = '',
    additionalCss = '',
    width = '30px',
    height = '30px',
    iconFillColor = '',
    onClick = () => { }
}: Props) => {

    const hoverIconColor = (color: string) => {
        if (color == 'red') {
            return 'gray'
        } else {
            return 'red'
        }
    }

    return <>
        <Box onClick={(e: React.MouseEvent) => onClick(e)} className={`flex flex-col items-center ${additionalCss}`}>
            <Box className={`rounded-full flex items-center justify-center`}>
                <Box sx={{
                    "& svg": {
                        fill: `${iconFillColor}`,
                        width: `${width}`,
                        height: `${height}`,
                    },
                    "& svg:hover": {
                        fill: `${hoverIconColor(iconFillColor)}`,
                    },
                }}
                    className={`flex items-center justify-center`} >
                    {icon && icon}
                </Box>
            </Box>
            {label != '' && <Typography variant='body2'>{label}</Typography>}
        </Box>
    </>
}

export default RoundIcon