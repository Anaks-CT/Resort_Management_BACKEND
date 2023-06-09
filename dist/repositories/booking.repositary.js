"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepositary_1 = require("./baseRepositary");
const mongodb_1 = require("mongodb");
const booking_model_1 = __importDefault(require("../models/booking.model"));
class BookingRepositary extends baseRepositary_1.BaseRepository {
    constructor() {
        super(booking_model_1.default);
    }
    updateBookingPayment(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield booking_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(bookingId) }, {
                $set: {
                    paymentSuccess: true,
                },
            });
        });
    }
    cancelbookingStatus(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield booking_model_1.default.updateOne({ _id: bookingId }, {
                $set: {
                    status: false
                }
            });
        });
    }
    searchSortService(resortid, sortOrder, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            //************************************ major error will change later */
            let query = booking_model_1.default.find({ resortId: resortid });
            if (sortOrder && sortBy)
                query = query.sort({ [sortBy]: sortOrder });
            return yield query;
        });
    }
    resortRevenue(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resortId) {
                return yield booking_model_1.default.aggregate([
                    // Filter bookings by resortId
                    { $match: { resortId } },
                    // Filter bookings with paymentSuccess flag set to true
                    { $match: { paymentSuccess: true } },
                    // Group bookings by resortId and sum up the totalCost field for each group
                    { $group: {
                            _id: '$resortId',
                            totalRevenue: { $sum: '$amount.totalCost' }
                        } }
                ]);
            }
            return yield booking_model_1.default.aggregate([
                { $match: { paymentSuccess: true } },
                {
                    $group: {
                        _id: '$resortId',
                        totalRevenue: { $sum: '$amount.totalCost' },
                    },
                },
            ]);
        });
    }
    getMonthlyRevenue(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentYear = new Date().getFullYear();
            let match;
            if (resortId)
                match = { resortId: resortId };
            return yield booking_model_1.default.aggregate([
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
            ]);
        });
    }
}
exports.default = BookingRepositary;
