import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import CompanyService from "../../services/company.service";

const companyService = new CompanyService();

export const createCompany: RequestHandler = async (req, res, next) => {
    const { companyName, bannerDetails, faqs } = req.body;
    try {
        const response = await companyService.createCompany(companyName, bannerDetails, faqs);
        res.send({ message: "new company created", data: response });
    } catch (error: any) {
        return next(error);
    }
};
