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
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class UserService {
    constructor(userRepositary = new user_repository_1.default()) {
        this.userRepositary = userRepositary;
    }
    getSingleUserDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getOne({ _id: id });
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            return user;
        });
    }
}
exports.default = UserService;
