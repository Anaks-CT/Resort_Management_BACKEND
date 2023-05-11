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
exports.gallaryDetailsByResortId = exports.gallaryDetailsByManagerId = exports.gallaryDetails = void 0;
const gallary_service_1 = __importDefault(require("../../services/gallary.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const resort_service_1 = __importDefault(require("../../services/resort.service"));
const gallaryService = new gallary_service_1.default();
const resortService = new resort_service_1.default();
exports.gallaryDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield gallaryService.gallaryDetails();
    res.status(200).json({ message: "Successful", data: response });
}));
exports.gallaryDetailsByManagerId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: managerId } = req.user;
    const { _id: resortId } = yield resortService.getResortByManagerId(managerId);
    const gallaryDetails = yield gallaryService.findGallarybyResortId(resortId);
    res.status(200).json({ message: "Gallery details fetched succesfully", data: gallaryDetails });
}));
exports.gallaryDetailsByResortId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield gallaryService.findGallarybyResortId(req.params.id);
    res.status(200).json({ message: "Successful", data: response });
}));
