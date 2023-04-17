"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
        addressLine1: { type: String },
        addressLine2: { type: String },
        addressLine3: { type: String },
        city: { type: String },
        pincode: { type: Number },
        country: { type: String },
    },
    role: { type: String, default: "user" }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
