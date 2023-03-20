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
exports.gallaryDetails = void 0;
const gallary_service_1 = __importDefault(require("../../services/gallary.service"));
const gallaryService = new gallary_service_1.default();
const gallaryDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield gallaryService.gallaryDetails();
        res.send({ message: "Successful", data: response });
    }
    catch (error) {
        return next(error);
    }
});
exports.gallaryDetails = gallaryDetails;
