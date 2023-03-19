"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
}
exports.default = cors;
