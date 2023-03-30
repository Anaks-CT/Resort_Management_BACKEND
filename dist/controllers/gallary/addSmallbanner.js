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
exports.addSmallBanner = void 0;
const gallary_service_1 = __importDefault(require("../../services/gallary.service"));
const gallaryService = new gallary_service_1.default();
const addSmallBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, description1, description2, resortId } = req.body;
    try {
        const response = yield gallaryService.addBanner("smallBanner", image, description1, description2, resortId);
        res.send({ message: 'Small banner added', data: response });
    }
    catch (error) {
        return next(error);
    }
});
exports.addSmallBanner = addSmallBanner;
