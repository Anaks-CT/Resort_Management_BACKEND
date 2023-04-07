import CompanyService from "../../services/company.service";
import asyncHandler from "express-async-handler";

const companyService = new CompanyService();

export const addFaq = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;
    const updatedFaqDetailss = await companyService.addFaq(question, answer);
    res.send({ message: "New FAQ added", data: updatedFaqDetailss });
});

export const faq = asyncHandler(async (req, res) => {
    const faqDetails = await companyService.getfaqDetails()
    res.status(200).json({data: faqDetails})
});

export const editFaq = asyncHandler(async(req, res) => {
    const {id} = req.params
    const {question, answer} = req.body
    const faqDetails = await companyService.editFaq(id, question, answer)
    res.status(200).json({message: "FAQ edit successfully", data: faqDetails})
})

export const deleteFaq = asyncHandler ( async(req, res) => {
    const {id} = req.params
    const updatedFaqs = await companyService.deleteFaq(id)
    res.status(200).json({message:"FAQ deleted!!",data: updatedFaqs})
})