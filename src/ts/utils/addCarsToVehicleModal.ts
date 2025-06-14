import type { Car } from "../models/Car";
import { FirebaseService } from "../service/FirebaseService";
import { addChoicesOption } from "../components/initChoiceJS";


export async function addCarsToVehicleModalFromDB(): Promise<void> {
  try {
    const cars: Car[] = await FirebaseService.getElementsByCollectionName("cars") as Car[];

    if (!cars.length) {
      console.warn("Жодного автомобіля не знайдено у базі даних.");
      return;
    }

    console.log("Автомобілі з бази даних:", cars);

    cars.forEach(car => {
      addChoicesOption("carSelect", car.getId, car.toString());
      addChoicesOption("carSelectEdit", car.getId, car.toString());
    });

  } catch (error) {
    console.error("Помилка під час завантаження автомобілів у модальне вікно:", error);
  }
}



