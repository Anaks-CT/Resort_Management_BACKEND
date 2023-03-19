"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
    static badRequest(msg) {
        return new ErrorResponse(400, msg);
    }
    static unauthorized(msg) {
        return new ErrorResponse(401, msg);
    }
    static forbidden(msg) {
        return new ErrorResponse(403, msg);
    }
    static notFound(msg = "Not found") {
        return new ErrorResponse(404, msg);
    }
    static internalError(msg) {
        return new ErrorResponse(500, msg);
    }
}
exports.default = ErrorResponse;
