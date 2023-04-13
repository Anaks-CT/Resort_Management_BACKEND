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
exports.getAllManagerDetails = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const manager_service_1 = __importDefault(require("../../services/manager.service"));
const managerService = new manager_service_1.default();
exports.getAllManagerDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchInput, sortBy, sortOrder } = req.query;
    const managerDetails = yield managerService.searchSortedManagerDetails(searchInput, sortOrder, sortBy);
    res.json({ message: "Manager details fetched successfully", data: managerDetails });
}));
// export const editResortActive = asyncHandler( async (req, res) => {
//   const {resortId} = req.params
//   await managerService.editResortActive(resortId)
//   const allResortDetails = await managerService.allResortDetails()
//   res.json({message: "Resort Active changed successfully", data: allResortDetails})
// })
// export const deleteResort = asyncHandler( async (req, res) => {
// })
