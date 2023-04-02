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
exports.deleteCommunityPic = exports.editCommunityPic = exports.addCommunityPic = void 0;
const gallary_service_1 = __importDefault(require("../../services/gallary.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const gallaryService = new gallary_service_1.default();
exports.addCommunityPic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image } = req.body;
    const { resortId } = req.query;
    const updatedData = yield gallaryService.addCommunityPic(resortId, image);
    res.json({
        message: `Picture added successfully`,
        data: updatedData,
    });
}));
exports.editCommunityPic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, prevImage } = req.query;
    const { image } = req.body;
    const updatedResponse = yield gallaryService.editCommunityPic(resortId, prevImage, image);
    res.json({ message: "Image updated Successfully", data: updatedResponse });
}));
exports.deleteCommunityPic = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, image } = req.query;
    const udpatedData = yield gallaryService.deleteCommunityPic(resortId, image);
    res.json({
        message: `Picture deleted successfully`,
        data: udpatedData,
    });
}));
