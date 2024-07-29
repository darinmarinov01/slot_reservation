'use client'

// External imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from 'next/link'
// Internal imports
import { RoundIcon } from "@atoms"

type Tabs = {
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>;
}

type Props = {
  tabs: Tabs[],
  onTabChange: (index: number) => void
  activeTab?: number
}

const TabNav = ({ tabs, onTabChange, activeTab = 0 }: Props) => {

  const isActive = (index: number) => {
    if (index == activeTab) {
      return true
    }
    return false
  }

  return (
    <Box className="border-b border-gray-200 dark:border-gray-700">
      <List className="flex -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 p-1">
        {tabs.map((tab, index) =>
          <ListItem key={index} className={`mr-2 p-1 ${isActive(index) ? 'border-b-2 border-white' : 'border-b-1 border-b-ivory-3'}`}>
            <Link onClick={() => onTabChange(index)} href="#" className={`inline-flex items-center justify-center p-2 md:p-4 border-b-2 border-transparent rounded-t-lg hover:text-white ${isActive(index) ? 'text-white' : ''} group`}>
              <RoundIcon additionalCss={'mr-2'} icon={<tab.icon />} />
              <Typography className='text-lg md:text-xl'>{tab.name}</Typography>
            </Link>
          </ListItem>
        )}
      </List>
    </Box>

  )
}
export default TabNav