import { User } from "./user-types"

export interface FirebaseError {
    code: string
    message: string
}

export interface FirebaseErrorMessage extends FirebaseError {
    user: string | null,
    dateCreated: Date
}

export interface FirebaseErrorMessageWithId extends FirebaseErrorMessage {
    id: string
}

export const firebaseErrors: Record<string, FirebaseError> = {
    // Authentication Errors
    "auth/app-deleted": {
        code: "auth/app-deleted",
        message: "The Firebase app was deleted."
    },
    "auth/too-many-requests": {
        code: "auth/too-many-requests",
        message: "Access to this account has been temporarily disabled due to many failed login attempts."
    },
    "auth/invalid-credential": {
        code: "auth/invalid-credential",
        message: "Invalid credential."
    },
    "auth/app-not-authorized": {
        code: "auth/app-not-authorized",
        message: "This app is not authorized to use Firebase Authentication."
    },
    "auth/argument-error": {
        code: "auth/argument-error",
        message: "An invalid argument was provided."
    },
    "auth/invalid-api-key": {
        code: "auth/invalid-api-key",
        message: "Your API key is invalid, please check you have copied it correctly."
    },
    "auth/invalid-user-token": {
        code: "auth/invalid-user-token",
        message: "The user's credential is no longer valid. The user must sign in again."
    },
    "auth/network-request-failed": {
        code: "auth/network-request-failed",
        message: "A network error (such as timeout, interrupted connection or unreachable host) has occurred."
    },
    "auth/user-disabled": {
        code: "auth/user-disabled",
        message: "The user account has been disabled by an administrator."
    },
    "auth/user-not-found": {
        code: "auth/user-not-found",
        message: "There is no user record corresponding to this identifier. The user may have been deleted."
    },
    "auth/wrong-password": {
        code: "auth/wrong-password",
        message: "The password is invalid or the user does not have a password."
    },
    // Firestore Errors
    "firestore/cancelled": {
        code: "firestore/cancelled",
        message: "The operation was cancelled."
    },
    "firestore/unknown": {
        code: "firestore/unknown",
        message: "Unknown error or an error from a different domain."
    },
    "firestore/invalid-argument": {
        code: "firestore/invalid-argument",
        message: "Client specified an invalid argument."
    },
    "firestore/deadline-exceeded": {
        code: "firestore/deadline-exceeded",
        message: "Deadline expired before operation could complete."
    },
    "firestore/not-found": {
        code: "firestore/not-found",
        message: "Some requested document was not found."
    },
    "firestore/already-exists": {
        code: "firestore/already-exists",
        message: "Some document that we attempted to create already exists."
    },
    "firestore/permission-denied": {
        code: "firestore/permission-denied",
        message: "The caller does not have permission to execute the specified operation."
    },
    "firestore/resource-exhausted": {
        code: "firestore/resource-exhausted",
        message: "Some resource has been exhausted, perhaps a per-user quota, or perhaps the entire file system is out of space."
    },
    "firestore/failed-precondition": {
        code: "firestore/failed-precondition",
        message: "Operation was rejected because the system is not in a state required for the operation's execution."
    },
    "firestore/unimplemented": {
        code: "firestore/unimplemented",
        message: "Operation is not implemented or not supported/enabled."
    },
    "firestore/internal": {
        code: "firestore/internal",
        message: "Internal errors. Means some invariants expected by underlying system has been broken. If you see one of these errors, something is very broken."
    },
    "firestore/unavailable": {
        code: "firestore/unavailable",
        message: "The service is currently unavailable. This is most likely a transient condition and may be corrected by retrying with a backoff."
    },
    "firestore/data-loss": {
        code: "firestore/data-loss",
        message: "Unrecoverable data loss or corruption."
    },
    "firestore/unauthenticated": {
        code: "firestore/unauthenticated",
        message: "The request does not have valid authentication credentials for the operation."
    },
    // Add more Firebase service error codes and messages as needed
}

export function getFirebaseErrorMessage(code: string, user: string | null): FirebaseErrorMessage {
    return {
        code: firebaseErrors[code]?.code || "000",
        message: firebaseErrors[code]?.message || code,
        user: user,
        dateCreated: new Date(Date.now())
    }
}

