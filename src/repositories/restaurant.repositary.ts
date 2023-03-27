import { IRestaurant } from "../interface/restaurant.interface";
import restaurantModel from "../models/restaurant.model";

class RestaurantRepositary {
  async createRestaurant(
    name: string,
    heading: string,
    description: string,
    feature: string[],
    image: string
  ): Promise<IRestaurant> {

    const createRestaurant = new restaurantModel({
        name: name,
        heading: heading,
        description: description,
        feature: feature,
        image: image
    })
    await createRestaurant.save()
    return createRestaurant.toJSON() as IRestaurant
  }

}

export default RestaurantRepositary;
