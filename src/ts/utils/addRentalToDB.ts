
import { FirebaseService } from "../service/FirebaseService";
import { RentalDTO } from "../dto/RentalDTO";
import { Rental } from "../models/Rental";
import { Vehicle } from "../models/Vehicle";
import { VehicleDTO } from "../dto/VehicleDTO";
import { addRentalBlock } from "../components/addRentalBlock";

export function addRentalToDatabase(): void {
    const rentalForm = document.querySelector("#addRentDialog form") as HTMLFormElement;
    if (!rentalForm) {
        console.error("Форма прокату не знайдена");
        return;
    }

    rentalForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(rentalForm);
        const companyName = formData.get("companyName")?.toString().trim();
        const vehicleId = formData.get("tz-select")?.toString().trim();

        if (!companyName || !vehicleId) {
            console.warn("Заповніть усі поля форми прокату.");
            return;
        }

        let vehicle: Vehicle | null = null;
        try {
            vehicle = await FirebaseService.getVehicleById(vehicleId) as Vehicle;
            if (!vehicle) {
                console.error("Транспортний засіб не знайдено за ID:", vehicleId);
                return;
            }
        } catch (error) {
            console.error("Помилка при отриманні транспорту:", error);
            return;
        }

        const vehicleDto = new VehicleDTO(vehicle.getCar, vehicle.getCategory, vehicle.getPlateNumber, vehicle.getStartDate, vehicle.getRentalDuration, vehicle.getPrice);
        const rentalDto = new RentalDTO(companyName, [vehicleDto]);
        let rental: Rental;

        try {
            rental = new Rental(rentalDto);
        } catch (error) {
            console.error("Помилка створення об'єкта Rental:", error);
            return;
        }

        try {
            await FirebaseService.addRental(rental);
            console.log("Прокат додано успішно:", rental);
            addRentalBlock(rental);
            rentalForm.reset();
        } catch (error) {
            console.error("Помилка при додаванні прокату:", error);
        }
    });
}
