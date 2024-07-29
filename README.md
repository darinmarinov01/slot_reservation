# Slot Reservation System Documentation

This documentation describes the data schema for a Slot Reservation System implemented using Firebase and Next.js. The system includes four main tables: `users`, `slots`, `errors`, and `bookedSlots`.

## Tables and Their Properties

### 1. Users

The `users` table stores information about the users of the system. Each user has the following properties:

| Field           | Type                     | Description                                                                 |
|-----------------|--------------------------|-----------------------------------------------------------------------------|
| id              | string (optional)        | Unique identifier for the user.                                             |
| email           | string                   | Email address of the user.                                                  |
| name            | string                   | Name of the user.                                                           |
| password        | string                   | Hashed password of the user.                                                |
| photoUrl        | string                   | URL of the user's profile photo.                                            |
| isDeleted       | boolean                  | Flag indicating whether the user is deleted.                                |
| role            | RoleEnum                 | Role of the user in the system (e.g., admin, user).                         |
| favoriteSlots   | SlotProperties[]         | Array of favorite slots for the user.                                       |
| dateCreated     | Date                     | Date when the user was created.                                             |
| accessToken     | string (optional)        | Access token for authentication.                                            |
| provider        | LoginProviderType (optional) | Provider used for login (e.g., Google, Facebook).                         |

### 2. Slots

The `slots` table stores information about the available slots. Each slot has the following properties:

| Field        | Type            | Description                                          |
|--------------|-----------------|------------------------------------------------------|
| id           | string (optional)| Unique identifier for the slot.                     |
| location     | string          | Location of the slot.                                |
| description  | string (optional)| Description of the slot.                            |
| type         | SlotTypesEnum   | Type of the slot (e.g., meeting room, workspace).    |
| dateCreated  | Date (optional) | Date when the slot was created.                      |

### 3. BookedSlots

The `bookedSlots` table stores information about the booked slots. Each booked slot has the following properties:

| Field        | Type            | Description                                                                 |
|--------------|-----------------|-----------------------------------------------------------------------------|
| id           | string (optional)| Unique identifier for the booked slot.                                      |
| startDate    | Date            | Start date and time of the booking.                                          |
| endDate      | Date            | End date and time of the booking.                                            |
| user         | string          | User ID of the person who booked the slot.                                   |
| slot         | string          | Slot ID of the booked slot.                                                  |
| description  | string (optional)| Description of the booking.                                                  |

### 4. Errors

The `errors` table stores information about errors that occur in the system. Each error has the following properties:

| Field        | Type            | Description                                                                  |
|--------------|-----------------|------------------------------------------------------------------------------|
| code         | string          | Error code indicating the type of error.                                      |
| message      | string          | Detailed error message.                                                      |
| user         | string          | User ID associated with the error, or 'unknown' if not applicable.            |
| dateCreated  | Date            | Date and time when the error occurred.                                        |

## Type Definitions

The following type definitions provide a structure for the data stored in the tables.

### Firebase Integration
This system is based on Firebase and Next.js. Each table corresponds to a Firestore collection. Data can be manipulated using Firebase Firestore's API.