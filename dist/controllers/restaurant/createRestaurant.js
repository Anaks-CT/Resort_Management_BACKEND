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
exports.createRestaurant = void 0;
const restaurant_service_1 = __importDefault(require("../../services/restaurant.service"));
const restaurantService = new restaurant_service_1.default();
const createRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, heading, description, feature, image } = req.body;
    try {
        const result = yield restaurantService.createRestaurant(name, heading, description, feature, image);
        res.send({ message: "New restaurant created", data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.createRestaurant = createRestaurant;
