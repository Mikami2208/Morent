import { Car } from "../models/Car";
import { Vehicle } from "../models/Vehicle";
import { Rental } from "../models/Rental";
import { CarDTO } from "../dto/CarDTO";
import { VehicleDTO } from "../dto/VehicleDTO";
import { RentalDTO } from "../dto/RentalDTO";
import { FirebaseService } from "../service/FirebaseService";

type SupportedModels = "cars" | "vehicles" | "rentals";

export class ModelFactory {
    static async create(collectionName: SupportedModels, data: any): Promise<Car | Vehicle | Rental> {
        switch (collectionName) {
            case "cars":
                const carDTO = new CarDTO(data.brand, data.model, data.price, data.year);
                const car = new Car(carDTO);
                car.setId = data.id;
                return car;

            case "vehicles":
                const vehicleCar: Car = await FirebaseService.getCarById(data.car) as Car;
                const startDate = data.startDate?.toDate?.() ?? new Date(data.startDate);
                if (isNaN(startDate.getTime())) {
                    console.error("Некоректна дата startDate:", data.startDate);
                    throw new Error("Некоректна дата початку оренди в об'єкті vehicle");
                }

                const vehicleDTO = new VehicleDTO(
                    vehicleCar,
                    data.category,
                    data.plateNumber,
                    startDate,
                    data.rentalDuration,
                    data.price
                );
                const vehicle = new Vehicle(vehicleDTO);
                vehicle.setId = data.id;
                return vehicle;

            case "rentals":

            default:
                throw new Error(`Unsupported collection type: ${collectionName}`);
        }
    }
}
