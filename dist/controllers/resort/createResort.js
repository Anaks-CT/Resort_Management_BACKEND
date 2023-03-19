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
exports.createResort = void 0;
const resort_service_1 = __importDefault(require("../../services/resort.service"));
const resortService = new resort_service_1.default();
const createResort = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortDetails, location, email, customerCareNo } = req.body;
    try {
        const { resort } = yield resortService.createResort(resortDetails, location, email, customerCareNo);
        res.send({ message: "New Resort created", data: resort });
    }
    catch (error) {
        return next(error);
    }
});
exports.createResort = createResort;
