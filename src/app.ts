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

    private dotenvConfig(): void {
        dotenv.config();
    }

    private mountRoutes(): void {
        this.express.use("/user", user);
        this.express.use("/resort", resort);
        this.express.use("/gallary", gallary);
        this.express.use("/company", company);
        this.express.use("/restaurant", restaurant);
    }

    private connectDB(): void {
        connectDB();
    }

    private cors(): void {
        this.express.use(
            cors({
                origin: [`http://localhost:${process.env.INCOMING_PORT}`],
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                credentials: true,
            })
        );
    }

    private logger() {
        this.express.use(morgan("dev"));
    }

    private errorHandler() {
        this.express.use(errorHandler);
    }

    private bodyParser(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
    }
}

export default new App().express;
