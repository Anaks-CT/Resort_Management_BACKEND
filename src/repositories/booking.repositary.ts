import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { ICompany } from "../interface/company.interface";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import bookingModel from "../models/booking.model";
import { IBooking } from "../interface/booking.interface";

class BookingRepositary extends BaseRepository {
    constructor() {
        super(bookingModel);
    }

    async updateBookingPayment(bookingId: string) {
        return await bookingModel.updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    paymentSuccess: true,
                },
            }
        );
    }

    async cancelbookingStatus(bookingId: string){
        return await bookingModel.updateOne(
            { _id: bookingId },
            {
                $set: {
                    status: false
                }
            }
        )
    }

    async searchSortService(resortid: string, sortOrder: 1 | -1 | null, sortBy: string | null): Promise<IBooking[]>{
        //************************************ major error will change later */
        let query = bookingModel.find({resortId: resortid})
        if (sortOrder && sortBy) query = query.sort({[sortBy]: sortOrder});
        
        return await query;
    }

    async resortRevenue(resortId?: string){
        if(resortId){
          return await bookingModel.aggregate([
            // Filter bookings by resortId
            { $match: { resortId } },
          
            // Filter bookings with paymentSuccess flag set to true
            { $match: { paymentSuccess: true } },
          
            // Group bookings by resortId and sum up the totalCost field for each group
            { $group: {
                _id: '$resortId',
                totalRevenue: { $sum: '$amount.totalCost' }
            }}
          ]);
        }
        return await bookingModel.aggregate([
            { $match: { paymentSuccess: true } },
            {
              $group: {
                _id: '$resortId',
                totalRevenue: { $sum: '$amount.totalCost' },
              },
            },
          ])
    }


    async getMonthlyRevenue(resortId?: string){
        const currentYear = new Date().getFullYear();
        let match
        if(resortId) match = {resortId: resortId}
        return await bookingModel.aggregate([
            {
              $match: {
                $and: [
                    match ? match : {},
                    { createdAt: { $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`) } },
                    { createdAt: { $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`) } }
                  ]
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$createdAt"
                  }
                },
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: "$amount.totalCost" },
              }
            }
          ])
    }
}

export default BookingRepositary;
