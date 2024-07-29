# Parking System


## Initial Database design

![alt text](db_design.png)

## Assumptions
- A slot can be of different types: parking, working, etc.
- Slot “free“ would be a derived value rather than a table column – based on its slot__slot_booking relation. If for a specific slot X there is a SlotBooking Y and today date Z.
Then if  Y.from <= Z <= Y.to  X.free is false – the slot is occupied.
    * Alternative solution: To have the user first choose the timeframe when they need to book a slot, and based on the time selection all slots which are  available during the given timeframe to be shown on the page.   
- A SlotBooking can have only 1 Slot relation, but a Slot, can have many SlotBooking’s
- SlotBooking represent a booking of the space, regardless of the time. Not only can be used to check if a specific slot is free, but also to book a slot further in time, to check if a slot is free/occupied on a specific date and for analytics.
- A slot can be booked – from/to dateTime in DB.
- License plate - optional
- License plate to be a table on its own 1:1 to User and optional to SlotBooking
- Booking of an already occupied slot can be limited from both – FE and BE. 