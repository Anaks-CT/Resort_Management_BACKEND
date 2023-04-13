import asyncHandler from "express-async-handler";
import ManagerService from "../../services/manager.service";
import { IManager } from "../../interface/manager.interface";

const managerService = new ManagerService();


export const getAllManagerDetails =asyncHandler(async (req, res) => {
  const {searchInput, sortBy, sortOrder} = req.query
    const managerDetails = await managerService.searchSortedManagerDetails(searchInput as string, sortOrder as string, sortBy as string)
  res.json({message: "Manager details fetched successfully", data: managerDetails})
})

export const changeManagerStatus = asyncHandler( async (req, res) => {
  const { resortId, managerEmail, status} = req.body
  await managerService.changeManagerStatus(resortId, managerEmail, status)
  const updatedManagerDetails = await managerService.getAllManagerDetails()
  res.status(200).json({message: "Manager Status updated successfully", data: updatedManagerDetails})

})

// export const editResortActive = asyncHandler( async (req, res) => {
//   const {resortId} = req.params
//   await managerService.editResortActive(resortId)
//   const allResortDetails = await managerService.allResortDetails()
//   res.json({message: "Resort Active changed successfully", data: allResortDetails})
// })

// export const deleteResort = asyncHandler( async (req, res) => {

// })