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
exports.getSingleResort = exports.getSearchSortResortDetails = exports.getAllResortDetails = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const resort_service_1 = __importDefault(require("../../services/resort.service"));
const resortService = new resort_service_1.default();
exports.getAllResortDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resort = yield resortService.allResortDetails();
    res.send({ message: "Fetching data successful", data: resort });
}));
exports.getSearchSortResortDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchValue, sortOrder } = req.query;
    const resortDetails = yield resortService.searchSortService(searchValue, sortOrder);
    res.json({ message: 'Fetching data successful', data: resortDetails });
}));
exports.getSingleResort = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resort = yield resortService.getResortById(req.params.resortId);
    res.send({ message: "Fetching data successful", data: resort });
}));
