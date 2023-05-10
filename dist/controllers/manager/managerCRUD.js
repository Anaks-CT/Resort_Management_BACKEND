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
exports.getDashboardDetails = exports.getManagerDetailsByResortId = exports.changeManagerStatus = exports.getAllManagerDetails = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const manager_service_1 = __importDefault(require("../../services/manager.service"));
const room_service_1 = __importDefault(require("../../services/room.service"));
const managerService = new manager_service_1.default();
const roomService = new room_service_1.default();
exports.getAllManagerDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchInput, sortBy, sortOrder } = req.query;
    const managerDetails = yield managerService.searchSortedManagerDetails(searchInput, sortOrder, sortBy);
    res.json({ message: "Manager details fetched successfully", data: managerDetails });
}));
exports.changeManagerStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: managerId } = req.params;
    yield managerService.changeManagerStatus(managerId);
    const updatedManagerDetails = yield managerService.getAllManagerDetails();
    res.status(200).json({ message: "Manager Status updated successfully", data: updatedManagerDetails });
}));
exports.getManagerDetailsByResortId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const managerDetails = yield managerService.getManagerDetailsByResortId(req.params.resortId);
    res.status(200).json({ message: "Manger detailss fetched successfully", data: managerDetails });
}));
exports.getDashboardDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const managerDetails = yield roomService.calculateResortRoomOccupancyRate(req.params.resortId);
    res.status(200).json({ message: "Manger detailss fetched successfully", data: managerDetails });
}));
