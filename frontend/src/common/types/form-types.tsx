import { SlotProperties } from './slots-types'

export enum LoginEnum {
	GOOGLE = 'Google',
	APPLE = 'Apple',
	NORMAL = 'Normal',
}

export enum RoleEnum {
	ADMIN = 'Admin',
	NORMAL = 'Normal',
}

export interface LoginType {
	email: string
	password: string
}

export interface RegistrationType extends LoginType {
	name: string
	loginType: LoginEnum,
	role: RoleEnum,
	isDeleted: boolean,
	dateCreated: Date,
	favoriteSlots: SlotProperties[]
}