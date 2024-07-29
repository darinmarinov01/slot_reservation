import { firebaseAuth } from '@/firebase/firebase-config'
import {
	type User,
	signInWithPopup,
	onAuthStateChanged as _onAuthStateChanged,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	UserCredential,
} from 'firebase/auth'
import { RoleEnum } from '@/common/types/form-types'
import { useAuthStore, useUserStore, useFavorities, useErrorStore } from '@store'
import { setCookie } from "@/common/utils"
import { User as userType, LoginProviderType } from '@/common/types/user-types'
import { getFirebaseErrorMessage } from '@/common/types/firebase-errors'
import { headers } from '@/common/constants'

type UseAuth = {
	onAuthStateChanged: (callback: (authUser: User | null) => void) => void,
	signInWithGoogle: () => Promise<void>,
	signUpWithGoogle: () => Promise<void>,
	signUp: (email: string, password: string, name: string) => Promise<void>,
	logIn: (email: string, password: string) => Promise<void>,
	logOut: () => Promise<void>,
	triggerResetEmail: (email: string) => Promise<void>,
}

const getAdditionalUserData = (defaultData: { name: string, email: string, password: string }) => {
	return {
		...defaultData,
		isDeleted: false,
		role: RoleEnum.NORMAL,
		favoriteSlots: [],
		dateCreated: new Date(Date.now())
	}
}

const handleCreateUser = async (data: userType, token: string) => {
	try {
		const response = await fetch('/api/user/createUser', {
			body: JSON.stringify({ ...data }),
			headers: headers,
			method: 'POST',
		})

		if(!response.ok) {
			setCookie("authToken", null)
			setCookie("userToken", null)
			const data = getFirebaseErrorMessage('Internal Server Error', null)
			useErrorStore.setState({ error: data.message })
	
			await fetch('/api/errors/createError', {
				body: JSON.stringify({ ...data }),
				headers: headers,
				method: 'POST',
			})
		}

		if (response.ok) {
			const user = await response.json()
			handleLogInUser(user, token)
		} else {
			const errorResponse = await response.json()
			console.log(errorResponse.message)
		}
	} catch (error) {
		const data = getFirebaseErrorMessage('An unexpected error occurred in handleLogInUser' + error, data?.email)
		useErrorStore.setState({ error: data.message })

		await fetch('/api/errors/createError', {
			body: JSON.stringify({ ...data }),
			headers: headers,
			method: 'POST',
		})
		console.log('An unexpected error occurred in handleCreateUser => ', error)
	}
}

const handleLogInUser = async (user: userType, token: string) => {
	try {
		await fetch('/api/user/getUser', {
			body: JSON.stringify({ email: user.email, }),
			headers: headers,
			method: 'Post',
		}).then(async response => {
			if(!response.ok) {
				setCookie("authToken", null)
				setCookie("userToken", null)
				const data = getFirebaseErrorMessage('Internal Server Error', null)
				useErrorStore.setState({ error: data.message })
		
				await fetch('/api/errors/createError', {
					body: JSON.stringify({ ...data }),
					headers: headers,
					method: 'POST',
				})
			}

			const loggedUser = await response.json()

			if (loggedUser && response.ok) {
				const userTokenInfo = { role: loggedUser.role, email: loggedUser.email, name: loggedUser.name }
				setCookie("userToken", btoa(JSON.stringify(userTokenInfo)), { expires: 7 }) // Cookie expires in 7 days
				useAuthStore.setState({ authToken: token })
				useUserStore.setState({ user: loggedUser })
				useFavorities.setState({ favoriteSlots: loggedUser.favoriteSlots })
			}
		}).catch(async error => {
			console.log('error in handleLogInUser', error)
		})
	} catch (error) {
		const data = getFirebaseErrorMessage('An unexpected error occurred in handleLogInUser' + error, user.email)
		useErrorStore.setState({ error: data.message })

		await fetch('/api/errors/createError', {
			body: JSON.stringify({ ...data }),
			headers: headers,
			method: 'POST',
		})
		console.log('An unexpected error occurred in handleLogInUser => ', error)
	}
}

