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
exports.wishlistDetails = exports.passwordValidate = exports.emailQueryValidate = exports.bookingRoomDetailsValidate = exports.paramsIdValidate = exports.managerSignupValidate = exports.roomValidate = exports.faqValidate = exports.resortValidate = exports.validateLogin = exports.validateSignup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const yupSchema_1 = require("./yupSchema");
const validator_1 = __importDefault(require("validator"));
// Validating req.body before reaching controller
// signup body validation
exports.validateSignup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.signupSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
// login body validation
exports.validateLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.loginSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
// add resort body validation
exports.resortValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.addResort.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.faqValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.faqSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.roomValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.roomData = yield yupSchema_1.addRoomSchema.validate(req.body.roomData);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.managerSignupValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.resortId || !validator_1.default.isMongoId(req.body.resortId)) {
            throw errorResponse_1.default.badRequest("Cannot find Resort");
        }
        req.body = yield yupSchema_1.signupSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.paramsIdValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id || !validator_1.default.isMongoId(req.params.id))
            throw errorResponse_1.default.badRequest('Invalid Id');
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.bookingRoomDetailsValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.stayDetails = yield yupSchema_1.bookingValidation.validate(req.body.stayDetails);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.emailQueryValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.query.email = (yield yupSchema_1.emailVerifySchema.validate({ email: req.query.email })).email;
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.passwordValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.passwordDetails = yield yupSchema_1.newPasswordSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
exports.wishlistDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.wishlistDetails = yield yupSchema_1.WishlistSchema.validate(req.body.wishlistDetails);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.badRequest(err.errors[0]);
    }
}));
// export const managerValidate = asyncHandler(
//     async (req, res, next) => {
//     }
// )
