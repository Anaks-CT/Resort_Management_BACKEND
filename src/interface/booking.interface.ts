

export interface IBooking{
    id?: string
    userId: string
    resortId: string
    BookingDate?: Date,
    checkInDate: Date
    checkOutDate: Date
    roomDetail: [
        {
            roomType: string
            roomId: string
            roomName: string
            roomNumber: string,
            packageName: string,
            packageCost: number
        }
    ],
    amount: {
        roomCost: number,
        taxCost: number,
        pointsUsed: number,
        totalCost: number,
    },
    status?: boolean
    paymentSuccess?: boolean

}

export interface IBookingForm1{
    destination: {
        name: string;
        id: string;
    };
    roomDetail: number[];
    date: {
        startDate: Date;
        endDate: Date;
        key: string;
    };
}