const useAuth = (): UseAuth => {
	const onAuthStateChanged = (callback: (authUser: User | null) => void) => _onAuthStateChanged(firebaseAuth, callback)

	const signInWithGoogle = async () => {
		const provider = new GoogleAuthProvider()

		await signInWithPopup(firebaseAuth, provider)
			.then(async (result: UserCredential) => {
				if (!result.user || !result.user.email) {
					throw new Error('Google Sign IN failed')
				}
				const token = result?.user?.accessToken

				// Set the cookie with the token
				setCookie("authToken", token, { expires: 7 }) // Cookie expires in 7 days
				const user = getAdditionalUserData({ email: result.user.email, name: result.user.displayName || '', password: '' })
				handleLogInUser(user, token)
			})
			.catch(async (error) => {
				var errorCode = error.code
				const data = getFirebaseErrorMessage(errorCode, null)
				useErrorStore.setState({ error: data.message })

				await fetch('/api/errors/createError', {
					body: JSON.stringify({ ...data }),
					headers: headers,
					method: 'POST',
				})
			})
	}

	const signUpWithGoogle = async () => {
		const provider = new GoogleAuthProvider()

		await signInWithPopup(firebaseAuth, provider)
			.then(async (result: UserCredential) => {
				if (!result.user || !result.user.email) {
					throw new Error('Google Sign UP failed')
				}
				const token = result?.user?.accessToken

				// Set the cookie with the token
				setCookie("authToken", token, { expires: 7 }) // Cookie expires in 7 days
				const newUser = getAdditionalUserData({ email: result.user.email, name: result.user.displayName || '', password: '' })
				const providerIdName = result.providerId == 'google.com' ? LoginProviderType.GOOLGE_LOGIN : LoginProviderType.PASSWORD_LOGIN
				handleCreateUser({ ...newUser, provider: providerIdName }, token)
			})
			.catch(async (error) => {
				var errorCode = error.code
				const data = getFirebaseErrorMessage(errorCode, null)
				useErrorStore.setState({ error: data.message })

				await fetch('/api/errors/createError', {
					body: JSON.stringify({ ...data }),
					headers: headers,
					method: 'POST',
				})
			})
	}

	const signUp = async (email: string, password: string, name: string) =>
		createUserWithEmailAndPassword(firebaseAuth, email, password)
			.then(async (result: UserCredential) => {
				const token = result?.user?.accessToken

				// Set the cookie with the token
				setCookie("authToken", token, { expires: 7 }) // Cookie expires in 7 days
				const newUser = getAdditionalUserData({ email: email, name: name, password: password })
				handleCreateUser(newUser, token)
			})
			.catch(async (error) => {
				var errorCode = error.code
				const data = getFirebaseErrorMessage(errorCode, email)
				useErrorStore.setState({ error: data.message })

				await fetch('/api/errors/createError', {
					body: JSON.stringify({ ...data }),
					headers: headers,
					method: 'POST',
				})
			})

	const logIn = async (email: string, password: string) => {
		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then(async (result: UserCredential) => {
				console.log('User credential', result.user)
				const token = result?.user?.accessToken
				// Set the cookie with the token
				setCookie("authToken", token, { expires: 7 }) // Cookie expires in 7 days
				try { // TODO: use login method instead
					console.log('thanks!', result)

					await fetch('/api/user/getUser', {
						body: JSON.stringify({ email }),
						headers: headers,
						method: 'Post',
					}).then(async res => {
						const loggedUser = await res.json()
						if (loggedUser) {
							const userTokenInfo = { role: loggedUser.role, email: loggedUser.email, name: loggedUser.name }
							setCookie("userToken", btoa(JSON.stringify(userTokenInfo)), { expires: 7 }) // Cookie expires in 7 days
							useAuthStore.setState({ authToken: token })
							useUserStore.setState({ user: loggedUser })
							useFavorities.setState({ favoriteSlots: loggedUser.favoriteSlots })
						}
					})
				} catch (err) {
					console.log(err)
				}
			}).catch(async error => {
				var errorCode = error.code
				var errorMessage = error.message
				const data = getFirebaseErrorMessage(errorCode, email)
				useErrorStore.setState({ error: data.message })

				await fetch('/api/errors/createError', {
					body: JSON.stringify({ ...data }),
					headers: headers,
					method: 'POST',
				})

				if (errorCode === 'auth/invalid-credential') {
					// Handle invalid credential error
					console.error("Invalid credential: ", errorMessage)
				} else {
					// Handle other errors
					console.error(errorCode, errorMessage)
				}
			})
	}

	const logOut = async () => {
		await signOut(firebaseAuth)
			.then(() => {
				setCookie("authToken", null)
				setCookie("userToken", null)
				useAuthStore.setState({ authToken: null })
				useUserStore.setState({ user: null })
				useFavorities.setState({ favoriteSlots: [] })
			})
	}

	const triggerResetEmail = async (email: string) => {
		await sendPasswordResetEmail(firebaseAuth, email)
		console.log("Password reset email sent")
	}

	return {
		onAuthStateChanged,
		signInWithGoogle,
		signUpWithGoogle,
		signUp,
		logIn,
		logOut,
		triggerResetEmail
	}
}

export default useAuth