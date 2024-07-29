import { RoleEnum } from './form-types'
import { SlotProperties } from './slots-types'

export enum LoginProviderType {
    GOOLGE_LOGIN = 'GOOLGE_LOGIN',
    PASSWORD_LOGIN = 'PASSWORD_LOGIN',
}

export type User = {
    id?: string,
    email: string,
    name: string,
    password: string,
    photoUrl: string,
    isDeleted: boolean,
    role: RoleEnum,
    favoriteSlots: SlotProperties[],
    dateCreated: Date,
    accessToken?: string,
    provider?: LoginProviderType,
}

export type AuthUser = {
    user: User | null
    setUser: (user: User | null) => void 
}
