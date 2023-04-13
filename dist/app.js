"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const database_con_1 = __importDefault(require("./config/database-con"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = require("./routes/user.routes");
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./error/errorHandler");
const resort_routes_1 = require("./routes/resort.routes");
const gallary_routes_1 = require("./routes/gallary.routes");
const company_routes_1 = require("./routes/company.routes");
const restaurant_routes_1 = require("./routes/restaurant.routes");
const room_routes_1 = require("./routes/room.routes");
const manager_routes_1 = require("./routes/manager.routes");
class App {
    constructor() {
        this.dotenvConfig();
        this.express = (0, express_1.default)();
        this.bodyParser();
        this.connectDB();
        this.logger();
        this.cors();
        this.mountRoutes();
        this.errorHandler();
    }
    dotenvConfig() {
        dotenv.config();
    }
    mountRoutes() {
        this.express.use("/user", user_routes_1.user);
        this.express.use("/resort", resort_routes_1.resort);
        this.express.use("/room", room_routes_1.room);
        this.express.use("/gallary", gallary_routes_1.gallary);
        this.express.use("/company", company_routes_1.company);
        this.express.use("/restaurant", restaurant_routes_1.restaurant);
        this.express.use("/manager/", manager_routes_1.manager);
    }
    connectDB() {
        (0, database_con_1.default)();
    }
    cors() {
        this.express.use((0, cors_1.default)({
            origin: [`http://localhost:${process.env.INCOMING_PORT}`],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
        }));
    }
    logger() {
        this.express.use((0, morgan_1.default)("dev"));
    }
    errorHandler() {
        this.express.use(errorHandler_1.errorHandler);
    }
    bodyParser() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
    }
}
exports.default = new App().express;
