import { RequestHandler } from "express";
import CompanyService from "../../services/company.service";

const companyService = new CompanyService();

export const addFaq: RequestHandler = async (req, res, next) => {
    const { question, answer } = req.body;
    try {
        const response = await companyService.addFaq(question, answer);
        res.send({ message: "New faq added", data: response });
    } catch (error: any) {
        return next(error);
    }
};
