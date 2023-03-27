import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../error/errorResponse";
import RestaurantService from "../../services/restaurant.service";

const restaurantService = new RestaurantService();

export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, heading, description, feature, image } = req.body;
  try {
    const result = await restaurantService.createRestaurant(name, heading, description, feature, image);
    res.send({ message: "New restaurant created", data: result });
  } catch (error: any) {
    return next(error);
  }
};
