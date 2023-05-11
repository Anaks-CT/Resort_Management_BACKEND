import expressAsyncHandler from "express-async-handler";
import BookingService from "../../services/booking.service";
import UserService from "../../services/user.service";
import RoomService from "../../services/room.service";
import { RequestWithUser } from "../../middlewares/auth-middlewares";
import ManagerService from "../../services/manager.service";

const bookingService = new BookingService();
const userService = new UserService();
const roomService = new RoomService();
const managerService = new ManagerService()

export const getManagerDashboardDetails = expressAsyncHandler(
    async (req: RequestWithUser, res) => {
        const {_id: managerId} = req.user
        const managerDetail = await managerService.getManagerById(managerId)
        const [roomOccupancy, totalUser, totalBooking, resortRevenue, monthlyRevenue] =
        await Promise.all([
                roomService.calculateResortRoomOccupancyRate(managerDetail.resortId.toString()),
                userService.getNumberOfUsers(),
                bookingService.getBookingCounts(managerDetail.resortId.toString()),
                bookingService.getResortRevenue(managerDetail.resortId.toString()),
                bookingService.getMonthlyRevenue(managerDetail.resortId.toString()),
            ]);

        res.json({
            message: "Dashboard details fetched successfully",
            roomOccupancy,
            totalUser,
            totalBooking,
            resortRevenue: resortRevenue[0]?.totalRevenue,
            monthlyRevenue
        });
    }
);