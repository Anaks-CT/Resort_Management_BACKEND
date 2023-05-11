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
const resort_repositary_1 = __importDefault(require("../repositories/resort.repositary"));
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const manager_repositary_1 = __importDefault(require("../repositories/manager.repositary"));
const auth_service_1 = __importDefault(require("./auth.service"));
const authService = new auth_service_1.default();
class ManagerService {
    constructor(managerRepositary = new manager_repositary_1.default(), resortRepositary = new resort_repositary_1.default()) {
        this.managerRepositary = managerRepositary;
        this.resortRepositary = resortRepositary;
    }
    getManagerById(managerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const managerDetail = yield this.managerRepositary.getById(managerId);
            if (!managerDetail)
                throw errorResponse_1.default.notFound("Manager not found");
            if (!managerDetail.active)
                throw errorResponse_1.default.unauthorized("Sorry your account have been revoked");
            return managerDetail;
        });
    }
    getAllManagerDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const managerDetails = yield this.managerRepositary.searchSortManagerDetails('', null, null);
            if (!managerDetails)
                throw errorResponse_1.default.internalError('Failed to fetch Manager Details');
            return managerDetails;
        });
    }
    getManagerDetailsByResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const managerDetails = this.managerRepositary.getOne({ resortId: resortId });
            if (!managerDetails)
                throw errorResponse_1.default.notFound('No managers');
            return managerDetails;
        });
    }
    //*********************will change this to pagination, sort and search */
    searchSortedManagerDetails(searchInput, sortOrder, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            let order;
            if (sortOrder === "asc") {
                order = 1;
            }
            else if (sortOrder === "des") {
                order = -1;
            }
            else {
                order = null;
            }
            let sortby;
            if (sortBy === "Email") {
                sortby = "email";
            }
            else if (sortBy === "Name") {
                sortby = "name";
            }
            else if (sortBy === "Phone Number") {
                sortby = "phone";
            }
            else if (sortBy === "Make-Changes") {
                sortby = "active";
            }
            else {
                sortby = '';
            }
            const managerDetails = yield this.managerRepositary.searchSortManagerDetails(searchInput, order, sortby);
            if (managerDetails && (managerDetails === null || managerDetails === void 0 ? void 0 : managerDetails.length) < 1)
                throw errorResponse_1.default.badRequest("Manager Details not found");
            return managerDetails;
        });
    }
    changeManagerStatus(managerId) {
        return __awaiter(this, void 0, void 0, function* () {
            // fetching manager details from mongodb
            const managerDetails = yield this.managerRepositary.getOne({ _id: managerId });
            // throwing an errro if couldnt find
            if (!managerDetails)
                throw errorResponse_1.default.badRequest('No manager Found');
            const { email: managerEmail, active: status } = managerDetails;
            const resortId = managerDetails.resortId;
            // blocking all manager first so only one manager stays active at the end
            yield this.managerRepositary.blockingAllExistingMangerOfResort(resortId);
            // returning with true since all manager have been blocked
            if (status) {
                // updating the resort manager status
                const updateResort = yield this.resortRepositary.deleteManager(resortId);
                if (updateResort.modifiedCount === 0)
                    throw errorResponse_1.default.internalError('Failed to update Resort Manager field');
                return true;
            }
            // changing the status to true if status is aldready false
            const updateManagerResponse = yield this.managerRepositary.updateManagerStatus(resortId, managerEmail);
            // throwing error if failed to update manager status
            if (updateManagerResponse.modifiedCount === 0)
                throw errorResponse_1.default.internalError('Failed to update Manager Status');
            // Updating the resort by adding the active manager
            const managerDetail = yield this.managerRepositary.getOne({ email: managerEmail });
            const updateResort = yield this.resortRepositary.addManger(resortId, managerDetail === null || managerDetail === void 0 ? void 0 : managerDetail._id);
            if (updateResort.modifiedCount === 0)
                throw errorResponse_1.default.internalError('Failed to update Resort Manager field');
            // return true after everything is done
            return true;
        });
    }
    createManager(signupDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const resortId = signupDetails.resortId;
            // signing up the manager first
            const managerDetails = yield authService.signup("manager", signupDetails);
            // changing the status to false of all managers
            const blockResponse = yield this.managerRepositary.blockingAllExistingMangerOfResort(resortId);
            // throwing error if any fail occur in updating the status
            if (blockResponse.matchedCount && !blockResponse.modifiedCount)
                throw errorResponse_1.default.internalError('Failed to update the status of managers');
            // updating the status of current manager to active
            const updateManagerStatus = yield this.managerRepositary.updateManagerStatus(resortId, managerDetails.email);
            // throwing error if failed to do so
            if (updateManagerStatus.modifiedCount < 1)
                throw errorResponse_1.default.internalError("Manager Status not updated");
            // checking the count of the manager of resorts
            const managerCountOfSingleResort = yield this.managerRepositary.getAll({ resortId: resortId, active: true });
            // throwing error if active manager count is trying to exeed 1
            if (managerCountOfSingleResort.length > 1) {
                // deleting the existing resortmanager
                const deletResortManagerResponse = yield this.resortRepositary.deleteManager(resortId);
                // throwing error if failed to delete the resort manager
                if (deletResortManagerResponse.modifiedCount === 0)
                    throw errorResponse_1.default.internalError('Failed to delete Resort Manager');
                // changing all the managers of that resortd to inactive
                yield this.managerRepositary.blockingAllExistingMangerOfResort(resortId);
                // throwing error if more than one active manager found
                throw errorResponse_1.default.badRequest("Changed all manager status to inactive due to server error");
            }
            // updating the resort with managerid
            const updateResortResponse = yield this.resortRepositary.addManger(resortId, managerDetails._id);
            // throwing error if resort not updated
            if (updateResortResponse.modifiedCount < 1)
                throw errorResponse_1.default.internalError('Resort Not updated with managerId');
            return managerDetails;
        });
    }
}
exports.default = ManagerService;
