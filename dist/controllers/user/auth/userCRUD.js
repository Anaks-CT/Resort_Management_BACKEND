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
exports.updateUserStatus = exports.searchSortedUserDetails = exports.getAllUserDetails = exports.updateUserDetails = exports.getUserDetail = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_service_1 = __importDefault(require("../../../services/user.service"));
const userService = new user_service_1.default();
exports.getUserDetail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const _a = (yield userService.getSingleUserDetails(_id))._doc, { password, role } = _a, userDetails = __rest(_a, ["password", "role"]);
    res.status(200).json({ message: "User details fetched successfully", data: userDetails });
}));
exports.updateUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { image, name } = req.body.updateDetails;
    const updatedUserDetails = yield userService.updateUserDetails(_id, name, image);
    res.status(200).json({ message: "User details updated successfully", data: updatedUserDetails });
}));
exports.getAllUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield userService.getAllUserDetails();
    res.status(200).json({ message: "User details fetched successfully", data: allUsers });
}));
exports.searchSortedUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchInput, sortBy, sortOrder } = req.query;
    const allUsers = yield userService.getSerchSortedUserDetails(searchInput, sortOrder, sortBy);
    res.status(200).json({ message: "User details fetched successfully", data: allUsers });
}));
exports.updateUserStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { id: userId } = req.params;
    yield userService.updateUserStatus(userId, _id != process.env.password && _id);
    const allUsers = yield userService.getAllUserDetails();
    res.status(200).json({ message: "User status updated successfully", data: allUsers });
}));
