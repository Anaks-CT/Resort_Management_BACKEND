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
exports.getResortDashboardDetails = exports.getAdminDashboardDetails = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const booking_service_1 = __importDefault(require("../../services/booking.service"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const resort_service_1 = __importDefault(require("../../services/resort.service"));
const room_service_1 = __importDefault(require("../../services/room.service"));
const bookingService = new booking_service_1.default();
const userService = new user_service_1.default();
const resortService = new resort_service_1.default();
const roomService = new room_service_1.default();
exports.getAdminDashboardDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [bookingDetails, revenueDetails, totalUsers, totalBooking, totalResort, resorts,] = yield Promise.all([
        bookingService.getMonthlyRevenue(),
        bookingService.getResortRevenue(),
        userService.getNumberOfUsers(),
        bookingService.getBookingCounts(),
        resortService.getResortCount(),
        resortService.allResortDetails(),
    ]);
    res.status(200).json({
        message: "Dashboard details fetched succesfully",
        bookingRevenue: bookingDetails,
        resortRevenue: revenueDetails,
        userCount: totalUsers,
        bookingCount: totalBooking,
        resortCount: totalResort,
        allResorts: resorts === null || resorts === void 0 ? void 0 : resorts.map((item) => item.resortDetails.name),
    });
}));
exports.getResortDashboardDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: resortId } = req.params;
    const [roomOccupancy, totalUser, totalBooking, resortRevenue, monthlyRevenue] = yield Promise.all([
        roomService.calculateResortRoomOccupancyRate(resortId),
        userService.getNumberOfUsers(),
        bookingService.getBookingCounts(resortId),
        bookingService.getResortRevenue(resortId),
        bookingService.getMonthlyRevenue(resortId),
    ]);
    res.json({
        message: "Dashboard details fetched successfully",
        roomOccupancy,
        totalUser,
        totalBooking,
        resortRevenue: (_a = resortRevenue[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue,
        monthlyRevenue
    });
}));
