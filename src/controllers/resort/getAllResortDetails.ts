import asyncHandler from "express-async-handler";
import ResortService from "../../services/resort.service";

const resortService = new ResortService();

export const getAllResortDetails = asyncHandler( async (req, res) => {
    const  resort  = await resortService.allResortDetails()
    res.send({ message: "Fetching data successful", data: resort });
});

export const getSearchSortResortDetails = asyncHandler( async (req, res) => {
  const {searchValue, sortOrder} = req.query
  const resortDetails = await resortService.searchSortService(searchValue as string, sortOrder as string)
  res.json({message: 'Fetching data successful', data: resortDetails})
})

export const getSingleResort = asyncHandler( async (req, res) => {
    const  resort  = await resortService.getResortById(req.params.resortId)
    res.send({ message: "Fetching data successful", data: resort });
});