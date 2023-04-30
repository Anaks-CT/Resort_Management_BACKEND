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
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const booking_repositary_1 = __importDefault(require("../repositories/booking.repositary"));
const room_repositary_1 = __importDefault(require("../repositories/room.repositary"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
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
                return this.bookingRepositary.create(newBookingDetails)
                    .then((res) => bookingDetail = res);
            });
            return bookingDetail;
        });
    }
    deleteBooking(bookingSchemaDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getOne({ _id: bookingSchemaDetails._id });
            if (!bookingDetails)
                throw errorResponse_1.default.internalError("Cannot find the booknig details");
            if (!bookingDetails.paymentSuccess)
                yield this.bookingRepositary.deleteById(bookingSchemaDetails._id);
        });
    }
}
exports.default = BookingService;
