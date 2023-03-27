import bcrypt from "bcrypt";
import ErrorResponse from "../error/errorResponse";
import { IRestaurant } from "../interface/restaurant.interface";
import RestaurantRepositary from "../repositories/restaurant.repositary";

class RestaurantService {
    constructor(private restaurantRepositary = new RestaurantRepositary()) {}

    async createRestaurant(
        name: string,
        heading: string,
        description: string,
        feature: string[],
        image: string
    ): Promise<IRestaurant> {
        const createRestaurant =
            await this.restaurantRepositary.createRestaurant(
                name,
                heading,
                description,
                feature,
                image
            );
        if (!createRestaurant)
            throw ErrorResponse.internalError("Restaurant not created");
        return createRestaurant;
    }
}

// const token = jwt.sign({ id: user._id }, config.jwtSecret);

export default RestaurantService;
