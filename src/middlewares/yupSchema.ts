import  { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const signupSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name can not be empty")
        .test("isPerfectString", "Enter a valid name", (arg) =>
            /^[A-Za-z ]+$/.test(arg)
        ),
    phone: yup
        .string()
        .trim()
        .matches(/^[0-9]{10}$/, "Phone number is not valid")
        .required("Phone number is required"),
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
    password: yup
        .string()
        .trim()
        .required("Password can not be empty")
        .min(8, "Too short password")
        .max(16, "Too long password")
        .test("isPerfectPasswrod", "Enter a strong password", (arg) =>
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,16})/.test(
                arg
            )
        ),
    cPassword: yup
        .string()
        .trim()
        .required("Confirm password can't be empty")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
    password: yup.string().trim().required("Password can not be empty"),
});

export const addResort = yup.object().shape({
    image: yup.string().trim().required("Image cannot be empty"),
    name: yup.string().trim().required("Name cannot be empty"),
    heading: yup.string().trim().required("Heading cannot be empty"),
    description: yup.string().trim().required("Description cannot be empty"),
    location: yup.string().trim().required("Description cannot be empty"),
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
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

export const faqSchema = yup.object().shape({
    question: yup.string().trim().required("Question cannot be empty"),
    answer: yup.string().trim().required("Answer cannot be empty"),
});

export const addRoomSchema = yup.object().shape({
    images: yup
        .array()
        .of(
            yup
                .string()
                .required()
                .matches(
                    /^https:\/\/res\.cloudinary\.com\/.*\/image\/upload\/.*$/,
                    "Invalid Cloudinary URL"
                )
        )
        .required()
        .min(1, "At least one Image is required"),
    name: yup.string().trim().required("Name is required"),
    description: yup.string().trim().required("Description is required"),
    area: yup.string().trim().required("Area is required"),
    packages: yup.array().of(
        yup.object().shape({
            packageName: yup
                .string()
                .trim()
                .required("Package name is required"),
            cost: yup.string().trim().required("Cost is required"),
            features: yup
                .array()
                .of(yup.string().trim().required("Feature is required")),
        })
    ),
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

export const bookingValidation = yup.array().of(
    yup.object().shape({
        roomName: yup.string().trim().required(),
        roomId: yup
            .string()
            .trim()
            .required()
            .test("Valid MongoDB _id", "Invalid Room", (arg) =>
                isValidObjectId(arg!)
            ),
        packageName: yup.string().trim().required(),
        packageId: yup
            .string()
            .trim()
            .required()
            .test("Valid MongoDB _id", "Invalid Package", (arg) =>
                isValidObjectId(arg!)
            ),
        packageCost: yup.number().required(),
    })
);

export const emailVerifySchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Enter you email")
        .test("isvalidEmail", "Enter a valid Email", (arg) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(arg)
        ),
});

export const newPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .trim()
        .required("Password can not be empty")
        .min(8, "Too short password")
        .max(16, "Too long password")
        .test("isPerfectPasswrod", "Enter a strong password", (arg) =>
            /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,16})/.test(
                arg
            )
        ),
    cPassword: yup
        .string()
        .trim()
        .required("Confirm password can't be empty")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export const WishlistSchema = yup.object().shape({
    destination: yup.object().shape({
        name: yup.string().required(),
        id: yup
            .string()
            .required()
            .test("Valid MongoDB _id", "Invalid Room", (arg) =>
                isValidObjectId(arg!)
            ),
    }),
    roomDetail: yup.array().of(yup.number().required()).required(),
    date: yup.object().shape({
        startDate: yup.date().required(),
        endDate: yup.date().required(),
        key: yup.string().required(),
    }),
});

export const updateUserDetailSchema = yup.object().shape({
    image: yup
        .string()
        .trim(),
    name: yup
        .string()
        .trim()
        .required("Name can not be empty")
        .test("isPerfectString", "Enter a valid name", (arg) =>
            /^[A-Za-z ]+$/.test(arg)
        ),
});
