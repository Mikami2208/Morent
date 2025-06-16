import type { Vehicle } from "../models/Vehicle";
import { FirebaseService } from "../service/FirebaseService";
import { addChoicesOption, getChoicesInstance } from "../components/initChoiceJS";
import { Category } from "../models/Category";
import type { Car } from "../models/Car";
import { VehicleDTO } from "../dto/VehicleDTO";
import { renderVehicleBlock } from "../service/vehicleService";

export async function addAllVehiclesToPageFromDB(): Promise<void> {
  try {
    const vehicles: Vehicle[] = await FirebaseService.getElementsByCollectionName("vehicles") as Vehicle[];

    if (!vehicles.length) {
      console.warn("Жодного транспортного засобу не знайдено у базі даних.");
      return;
    }

    console.log("Транспортні засоби з бази даних:", vehicles);

    vehicles.forEach(vehicle => {
      renderVehicleBlock(vehicle);
    });

  } catch (error) {
    console.error("Помилка під час завантаження транспортних засобів у модальне вікно:", error);
  }
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
  
  /**
 * Додає транспортний засіб у селект модального вікна "Додати прокат"
 * @param vehicleId - унікальний ідентифікатор ТЗ
 * @param vehicleInfo - опис для відображення в select (наприклад, "Ford Transit, 2020")
 */
export function addVehicleToRentModal(vehicleId: string, vehicleInfo: string): void {
    const selectElement = document.getElementById("tzSelect") as HTMLSelectElement;
    const selectElementEdit = document.getElementById("editTzSelect") as HTMLSelectElement;
    if (!selectElement) {
      console.error("Select element with ID 'tzSelect' not found.");
      return;
    }
  
    addChoicesOption("tzSelect", vehicleId, vehicleInfo);
    addChoicesOption("editTzSelect", vehicleId, vehicleInfo);
    console.log("Vehicle added to Rent modal:", vehicleId, vehicleInfo);
  }
  
  export function removeVehicleFromRentModal(vehicleId: string): void {
      const instance = getChoicesInstance("tzSelect");
      if (!instance) {
        console.error("Choices instance for 'tzSelect' not found.");
        return;
      }
    
      const choiceToRemove = instance._store.choices.find(choice => choice.value === vehicleId);
      if (choiceToRemove) {
        instance.removeChoice(choiceToRemove.value);
        console.log(`Vehicle with ID ${vehicleId} removed from Rent modal.`);
      } else {
        console.warn(`Choice with value ${vehicleId} not found in tzSelect.`);
      }
    }
    
    export function createVehicleID(plateNumber: string, startDate: Date, rentalDuration: number): string {
        const datePart = startDate.toISOString().split('T')[0].replace(/-/g, '');
        const durationPart = rentalDuration.toString().padStart(3, '0');
        const platePart = plateNumber.replace(/\s+/g, '').toUpperCase();
        const currentDate = new Date();
        const timestamp = [
            currentDate.getFullYear(),
            (currentDate.getMonth() + 1).toString().padStart(2, '0'),
            currentDate.getDate().toString().padStart(2, '0'),
            currentDate.getHours().toString().padStart(2, '0'),
            currentDate.getMinutes().toString().padStart(2, '0'),
            currentDate.getSeconds().toString().padStart(2, '0')
        ].join('')
        
        return `${datePart}-${durationPart}-${platePart}-t${timestamp}`;
    }