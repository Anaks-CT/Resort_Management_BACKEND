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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDetailSchema = exports.WishlistSchema = exports.newPasswordSchema = exports.emailVerifySchema = exports.bookingValidation = exports.addRoomSchema = exports.faqSchema = exports.addResort = exports.loginSchema = exports.signupSchema = void 0;
const mongoose_1 = require("mongoose");
const yup = __importStar(require("yup"));
exports.signupSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name can not be empty")
        .test("isPerfectString", "Enter a valid name", (arg) => /^[A-Za-z ]+$/.test(arg)),
    phone: yup
        .string()
        .trim()
        .matches(/^[0-9]{10}$/, "Phone number is not valid")
        .required("Phone number is required"),
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)),
    password: yup
        .string()
        .trim()
        .required("Password can not be empty")
        .min(8, "Too short password")
        .max(16, "Too long password")
        .test("isPerfectPasswrod", "Enter a strong password", (arg) => /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,16})/.test(arg)),
    cPassword: yup
        .string()
        .trim()
        .required("Confirm password can't be empty")
        .oneOf([yup.ref("password")], "Passwords must match"),
});
exports.loginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)),
    password: yup.string().trim().required("Password can not be empty"),
});
exports.addResort = yup.object().shape({
    image: yup.string().trim().required("Image cannot be empty"),
    name: yup.string().trim().required("Name cannot be empty"),
    heading: yup.string().trim().required("Heading cannot be empty"),
    description: yup.string().trim().required("Description cannot be empty"),
    location: yup.string().trim().required("Description cannot be empty"),
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)),
    customerCareNo: yup
        .string()
        .trim()
        .required("Customer Care Number is required")
        .matches(/^[0-9]{10}$/, "Customer Care Number is not valid"),
    features: yup
        .array()
        .of(yup.string().required("Feature is required"))
        .min(1, "At least one feature is required"),
});
exports.faqSchema = yup.object().shape({
    question: yup.string().trim().required("Question cannot be empty"),
    answer: yup.string().trim().required("Answer cannot be empty"),
});
exports.addRoomSchema = yup.object().shape({
    images: yup
        .array()
        .of(yup
        .string()
        .required()
        .matches(/^https:\/\/res\.cloudinary\.com\/.*\/image\/upload\/.*$/, "Invalid Cloudinary URL"))
        .required()
        .min(1, "At least one Image is required"),
    name: yup.string().trim().required("Name is required"),
    description: yup.string().trim().required("Description is required"),
    area: yup.string().trim().required("Area is required"),
    packages: yup.array().of(yup.object().shape({
        packageName: yup
            .string()
            .trim()
            .required("Package name is required"),
        cost: yup.string().trim().required("Cost is required"),
        features: yup
            .array()
            .of(yup.string().trim().required("Feature is required")),
    })),
    maxPeople: yup
        .string()
        .trim()
        .matches(/^[0-9]{1}$/, "max People should be less than 10 ")
        .required("Max people is required"),
    noOfRooms: yup
        .number()
        .max(899, "Rooms should be less than 900 ")
        .required("Number of rooms is required"),
    highlights: yup
        .array()
        .of(yup.string().trim().required("Highlight is required")),
    amenities: yup
        .array()
        .of(yup.string().trim().required("Amenity is required")),
    facilities: yup
        .array()
        .of(yup.string().trim().required("Facility is required")),
});
exports.bookingValidation = yup.array().of(yup.object().shape({
    roomName: yup.string().trim().required(),
    roomId: yup
        .string()
        .trim()
        .required()
        .test("Valid MongoDB _id", "Invalid Room", (arg) => (0, mongoose_1.isValidObjectId)(arg)),
    packageName: yup.string().trim().required(),
    packageId: yup
        .string()
        .trim()
        .required()
        .test("Valid MongoDB _id", "Invalid Package", (arg) => (0, mongoose_1.isValidObjectId)(arg)),
    packageCost: yup.number().required(),
}));
exports.emailVerifySchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)),
});
exports.newPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .trim()
        .required("Password can not be empty")
        .min(8, "Too short password")
        .max(16, "Too long password")
        .test("isPerfectPasswrod", "Enter a strong password", (arg) => /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,16})/.test(arg)),
    cPassword: yup
        .string()
        .trim()
        .required("Confirm password can't be empty")
        .oneOf([yup.ref("password")], "Passwords must match"),
});
exports.WishlistSchema = yup.object().shape({
    destination: yup.object().shape({
        name: yup.string().required(),
        id: yup
            .string()
            .required()
            .test("Valid MongoDB _id", "Invalid Room", (arg) => (0, mongoose_1.isValidObjectId)(arg)),
    }),
    roomDetail: yup.array().of(yup.number().required()).required(),
    date: yup.object().shape({
        startDate: yup.date().required(),
        endDate: yup.date().required(),
        key: yup.string().required(),
    }),
});
exports.updateUserDetailSchema = yup.object().shape({
    image: yup
        .string()
        .trim(),
    name: yup
        .string()
        .trim()
        .required("Name can not be empty")
        .test("isPerfectString", "Enter a valid name", (arg) => /^[A-Za-z ]+$/.test(arg)),
});
