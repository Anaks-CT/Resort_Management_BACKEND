import { Query } from "mongoose";
import { instance } from "../config/razorpay";
import ErrorResponse from "../error/errorResponse";
import { IBooking, RevenueReport } from "../interface/booking.interface";
import { IRoom } from "../interface/room.interface";
import { IUser } from "../interface/user.interface";
import BookingRepositary from "../repositories/booking.repositary";
import RoomRespositary from "../repositories/room.repositary";
import UserRepository from "../repositories/user.repository";
import crypto from "crypto";
import { IResort } from "../interface/resort.interface";

export default class BookingService {
    constructor(
        private bookingRepositary = new BookingRepositary(),
        private userRepositary = new UserRepository(),
        private roomRepositary = new RoomRespositary()
    ) {}

    async createBooking(
        userId: string,
        resortId: string,
        date: any,
        stayDetails: any[],
        roomNumberIds: string[],
        userType: "member" | "platinum" | "diamond",
        userPoints?: number
    ) {
        console.log(roomNumberIds);
        const user = await this.userRepositary.getOne<IUser>({ _id: userId });
        if (!user)
            throw ErrorResponse.unauthorized(
                "Authorization Error. Please try again later"
            );
        let roomDetails;
        let bookingDetail: IBooking;
        let userPointsLeft: number | undefined;
        await Promise.all(
            stayDetails.map((singleDetails, i) => {
                let roomNumber;
                return this.roomRepositary
                    .getOne<IRoom>({
                        _id: singleDetails.roomId,
                        "packages._id": singleDetails.packageId,
                    })
                    .then((res) => {
                        if (!res)
                            throw ErrorResponse.notFound(
                                "Cannot find room Details"
                            );
                        const packageDetails = res.packages.find(
                            (pkg) =>
                                pkg._id.toString() ===
                                singleDetails.packageId.toString()
                        );
                        if (!packageDetails)
                            throw ErrorResponse.notFound(
                                "Cannot find package details"
                            );
                        // how can i get the details of the packge i have id with
                        const room = res.roomNumbers.filter((num) => {
                            console.log(num._id, roomNumberIds[i]);
                            return (
                                num._id?.toString() ==
                                roomNumberIds[i].toString()
                            );
                        });
                        roomNumber = room && room[0].number;
                        let packageCost;
                        if (userType === "platinum") {
                            packageCost = Math.floor(
                                packageDetails.cost -
                                    (packageDetails.cost * 5) / 100
                            );
                        } else if (userType === "diamond") {
                            packageCost = Math.floor(
                                packageDetails.cost -
                                    (packageDetails.cost * 15) / 100
                            );
                        } else {
                            packageCost = Math.floor(packageDetails.cost);
                        }
                        return {
                            roomTypeId: res?._id,
                            roomName: res?.name,
                            roomNumber,
                            roomId: room && room[0]._id,
                            packagename: packageDetails?.packageName,
                            packageCost,
                        };
                    })
                    .catch(() => {
                        throw ErrorResponse.notFound(
                            "cannot find Room Details"
                        );
                    });
            })
        ).then((result) => {
            roomDetails = result;
            const totalRoomCost = result.reduce(
                (acc, item) => (acc += item.packageCost),
                0
            );
            const taxCost = Math.floor((totalRoomCost * 22) / 100);
            const currentTotal = totalRoomCost + taxCost;
            let totalCost: number;
            let remainingUserPoints: number | undefined;
            if (userPoints) {
                if (
                    currentTotal < userPoints ||
                    userPoints > currentTotal - 1000
                ) {
                    totalCost = 1000;
                    remainingUserPoints = userPoints - currentTotal;
                } else {
                    totalCost = currentTotal - userPoints;
                    remainingUserPoints = 0;
                }
            } else {
                totalCost = currentTotal;
            }
            const amount = {
                totalRoomCost,
                taxCost,
                pointsUsed:
                    userPoints &&
                    remainingUserPoints &&
                    (userPoints > remainingUserPoints
                        ? userPoints - remainingUserPoints
                        : remainingUserPoints - userPoints),
                totalCost,
            };
            const newBookingDetails: any = {
                userId: userId,
                resortId: resortId,
                checkInDate: date.startDate,
                checkOutDate: date.endDate,
                roomDetail: roomDetails,
                amount: amount,
            };
            userPointsLeft = remainingUserPoints;
            return this.bookingRepositary
                .create<IBooking>(newBookingDetails)
                .then((res) => (bookingDetail = res as IBooking));
        });
        return { ...bookingDetail!, userPointsLeft };
    }

    async deleteBooking(bookingId: string) {
        const bookingDetails = await this.bookingRepositary.getOne<IBooking>({
            _id: bookingId,
        });
        if (!bookingDetails)
            throw ErrorResponse.internalError(
                "Cannot find the booknig details"
            );
        if (!bookingDetails.paymentSuccess) {
            await this.bookingRepositary.deleteById(bookingId);
            return true;
        }
        return false;
    }

    async cancelBooking(bookingId: string) {
        const bookingDetails = await this.bookingRepositary.getOne<IBooking>({
            _id: bookingId,
        });
        if (!bookingDetails)
            throw ErrorResponse.internalError(
                "Cannot find the booknig details"
            );
        if (!bookingDetails.status)
            throw ErrorResponse.conflict("Booking is already canceled");
        const { modifiedCount } =
            await this.bookingRepositary.cancelbookingStatus(bookingId);
        if (modifiedCount === 0)
            throw ErrorResponse.internalError(
                "Couldn't cancel booking, please contact TRINITY helping desk"
            );
        return bookingDetails;
    }

