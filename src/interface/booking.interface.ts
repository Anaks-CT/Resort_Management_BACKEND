

export interface IBooking{
    id?: string
    userId: string
    resortId: string
    BookingDate: Date,
    checkInDate: Date
    checkOutDate: Date
    roomDetail: [
        {
            roomType: string
            roomNumber: number,
            noOfGuests: number
        }
    ],
    amount: {
        roomCost: number,
        taxCost: number,
        pointsUsed: number,
        totalCost: number,
    },
    status: boolean

}