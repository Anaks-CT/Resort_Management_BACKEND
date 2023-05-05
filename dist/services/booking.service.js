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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = require("../config/razorpay");
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const booking_repositary_1 = __importDefault(require("../repositories/booking.repositary"));
const room_repositary_1 = __importDefault(require("../repositories/room.repositary"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const crypto_1 = __importDefault(require("crypto"));
class BookingService {
    constructor(bookingRepositary = new booking_repositary_1.default(), userRepositary = new user_repository_1.default(), roomRepositary = new room_repositary_1.default()) {
        this.bookingRepositary = bookingRepositary;
        this.userRepositary = userRepositary;
        this.roomRepositary = roomRepositary;
    }
    createBooking(userId, resortId, date, stayDetails, roomNumberIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getOne({ _id: userId });
            if (!user)
                throw errorResponse_1.default.unauthorized("Authorization Error. Please try again later");
            let roomDetails;
            let bookingDetail;
            yield Promise.all(stayDetails.map((singleDetails, i) => {
                let roomNumber;
                return this.roomRepositary
                    .getOne({ _id: singleDetails.roomId })
                    .then((res) => {
                    const room = res === null || res === void 0 ? void 0 : res.roomNumbers.filter((num) => {
                        var _a;
                        return (((_a = num._id) === null || _a === void 0 ? void 0 : _a.toString()) ==
                            roomNumberIds[i].toString());
                    });
                    roomNumber = room && room[0].number;
                    return {
                        roomTypeId: singleDetails.roomId,
                        roomName: singleDetails.roomName,
                        roomNumber: roomNumber,
                        roomId: room && room[0]._id,
                        packagename: singleDetails.packageName,
                        packageCost: singleDetails.packageCost,
                    };
                })
                    .catch((err) => {
                    throw errorResponse_1.default.notFound("cannot find Room Details");
                });
            })).then((result) => {
                roomDetails = result;
                const totalRoomCost = stayDetails.reduce((acc, item) => (acc += item.packageCost), 0);
                const pointsUsed = 0;
                const amount = {
                    totalRoomCost,
                    taxCost: (totalRoomCost * 22) / 100,
                    pointsUsed: pointsUsed,
                    totalCost: totalRoomCost + (totalRoomCost * 22) / 100 + pointsUsed,
                };
                const newBookingDetails = {
                    userId: userId,
                    resortId: resortId,
                    checkInDate: date.startDate,
                    checkOutDate: date.endDate,
                    roomDetail: roomDetails,
                    amount: amount,
                };
                return this.bookingRepositary
                    .create(newBookingDetails)
                    .then((res) => (bookingDetail = res));
            });
            return bookingDetail;
        });
    }
    deleteBooking(bookingSchemaDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getOne({
                _id: bookingSchemaDetails._id,
            });
            if (!bookingDetails)
                throw errorResponse_1.default.internalError("Cannot find the booknig details");
            if (!bookingDetails.paymentSuccess) {
                yield this.bookingRepositary.deleteById(bookingSchemaDetails._id);
                return true;
            }
            return false;
        });
    }
    initializePayment(totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiptId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // random reciept id generating
            const options = {
                amount: totalAmount * 100,
                currency: "INR",
                receipt: `receipt_order_${receiptId}`,
                payment_capture: 1,
            };
            const order = yield razorpay_1.instance.orders.create(options);
            if (!order)
                throw new Error("something went wrong");
            return order;
        });
    }
    verifyPayment(orderCreationId, razorpayPaymentId, razorpaySignature, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_SECRET)
                .update(`${orderCreationId}|${razorpayPaymentId}`)
                .digest("hex");
            if (signature !== razorpaySignature) {
                throw errorResponse_1.default.badRequest("Transcation is not legit");
            }
            console.log(bookingId);
            const updateResult = yield this.bookingRepositary.updateBookingPayment(bookingId);
            if (updateResult.modifiedCount === 0)
                throw errorResponse_1.default.internalError("An Error occured, if your money is been debited, please contact us");
        });
    }
    getBookingDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getAll({ userId: userId });
            if (!bookingDetails)
                throw errorResponse_1.default.notFound("Cannot find Bookings, Please try again later");
            const filteredBookingDetails = bookingDetails.map((item) => {
                const _a = item._doc, { paymentSuccess, status } = _a, rest = __rest(_a, ["paymentSuccess", "status"]);
                return rest;
            });
            return filteredBookingDetails;
        });
    }
}
exports.default = BookingService;
