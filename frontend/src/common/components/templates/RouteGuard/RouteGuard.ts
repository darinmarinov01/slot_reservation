//@ts-nocheck
// React and next imports
import { ReactNode, useCallback, useEffect, useState } from "react"
// Internal imports
import { getCookie } from '@/common/utils'
import { useUserStore, useFavorities } from '@store'
import { headers } from '@/common/constants'
// External imports
import { JwtPayload, jwtDecode } from "jwt-decode"

export { RouteGuard }

interface UserClaims extends JwtPayload {
    user_id?: string
}

interface RouteGuardProps {
    children: ReactNode
}

const RouteGuard = ({ children }: RouteGuardProps) => {
    const [claims, setClaims] = useState(null)

    const fetchUser = useCallback(async (claim: UserClaims) => {
        if (claim?.user_id) {
            try {
                await fetch('/api/user/getUser', {
                    body: JSON.stringify(claim),
                    headers: headers,
                    method: 'Post',
                }).then(async res => {
                    const result = await res.json()
                    if (result) {
                        useUserStore.setState({ user: result })
                        useFavorities.setState({ favoriteSlots: result.favoriteSlots })
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }, [])

    const clearErrorsFromFirebase = useCallback(async () => { // clear errors from firebase in database // TODO: this can be cron job from functions
        try {
            await fetch('/api/errors/deleteErrors', {
                headers: headers,
                method: 'DELETE',
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        const token = getCookie('authToken')
        if (token && token !== 'null') {
            const decodedToken = jwtDecode(token)
            setClaims(decodedToken)
            clearErrorsFromFirebase().catch(console.error)
        }
    }, [])

    useEffect(() => {
        fetchUser(claims).catch(console.error)
    }, [claims, fetchUser])

    return children
}