    async initializePayment(totalAmount: number) {
        const receiptId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // random reciept id generating
        const options = {
            amount: Math.floor(totalAmount * 100), // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${receiptId}`,
            payment_capture: 1,
        };

        const order = await instance.orders.create(options);
        if (!order) throw new Error("something went wrong");
        return order;
    }

    async verifyPayment(
        orderCreationId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
        bookingId: string
    ) {
        const signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
            .update(`${orderCreationId}|${razorpayPaymentId}`)
            .digest("hex");

        if (signature !== razorpaySignature) {
            throw ErrorResponse.badRequest("Transcation is not legit");
        }
        const updateResult = await this.bookingRepositary.updateBookingPayment(
            bookingId
        );
        if (updateResult.modifiedCount === 0)
            throw ErrorResponse.internalError(
                "An Error occured, if your money is been debited, please contact us"
            );
    }

    async getBookingById(bookingId: string) {
        const bookingDetails = await this.bookingRepositary.getById<IBooking>(
            bookingId
        );
        if (!bookingDetails)
            throw ErrorResponse.notFound("Cannot find booking details");
        return bookingDetails;
    }

    async searchSortBookingService(
        resortId: string,
        searchInput: string,
        sortBy: string,
        sortOrder: string
    ) {
        const bookingDetails = await this.bookingRepositary.getAll<IBooking>({
            resortId,
        });
        if (!bookingDetails)
            throw ErrorResponse.notFound("Cannot find booking details");
        let sortByValue: string | null;
        switch (sortBy) {
            case "Booking Date":
                sortByValue = "BookingDate";
                break;
            case "CheckIn Date":
                sortByValue = "checkInDate";
                break;
            case "CheckOut Date":
                sortByValue = "checkOutDate";
                break;
            case "Status":
                sortByValue = "status";
                break;
            case "Amount":
                sortByValue = "amount.totalCost";
                break;
            default:
                sortByValue = null;
                break;
        }
        let sortingOrder: 1 | -1 | null;
        switch (sortOrder) {
            case "asc":
                sortingOrder = 1;
                break;
            case "des":
                sortingOrder = -1;
                break;
            default:
                sortingOrder = null;
                break;
        }

        const searchSortedBookingDetails =
            await this.bookingRepositary.searchSortService(
                resortId,
                sortingOrder,
                sortByValue
            );
        const resortPopulated = await this.bookingRepositary.populate(
            searchSortedBookingDetails,
            "resortId"
        );
        const userPopulated = await this.bookingRepositary.populate(
            resortPopulated,
            "userId"
        );
        return userPopulated.map(
            ({
                _doc: {
                    paymentSuccess,
                    resortId: {
                        resortDetails: { name: resortName },
                    },
                    userId: { name, phone, email },
                    ...rest
                },
            }) => ({ ...rest, resortName, name, phone, email })
        );
    }

    async getResortRevenue(resortId?: string){
        return await this.bookingRepositary.resortRevenue(resortId && resortId)
    }

    async getMonthlyRevenue(resortId?: string) {
        const bookingDetail =
            await this.bookingRepositary.getMonthlyRevenue(resortId && resortId);
        const yearMonths = Array.from({ length: 12 }, (_, i) =>
            String(i + 1).padStart(2, "0")
        );
        console.log(bookingDetail);

        if (!bookingDetail)
            throw ErrorResponse.internalError(
                "Cannot find booking details, please try again"
            );

        const convertedReport: RevenueReport[] = yearMonths.reduce<
            RevenueReport[]
        >((acc, month) => {
            const existingReport = bookingDetail.find((report) =>
                report._id.endsWith(`-${month}`)
            );
            acc.push(
                existingReport || {
                    _id: `2023-${month}`,
                    totalBookings: 0,
                    totalRevenue: 0,
                }
            );
            return acc;
        }, []);

        if (convertedReport.length !== 12)
            throw ErrorResponse.internalError(
                "couln't process booking details, please try again later"
            );

        return convertedReport;
    }

    async getBookingCounts(resortId?: string){
        if(resortId){
            const resort = this.bookingRepositary.getAll<IResort>({resortId})
            return (await resort).length
        }
        return await this.bookingRepositary.count()
    }



    async getBookingDetailsbyId(id: string, field: "user" | "resort") {
        const bookingDetails = await this.bookingRepositary.getAll<IBooking>(
            {
                [field === "resort" ? "resortId" : "userId"]: id,
                paymentSuccess: true,
            },
            { createdAt: -1 }
        );
        if (!bookingDetails)
            throw ErrorResponse.notFound(
                "Cannot find Bookings, Please try again later"
            );
        const resortPopulated = await this.bookingRepositary.populate(
            bookingDetails,
            "resortId"
        );
        const userPopulated = await this.bookingRepositary.populate(
            resortPopulated,
            "userId"
        );
        return userPopulated.map(
            ({
                _doc: {
                    paymentSuccess,
                    resortId: {
                        resortDetails: { name: resortName },
                    },
                    userId: { name, phone, email },
                    ...rest
                },
            }) => ({ ...rest, resortName, name, phone, email })
        );
    }
}
