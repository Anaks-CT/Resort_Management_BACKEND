import asyncHandler from "express-async-handler";
import ResortService from "../../services/resort.service";
import { RequestHandler } from "express";

const resortService = new ResortService();

export const createResort = asyncHandler(async (req, res) => {
  const { image, name, heading, description, features, location, email, customerCareNo } = req.body;
  const resortDetails = {image, name, heading, description, features}
    await resortService.createResort(
      resortDetails,
      location,
      email,
      customerCareNo
    );
    const allResortDetails = await resortService.allResortDetails()
    res.status(201).json({ message: "New Resort created", data: allResortDetails });
});

export const editResort =asyncHandler(async (req, res) => {
  const {resortDetails, image} = req.body
  const {resortId} = req.params  
  await resortService.editResort(resortDetails, image,  resortId)
  const allResortDetails = await resortService.allResortDetails()
  res.json({message: "Resort Edited successfully", data: allResortDetails})
})

export const editResortActive = asyncHandler( async (req, res) => {
  const {resortId} = req.params
  await resortService.editResortActive(resortId)
  const allResortDetails = await resortService.allResortDetails()
  res.json({message: "Resort Active changed successfully", data: allResortDetails})
})

// export const deleteResort = asyncHandler( async (req, res) => {

// })