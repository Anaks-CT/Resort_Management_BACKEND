"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const signToken = (_id) => {
    return (0, jsonwebtoken_1.sign)({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
exports.signToken = signToken;
const verifyToken = (token) => {
    return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
