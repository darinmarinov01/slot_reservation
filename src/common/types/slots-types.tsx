export enum SlotTypesEnum {
  CAR = 'car_slot',
  DESK = 'desk_slot',
}

export enum SlotQuery {
  ALL_NEXT_SLOTS = 'all_next_slots',
  ALL_SLOTS_BY_USER = 'all_past_slots',
}

export enum SlotProgress {
  NOT_STARTED = 'not started',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

export enum SlotProgressColor {
  RED = 'bg-red-500',
  ORANGE = 'bg-orange-400',
  GREEN = 'bg-green-500',
}


export type SlotProperties = {
    id?: string,
    location: string,
    description?: string,
    type: SlotTypesEnum,
    dateCreated?: Date
}

export type BookedSlots = {
  id?: string,
  startDate: Date,
  endDate: Date,
  user: string,
  slot: string,
  description?: string
}

export interface BookedSlotsWithProgress extends BookedSlots {
  progress?: SlotProgress
}

export interface EventInput {
  id?: string
  resourceId?: string
  start: string
  end: string
  title: string
  color?: string
}

export type ApiError = {
  message: string
}