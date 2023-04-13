"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const baseRepositary_1 = require("./baseRepositary");
class UserRepository extends baseRepositary_1.BaseRepository {
    constructor() {
        super(user_model_1.default);
    }
}
exports.default = UserRepository;
