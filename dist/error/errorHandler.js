"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorResponse_1 = __importDefault(require("./errorResponse"));
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof errorResponse_1.default) {
        return res.status(err.status).json({ message: err.message });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
