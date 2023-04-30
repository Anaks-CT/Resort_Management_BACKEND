import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/database-con";
import cors from "cors";
import { user } from "./routes/user.routes";
import morgan from "morgan";
import { errorHandler } from "./error/errorHandler";
import { resort } from "./routes/resort.routes";
import { gallary } from "./routes/gallary.routes";
import { company } from "./routes/company.routes";
import { restaurant } from "./routes/restaurant.routes";
import { room } from "./routes/room.routes";
import { manager } from "./routes/manager.routes";
import { adminVerify, userVerify } from "./middlewares/auth-middlewares";
import { booking } from "./routes/booking.routes";

class App {
    public express: express.Application;

    constructor() {
        this.dotenvConfig();
        this.express = express();
        this.bodyParser();
        this.connectDB();
        this.logger();
        this.cors();
        this.mountRoutes();
        this.errorHandler();
    }

    // dotenv configuration
    private dotenvConfig(): void {
        dotenv.config();
    }

    // Routes
    private mountRoutes(): void {
        this.express.use("/user", user);
        this.express.use("/resort", resort);
        this.express.use("/room", room);
        this.express.use("/gallary", gallary);
        this.express.use("/company", company);
        this.express.use("/restaurant", restaurant);
        this.express.use("/manager/",manager)
        this.express.use("/booking/",booking)
        // protecting routes in the front end by verifying the token
        this.express.use('/checkCredential/admin', adminVerify, (req, res) => res.json({message:"credentials successfull"}))
        this.express.use('/checkCredential/user', userVerify, (req, res) => res.json({message:"credentials successfull"}))
    }

    // connecting database(MongoDB)
    private connectDB(): void {
        connectDB();
    }

    // CORS configuration
    private cors(): void {
        this.express.use(
            cors({
                origin: [`http://localhost:${process.env.INCOMING_PORT}`],
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                credentials: true,
            })
        );
    }

    // logger (Morgan configuration)
    private logger() {
        this.express.use(morgan("dev"));
    }

    // global error handler
    private errorHandler() {
        this.express.use(errorHandler);
    }

    // body parser
    private bodyParser(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
    }
}

export default new App().express;
