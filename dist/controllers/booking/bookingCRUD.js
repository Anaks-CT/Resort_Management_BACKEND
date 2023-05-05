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
exports.getBookingDetailsOfUser = exports.verifyPayment = exports.bookingConfirmationPart1 = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const room_service_1 = __importDefault(require("../../services/room.service"));
const booking_service_1 = __importDefault(require("../../services/booking.service"));
const roomService = new room_service_1.default();
const bookingService = new booking_service_1.default();
exports.bookingConfirmationPart1 = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { destination: resortId, roomDetail, date, } = req.body.bookingForm1Details;
    yield roomService.getAvailableRooms(resortId, roomDetail, date);
    const roomNumber = yield Promise.all((_a = req.body.stayDetails) === null || _a === void 0 ? void 0 : _a.map((singleStayDetail) => roomService.addDatesToRoom(date, singleStayDetail.roomId)));
    const bookingDetails = (yield bookingService.createBooking(req.user._id, resortId.id, date, req.body.stayDetails, roomNumber));
    const booking = bookingDetails;
    const orderDetails = yield bookingService.initializePayment(booking.amount.totalCost);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield bookingService.deleteBooking(bookingDetails && bookingDetails);
        if (bookingDetails && result) {
            const details = bookingDetails;
            Promise.all(details.roomDetail.map((singleRoomDetail) => roomService.removeDatesFromRoom(singleRoomDetail.roomTypeId, singleRoomDetail.roomId, date)));
        }
    }), 30000);
    res.json({
        message: "Booking confirmation part 1 successful",
        data: orderDetails,
        bookingId: booking.id
    });
}));
exports.verifyPayment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderCreationId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;
    yield bookingService.verifyPayment(orderCreationId, razorpayPaymentId, razorpaySignature, bookingId);
    res.status(200).json({ message: "Booking verified successfull" });
}));
exports.getBookingDetailsOfUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const bookingDetails = yield bookingService.getBookingDetails(_id);
    res.status(200).json({ message: "Booking details fetched successfully", data: bookingDetails });
}));
