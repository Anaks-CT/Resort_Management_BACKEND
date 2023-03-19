import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import CompanyService from "../../services/company.service";

const companyService = new CompanyService();

export const getCompanyDetails: RequestHandler = async (req, res, next) => {
    try {
        const companyDetails = await companyService.getCompanyDetails();
        res.send({ message: "successful", data: companyDetails });
    } catch (error: any) {
        return next(error);
    }
};