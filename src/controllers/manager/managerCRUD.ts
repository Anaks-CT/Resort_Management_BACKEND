import asyncHandler from "express-async-handler";
import ManagerService from "../../services/manager.service";

const managerService = new ManagerService();


export const getAllManagerDetails =asyncHandler(async (req, res) => {
  const {searchInput, sortBy, sortOrder} = req.query
    const managerDetails = await managerService.searchSortedManagerDetails(searchInput as string, sortOrder as string, sortBy as string)
  res.json({message: "Manager details fetched successfully", data: managerDetails})
})

export const changeManagerStatus = asyncHandler( async (req, res) => {
  const {id:  managerId} = req.params
  await managerService.changeManagerStatus(managerId)
  const updatedManagerDetails = await managerService.getAllManagerDetails()
  res.status(200).json({message: "Manager Status updated successfully", data: updatedManagerDetails})

})

export const getManagerDetailsByResortId = asyncHandler(async (req, res) => {
  const managerDetails = await managerService.getManagerDetailsByResortId(req.params.resortId)
  res.status(200).json({message: "Manger detailss fetched successfully", data: managerDetails})
})