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
exports.deleteFaq = exports.editFaq = exports.faq = exports.addFaq = void 0;
const company_service_1 = __importDefault(require("../../services/company.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const companyService = new company_service_1.default();
exports.addFaq = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, answer } = req.body;
    const updatedFaqDetailss = yield companyService.addFaq(question, answer);
    res.send({ message: "New FAQ added", data: updatedFaqDetailss });
}));
exports.faq = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const faqDetails = yield companyService.getfaqDetails();
    res.status(200).json({ data: faqDetails });
}));
exports.editFaq = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { question, answer } = req.body;
    const faqDetails = yield companyService.editFaq(id, question, answer);
    res.status(200).json({ message: "FAQ edit successfully", data: faqDetails });
}));
exports.deleteFaq = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedFaqs = yield companyService.deleteFaq(id);
    res.status(200).json({ message: "FAQ deleted!!", data: updatedFaqs });
}));
