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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find();
        });
    }
    getOne() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne();
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email: email });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id);
        });
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.model.create(item);
            const newObject = new this.model(item);
            yield newObject.save();
            return newObject;
        });
    }
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: id };
            const options = { new: true };
            return this.model.findOneAndUpdate(filter, item, options).exec();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndDelete(id);
        });
    }
}
exports.BaseRepository = BaseRepository;