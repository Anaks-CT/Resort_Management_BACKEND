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
exports.getManagerDashboardDetails = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const booking_service_1 = __importDefault(require("../../services/booking.service"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const room_service_1 = __importDefault(require("../../services/room.service"));
const manager_service_1 = __importDefault(require("../../services/manager.service"));
const bookingService = new booking_service_1.default();
const userService = new user_service_1.default();
const roomService = new room_service_1.default();
const managerService = new manager_service_1.default();
exports.getManagerDashboardDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { _id: managerId } = req.user;
    const managerDetail = yield managerService.getManagerById(managerId);
    const [roomOccupancy, totalUser, totalBooking, resortRevenue, monthlyRevenue] = yield Promise.all([
        roomService.calculateResortRoomOccupancyRate(managerDetail.resortId.toString()),
        userService.getNumberOfUsers(),
        bookingService.getBookingCounts(managerDetail.resortId.toString()),
        bookingService.getResortRevenue(managerDetail.resortId.toString()),
        bookingService.getMonthlyRevenue(managerDetail.resortId.toString()),
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
