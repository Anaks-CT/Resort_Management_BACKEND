import asyncHandler from "express-async-handler";
import ManagerService from "../../services/manager.service";
import { IManager } from "../../interface/manager.interface";

const managerService = new ManagerService();


export const getAllManagerDetails =asyncHandler(async (req, res) => {
  const {searchInput, sortBy, sortOrder} = req.query
    const managerDetails = await managerService.searchSortedManagerDetails(searchInput as string, sortOrder as string, sortBy as string)
  res.json({message: "Manager details fetched successfully", data: managerDetails})
})

// export const editResortActive = asyncHandler( async (req, res) => {
//   const {resortId} = req.params
//   await managerService.editResortActive(resortId)
//   const allResortDetails = await managerService.allResortDetails()
//   res.json({message: "Resort Active changed successfully", data: allResortDetails})
// })

// export const deleteResort = asyncHandler( async (req, res) => {

// })