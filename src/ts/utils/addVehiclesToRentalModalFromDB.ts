import type { Vehicle } from "../models/Vehicle";
import { FirebaseService } from "../service/FirebaseService";
import { addChoicesOption } from "../components/initChoiceJS";

export async function addVehiclesToRentalModalFromDB(): Promise<void> {
  try {
    const vehicles: Vehicle[] = await FirebaseService.getElementsByCollectionName("vehicles") as Vehicle[];

    if (!vehicles.length) {
      console.warn("Жодного транспортного засобу не знайдено у базі даних.");
      return;
    }

    console.log("Транспортні засоби з бази даних:", vehicles);

    vehicles.forEach(vehicle => {
      addChoicesOption("tzSelect", vehicle.getId, vehicle.toString());
      addChoicesOption("editTzSelect", vehicle.getId, vehicle.toString());
    });

  } catch (error) {
    console.error("Помилка під час завантаження транспортних засобів у модальне вікно:", error);
  }
}
