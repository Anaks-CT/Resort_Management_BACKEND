"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, ref: "User" },
    resortId: { type: String, required: true, ref: "Resort" },
    BookingDate: { type: Date, default: new Date() },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    roomDetail: [
        {
            roomTypeId: { type: mongoose_1.default.Types.ObjectId, required: true },
            roomName: { type: String, required: true },
            roomNumber: { type: String, required: true },
            roomId: { type: mongoose_1.default.Types.ObjectId, required: true },
            packagename: { type: String, required: true },
            packageCost: { type: Number, required: true }
        }
    ],
    amount: {
        totalRoomCost: { type: Number, required: true },
        taxCost: { type: Number, required: true },
        pointsUsed: { type: Number, required: true },
        totalCost: { type: Number, required: true },
    },
    status: { type: Boolean, default: true },
    paymentSuccess: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Booking", bookingSchema);
