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
exports.editResortActive = exports.editResort = exports.createResort = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const resort_service_1 = __importDefault(require("../../services/resort.service"));
const resortService = new resort_service_1.default();
exports.createResort = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, heading, description, features, location, email, customerCareNo } = req.body;
    const resortDetails = { image, name, heading, description, features };
    yield resortService.createResort(resortDetails, location, email, customerCareNo);
    const allResortDetails = yield resortService.allResortDetails();
    res.status(201).json({ message: "New Resort created", data: allResortDetails });
}));
exports.editResort = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortDetails, image } = req.body;
    const { resortId } = req.params;
    yield resortService.editResort(resortDetails, image, resortId);
    const allResortDetails = yield resortService.allResortDetails();
    res.json({ message: "Resort Edited successfully", data: allResortDetails });
}));
exports.editResortActive = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId } = req.params;
    yield resortService.editResortActive(resortId);
    const allResortDetails = yield resortService.allResortDetails();
    res.json({ message: "Resort Active changed successfully", data: allResortDetails });
}));
// export const deleteResort = asyncHandler( async (req, res) => {
// })
