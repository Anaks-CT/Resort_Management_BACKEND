import expressAsyncHandler from "express-async-handler";
import BookingService from "../../services/booking.service";
import UserService from "../../services/user.service";
import ResortService from "../../services/resort.service";
import RoomService from "../../services/room.service";

const bookingService = new BookingService();
const userService = new UserService();
const resortService = new ResortService();
const roomService = new RoomService();

export const getAdminDashboardDetails = expressAsyncHandler(
    async (req, res) => {
        const [
            bookingDetails,
            revenueDetails,
            totalUsers,
            totalBooking,
            totalResort,
            resorts,
        ] = await Promise.all([
            bookingService.getMonthlyRevenue(),
            bookingService.getResortRevenue(),
            userService.getNumberOfUsers(),
            bookingService.getBookingCounts(),
            resortService.getResortCount(),
            resortService.allResortDetails(),
        ]);

        res.status(200).json({
            message: "Dashboard details fetched succesfully",
            bookingRevenue: bookingDetails,
            resortRevenue: revenueDetails,
            userCount: totalUsers,
            bookingCount: totalBooking,
            resortCount: totalResort,
            allResorts: resorts?.map((item) => item.resortDetails.name),
        });
    }
);

export const getResortDashboardDetails = expressAsyncHandler(
    async (req, res) => {
        const { id: resortId } = req.params;

        const [roomOccupancy, totalUser, totalBooking, resortRevenue, monthlyRevenue] =
            await Promise.all([
                roomService.calculateResortRoomOccupancyRate(resortId),
                userService.getNumberOfUsers(),
                bookingService.getBookingCounts(resortId),
                bookingService.getResortRevenue(resortId),
                bookingService.getMonthlyRevenue(resortId),
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
