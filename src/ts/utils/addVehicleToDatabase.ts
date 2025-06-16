import { addVehicleBlock } from "../components/addVehicleBlock";
import { VehicleDTO } from "../dto/VehicleDTO";
import type { Car } from "../models/Car";
import { Category } from "../models/Category";
import { Vehicle } from "../models/Vehicle";
import { FirebaseService } from "../service/FirebaseService";


export function addVehicleToDatabase(): void {
    const addVehicleForm = document.getElementById("addVehicleForm") as HTMLFormElement;
    if (!addVehicleForm) {
        console.error("Форма не знайдена");
        return;
    }
    addVehicleForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(addVehicleForm);
        const type: Category = formData.get("vechicle-type") as Category;
        const plateNumber: string = formData.get("plate-number")?.toString().trim() || "";
        const dateOfStartRental: Date = new Date(formData.get("date-of-start-rental") as string);
        const rentalDuration: number = parseInt(formData.get("rental-duration") as string, 10);
        const price: number = parseFloat(formData.get("price-rental") as string);
    
        const selectedCarId = (formData.get("car") as string)?.trim();
        if (!selectedCarId) {
            console.warn("ID автомобіля не вибрано.");
            return;
        }
    
        let carDb: Car | null = null;
        try {
            carDb = await FirebaseService.getCarById(selectedCarId) as Car;
            carDb.setId = selectedCarId; 
            if (!carDb) {
                console.warn("Автомобіль не знайдено за ID:", selectedCarId);
                return;
            }
        } catch (error) {
            console.error("Помилка при завантаженні автомобіля:", error);
            return;
        }
    
        if (!type || !carDb || !plateNumber || isNaN(rentalDuration) || !dateOfStartRental || isNaN(price)) {
            console.warn("Будь ласка, заповніть усі поля коректно.");
            return;
        }
    
        const newVehicleDto: VehicleDTO = new VehicleDTO(carDb, type, plateNumber, dateOfStartRental, rentalDuration, price);
        const newVehicle: Vehicle = new Vehicle(newVehicleDto);
    
        try {
            await FirebaseService.addVehicle(newVehicle);
            console.log("Транспортний засіб успішно додано:", newVehicle);
            addVehicleBlock(newVehicle);
            addVehicleForm.reset();
            
        } catch (error) {
            console.error("Помилка при додаванні транспортного засобу:", error);
        }
    });
}

export async function readVehicleFormData(form: HTMLFormElement): Promise<VehicleDTO | null> {
  const formData = new FormData(form);

  const categoryValue = formData.get('vechicle-type')?.toString().trim() || "";
  const plateNumber = formData.get('plate-number')?.toString().trim() || "";
  const startDateStr = formData.get('date-of-start-rental')?.toString().trim() || "";
  const rentalDurationStr = formData.get('rental-duration')?.toString().trim() || "";
  const priceStr = formData.get('price-rental')?.toString().trim() || "";
  const carId = formData.get('car')?.toString().trim() || ""; // ID машины

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const rentalDuration = parseInt(rentalDurationStr, 10);
  const price = parseFloat(priceStr);

  if (!(categoryValue in Category)) {
    console.warn("Невірна категорія.");
    return null;
  }

  if(!startDate){
    console.warn("Дата початку прокату не може бути порожньою.");
  }
  if(!rentalDuration || rentalDuration < 1){
    console.warn("Тривалість прокату повинна бути більше нуля.");
    return null;
  }
    if(isNaN(price) || price < 0){
        console.warn("Ціна повинна бути числом і більше нуля.");
        return null;
    }

  const category = Category[categoryValue as keyof typeof Category];

  if (!plateNumber || !startDate || isNaN(rentalDuration) || isNaN(price) || !carId) {
    console.warn("Будь ласка, заповніть усі поля коректно.");
    return null;
  }

  const car = await FirebaseService.getCarById(carId) as Car;
  car.setId = carId; 

if (!car) {
  console.warn("Автомобіль не знайдено за ID:", carId);
  return null;
}

return new VehicleDTO(car, category, plateNumber, startDate, rentalDuration, price);
}

 