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
    createBooking(userId, resortId, date, stayDetails, roomNumberIds, userType, userPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getOne({ _id: userId });
            if (!user)
                throw errorResponse_1.default.unauthorized("Authorization Error. Please try again later");
            let roomDetails;
            let bookingDetail;
            let userPointsLeft;
            yield Promise.all(stayDetails.map((singleDetails, i) => {
                let roomNumber;
                return this.roomRepositary
                    .getOne({
                    _id: singleDetails.roomId,
                    "packages._id": singleDetails.packageId,
                })
                    .then((res) => {
                    if (!res)
                        throw errorResponse_1.default.notFound("Cannot find room Details");
                    const packageDetails = res.packages.find((pkg) => pkg._id.toString() ===
                        singleDetails.packageId.toString());
                    if (!packageDetails)
                        throw errorResponse_1.default.notFound("Cannot find package details");
                    // how can i get the details of the packge i have id with
                    const room = res.roomNumbers.filter((num) => {
                        var _a;
                        return (((_a = num._id) === null || _a === void 0 ? void 0 : _a.toString()) ==
                            roomNumberIds[i].toString());
                    });
                    roomNumber = room && room[0].number;
                    let packageCost;
                    if (userType === "platinum") {
                        packageCost =
                            Math.floor(packageDetails.cost -
                                (packageDetails.cost * 5 / 100));
                    }
                    else if (userType === "diamond") {
                        packageCost =
                            Math.floor(packageDetails.cost -
                                (packageDetails.cost * 15 / 100));
                    }
                    else {
                        packageCost = Math.floor(packageDetails.cost);
                    }
                    console.log(packageCost);
                    return {
                        roomTypeId: res === null || res === void 0 ? void 0 : res._id,
                        roomName: res === null || res === void 0 ? void 0 : res.name,
                        roomNumber,
                        roomId: room && room[0]._id,
                        packagename: packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.packageName,
                        packageCost,
                    };
                })
                    .catch(() => {
                    throw errorResponse_1.default.notFound("cannot find Room Details");
                });
            })).then((result) => {
                roomDetails = result;
                const totalRoomCost = result.reduce((acc, item) => (acc += item.packageCost), 0);
                const taxCost = Math.floor((totalRoomCost * 22) / 100);
                const currentTotal = totalRoomCost + taxCost;
                let totalCost;
                let remainingUserPoints;
                if (userPoints) {
                    if (currentTotal < userPoints ||
                        userPoints > currentTotal - 1000) {
                        totalCost = 1000;
                        remainingUserPoints = userPoints - currentTotal;
                    }
                    else {
                        totalCost = currentTotal - userPoints;
                        remainingUserPoints = 0;
                    }
                }
                else {
                    totalCost = currentTotal;
                }
                const amount = {
                    totalRoomCost,
                    taxCost,
                    pointsUsed: userPoints &&
                        remainingUserPoints &&
                        (userPoints > remainingUserPoints
                            ? userPoints - remainingUserPoints
                            : remainingUserPoints - userPoints),
                    totalCost,
                };
                const newBookingDetails = {
                    userId: userId,
                    resortId: resortId,
                    checkInDate: date.startDate,
                    checkOutDate: date.endDate,
                    roomDetail: roomDetails,
                    amount: amount,
                };
                userPointsLeft = remainingUserPoints;
                return this.bookingRepositary
                    .create(newBookingDetails)
                    .then((res) => (bookingDetail = res));
            });
            return Object.assign(Object.assign({}, bookingDetail), { userPointsLeft });
        });
    }
    deleteBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getOne({
                _id: bookingId,
            });
            if (!bookingDetails)
                throw errorResponse_1.default.internalError("Cannot find the booknig details");
            if (!bookingDetails.paymentSuccess) {
                yield this.bookingRepositary.deleteById(bookingId);
                return true;
            }
            return false;
        });
    }
    cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getOne({
                _id: bookingId,
            });
            if (!bookingDetails)
                throw errorResponse_1.default.internalError("Cannot find the booknig details");
            if (!bookingDetails.status)
                throw errorResponse_1.default.conflict("Booking is already canceled");
            const { modifiedCount } = yield this.bookingRepositary.cancelbookingStatus(bookingId);
            if (modifiedCount === 0)
                throw errorResponse_1.default.internalError("Couldn't cancel booking, please contact TRINITY helping desk");
            return bookingDetails;
        });
    }
    initializePayment(totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiptId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // random reciept id generating
            const options = {
                amount: Math.floor(totalAmount * 100),
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
            const updateResult = yield this.bookingRepositary.updateBookingPayment(bookingId);
            if (updateResult.modifiedCount === 0)
                throw errorResponse_1.default.internalError("An Error occured, if your money is been debited, please contact us");
        });
    }
    getBookingById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getById(bookingId);
            if (!bookingDetails)
                throw errorResponse_1.default.notFound("Cannot find booking details");
            return bookingDetails;
        });
    }
    getBookingDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.bookingRepositary.getAll({
                userId: userId,
                paymentSuccess: true,
            }, { "createdAt": -1 });
            if (!bookingDetails)
                throw errorResponse_1.default.notFound("Cannot find Bookings, Please try again later");
            const resortPopulated = yield this.bookingRepositary.populate(bookingDetails, "resortId");
            const userPopulated = yield this.bookingRepositary.populate(resortPopulated, "userId");
            return userPopulated.map((_a) => {
                var _b = _a._doc, { paymentSuccess, resortId: { resortDetails: { name: resortName }, }, userId: { name, phone, email } } = _b, rest = __rest(_b, ["paymentSuccess", "resortId", "userId"]);
                return (Object.assign(Object.assign({}, rest), { resortName, name, phone, email }));
            });
        });
    }
}
exports.default = BookingService;
