// React imports
import { useCallback, useEffect, useState } from "react"
import { TrashIcon } from '@heroicons/react/24/solid'
import { Typography } from "@mui/material"

// Internal imports
import { User } from "@/common/types/user-types"
import { DeleteUserModal } from "@organisms"
import { RoundIcon } from "@atoms"
import { dateTimeFilter } from '@/common/utils'
import { useUserStore } from "@/common/store"
import { EmptyMessages } from "@/common/types/empty-messages"
import { headers } from '@/common/constants'

// External imports
import Box from '@mui/material/Box'

function Users() {
    const loggedInUser = useUserStore((state) => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [sortConfig, setSortConfig] = useState<{ key: keyof User, direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' })

    const fetchUsers = useCallback(async () => {
        const response = await fetch('/api/user/getUsers', {
            headers: headers,
            method: 'GET',
        })

        if (response.ok) {
            const data = await response.json()
            if (loggedInUser) {
                const filteredUsers = data?.filter((user: User) => user.id !== (loggedInUser as User)?.id)
                setUsers(filteredUsers)
                sortUsers('name', 'asc', filteredUsers)
            }
        } else {
            const errorResponse = await response.json()
            console.log(errorResponse.message)
        }
    }, [loggedInUser, showDeleteModal])

    const onHandleDeleteUser = async (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
        event.preventDefault()
        event.stopPropagation()
        setShowDeleteModal(true)
        setUser(user)
    }

    const handleDeleteUserConfirm = async () => {
        hideDeleteModal()
    }

    const hideDeleteModal = () => {
        setShowDeleteModal(false)
    }

    const sortUsers = (key: keyof User, direction: 'asc' | 'desc', userList: User[] = users) => {
        setSortConfig({ key, direction })
        const sortedUsers = [...userList].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        })
        setUsers(sortedUsers)
    }

    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        sortUsers(key, direction)
    }

    const renderSortArrow = (key: keyof User) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '↑' : '↓'
        }
        return ''
    }
    
    useEffect(() => {
        fetchUsers().catch(console.error)
    }, [fetchUsers])

    return (
        <Box className="relative overflow-x-auto shadow-md sm:rounded-lg mt-7 md:mt-10">
            {showDeleteModal && <DeleteUserModal data={user} onClose={hideDeleteModal} onConfirm={handleDeleteUserConfirm} />}

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <Box className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                                User Name {renderSortArrow('name')}
                            </Box>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <Box className="flex items-center cursor-pointer" onClick={() => handleSort('email')}>
                                User Email {renderSortArrow('email')}
                            </Box>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <Box className="flex items-center cursor-pointer" onClick={() => handleSort('dateCreated')}>
                                Date Created {renderSortArrow('dateCreated')}
                            </Box>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loggedInUser && users?.map((user: User) => (
                        (!user.isDeleted && <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user.name}
                            </th>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            <td className="px-6 py-4">
                                {dateTimeFilter(new Date(user?.dateCreated), 'ca')}
                            </td>
                            <td className="px-6 py-4 flex justify-end">
                                <RoundIcon onClick={(e) => onHandleDeleteUser(e, user)} additionalCss="cursor-pointer" icon={<TrashIcon />} />
                            </td>
                        </tr>)
                    ))}
                </tbody>
            </table>
            {loggedInUser && users?.length === 0 && <Box className="mt-10 w-full min-h-14 flex justify-center items-center"><Typography className='text-gray-400 text-xl md:text-4xl ml-0 mr-2 mt-3 mb-3 font-bold' variant="h2"> {EmptyMessages.NO_SLOTS} </Typography></Box>}
        </Box>
    )
}

export default Users
