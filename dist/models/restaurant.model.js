"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    feature: [
        { type: String, required: true }
    ],
    image: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)("Restaurant", restaurantSchema);
