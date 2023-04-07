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
        .required("Enter your email")
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