import ResortRepositary from "../repositories/resort.repositary";
import ErrorResponse from "../error/errorResponse";
import { IManager } from "../interface/manager.interface";
import MangerRepositary from "../repositories/manager.repositary";
import AuthService from "./auth.service";
const authService = new AuthService()
export default class ManagerService {
    constructor(
        private managerRepositary = new MangerRepositary(),
        private resortRepositary = new ResortRepositary()
    ) {}

    
    async getAllManagerDetails(): Promise<IManager[]> {
        const managerDetails = await this.managerRepositary.searchSortManagerDetails('',null,null)
        if(!managerDetails) throw ErrorResponse.internalError('Failed to fetch Manager Details')
        return managerDetails
    }

    async getManagerDetailsByResortId(resortId: string){
        const managerDetails = this.managerRepositary.getOne<IManager>({resortId: resortId})
        if(!managerDetails) throw ErrorResponse.notFound('No managers')
        return managerDetails
    }

     
//*********************will change this to pagination, sort and search */
    async searchSortedManagerDetails(searchInput: string, sortOrder: string | null, sortBy: string): Promise<IManager[] | null>{
        let order: 1 | -1 | null
        if(sortOrder === "asc"){
            order = 1
        }else if(sortOrder === "des"){
            order = -1
        }else{
            order = null
        }
        let sortby
        if(sortBy === "Email"){
            sortby = "email"
        }else if(sortBy === "Name"){
            sortby = "name"
        }else if(sortBy === "Phone Number" ){
            sortby = "phone"
        }else if(sortBy === "Make-Changes"){
            sortby = "active"
        }else{
            sortby = ''
        }
        const managerDetails = await this.managerRepositary.searchSortManagerDetails(searchInput, order, sortby)
        if(managerDetails && managerDetails?.length < 1) throw ErrorResponse.badRequest("Manager Details not found")
        
        return managerDetails
    }

    async changeManagerStatus(managerId: string): Promise<boolean>{
        // fetching manager details from mongodb
        const managerDetails = await this.managerRepositary.getOne<IManager>({_id: managerId})
        // throwing an errro if couldnt find
        if(!managerDetails) throw ErrorResponse.badRequest('No manager Found')
        const {email: managerEmail, active: status} = managerDetails
        const resortId:unknown = managerDetails.resortId

        // blocking all manager first so only one manager stays active at the end
        await this.managerRepositary.blockingAllExistingMangerOfResort(resortId as string)
        
        // returning with true since all manager have been blocked
        if(status){
            // updating the resort manager status
            const updateResort = await this.resortRepositary.deleteManager(resortId as string)
            if(updateResort.modifiedCount === 0) throw ErrorResponse.internalError('Failed to update Resort Manager field')
            return true
        }
        
        // changing the status to true if status is aldready false
        const updateManagerResponse = await this.managerRepositary.updateManagerStatus(resortId as string, managerEmail)
        
        // throwing error if failed to update manager status
        if(updateManagerResponse.modifiedCount === 0) throw ErrorResponse.internalError('Failed to update Manager Status')

        // Updating the resort by adding the active manager
        const managerDetail = await this.managerRepositary.getOne<IManager>({email: managerEmail})
        const updateResort = await this.resortRepositary.addManger(resortId as string, managerDetail?._id as string)
        if(updateResort.modifiedCount === 0) throw ErrorResponse.internalError('Failed to update Resort Manager field')
        // return true after everything is done
        return true

    }

    async createManager(signupDetails: IManager): Promise<IManager | null>{
        const resortId: unknown = signupDetails.resortId

        // signing up the manager first
        const managerDetails = await authService.signup("manager",signupDetails)
 
        // changing the status to false of all managers
        const blockResponse = await this.managerRepositary.blockingAllExistingMangerOfResort(resortId as string)

        // throwing error if any fail occur in updating the status
        if(blockResponse.matchedCount && !blockResponse.modifiedCount) throw ErrorResponse.internalError('Failed to update the status of managers')

        // updating the status of current manager to active
        const updateManagerStatus = await this.managerRepositary.updateManagerStatus(resortId as string, managerDetails.email)

        // throwing error if failed to do so
        if( updateManagerStatus.modifiedCount < 1) throw ErrorResponse.internalError("Manager Status not updated")

        // checking the count of the manager of resorts
        const managerCountOfSingleResort = await this.managerRepositary.getAll({resortId: resortId , active: true})

        // throwing error if active manager count is trying to exeed 1
        if(managerCountOfSingleResort.length > 1) {
            // deleting the existing resortmanager
            const deletResortManagerResponse = await this.resortRepositary.deleteManager(resortId as string)

            // throwing error if failed to delete the resort manager
            if(deletResortManagerResponse.modifiedCount === 0) throw ErrorResponse.internalError('Failed to delete Resort Manager')

            // changing all the managers of that resortd to inactive
            await this.managerRepositary.blockingAllExistingMangerOfResort(resortId as string)

            // throwing error if more than one active manager found
            throw ErrorResponse.badRequest("Changed all manager status to inactive due to server error")
        }
        // updating the resort with managerid
        const updateResortResponse = await this.resortRepositary.addManger(resortId as string, managerDetails._id!)

        // throwing error if resort not updated
        if(updateResortResponse.modifiedCount < 1) throw ErrorResponse.internalError('Resort Not updated with managerId')
        return managerDetails
    }

    
}
