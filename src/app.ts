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
import { adminVerify, managerVerify, userVerify } from "./middlewares/auth-middlewares";
import { booking } from "./routes/booking.routes";

class App {
    public express: express.Application;

    constructor() {
        this.dotenvConfig();
        this.express = express();
        this.bodyParser();
        this.connectDB();
        this.cors();
        this.logger();
        this.mountRoutes();
        this.errorHandler();
    }

    // dotenv configuration
    private dotenvConfig(): void {
        dotenv.config();
    }

    // Routes
    private mountRoutes(): void {
        this.express.use("/api/user", user);
        this.express.use("/api/resort", resort);
        this.express.use("/api/room", room);
        this.express.use("/api/gallary", gallary);
        this.express.use("/api/company", company);
        this.express.use("/api/restaurant", restaurant);
        this.express.use("/api/manager",manager)
        this.express.use("/api/booking/",booking)
        // authorizing routes 
        this.express.use('/api/checkCredential/admin', adminVerify, (req, res) => res.json({message:"credentials successfull"}))
        this.express.use('/api/checkCredential/user', userVerify, (req, res) => res.json({message:"credentials successfull"}))
        this.express.use('/api/checkCredential/manager', managerVerify, (req, res) => res.json({message:"credentials successfull"}))
    }

    // connecting database(MongoDB)
    private connectDB(): void {
        connectDB();
    }

    // CORS configuration
    private cors(): void {
        this.express.use((req, res, next) => {
          console.log("CORS middleware called");
          next();
        });
        this.express.use(
          cors({
            origin: ["https://trinity.anaksct.tech", "http://localhost:3000"],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
          })
        );
        this.express.use((req, res, next) => {
          console.log("Access-Control-Allow-Origin header:", res.get("Access-Control-Allow-Origin"));
          next();
        });
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
