import type { Car } from "../models/Car";
import { FirebaseService } from "../service/FirebaseService";
import { addChoicesOption } from "../components/initChoiceJS";
import { CarDTO } from "../dto/CarDTO";
import { getChoicesInstance } from "../components/initChoiceJS";
import { renderCarBlock } from "../service/carService";


export async function addAllCarsToPageFromDB(): Promise<void> {
  try {
    const cars: Car[] = await FirebaseService.getElementsByCollectionName("cars") as Car[];

    if (!cars.length) {
      console.warn("Жодного автомобіля не знайдено у базі даних.");
      return;
    }

    console.log("Автомобілі з бази даних:", cars);

    cars.forEach(car => {
      renderCarBlock(car)
    });

  } catch (error) {
    console.error("Помилка під час завантаження автомобілів у модальне вікно:", error);
  }
}



export function readCarFormData(form: HTMLFormElement): CarDTO | null {
    const formData = new FormData(form);
    const brand = formData.get('brand')?.toString().trim() || "";
    const model = formData.get('model')?.toString().trim() || "";
    const price = parseFloat(formData.get('price') as string);
    const year = parseInt(formData.get('year') as string, 10);

    if (!brand || !model || isNaN(price) || isNaN(year)) {
      console.warn("Будь ласка, заповніть усі поля коректно.");
      return null;
    }

    return new CarDTO(brand, model, price, year);
  }


export function addCarToVehicleModal(carId: string, carInfo: string){
    const addCarSelect = document.getElementById("carSelect") as HTMLSelectElement;
    const addCarSelectEdit = document.getElementById("carSelectEdit") as HTMLSelectElement;
    if (!addCarSelect || !addCarSelectEdit) {
        console.error("Select element not found");
        return;
    }
        addChoicesOption("carSelect", carId, carInfo);
        addChoicesOption("carSelectEdit", carId, carInfo);
        console.log("Car added to modal:", carId, carInfo, carInfo);

}


export function removeCarFromVehicleModal(carId: string): void {
  const selectElement = document.getElementById("carSelect") as HTMLSelectElement;
  const addCarSelectEdit = document.getElementById("carSelectEdit") as HTMLSelectElement;
  if (!selectElement || !addCarSelectEdit) {
    console.error("Select element with ID 'carSelect' or 'carSelectEdit' not found.");
    return;
  }

const instance = getChoicesInstance("carSelect");
const instanceEdit = getChoicesInstance("carSelectEdit");
if (!instance || !instanceEdit) {
    console.error("Choices instance for 'carSelect' or 'carSelectEdit' not found.");
    return;
}


const choiceToRemove = instance._store.choices.find(choice => choice.value === carId);
const choiceToRemoveEdit = instanceEdit._store.choices.find(choice => choice.value === carId);
if (choiceToRemove && choiceToRemoveEdit) {
    instance.removeChoice(choiceToRemove.value); 
    instanceEdit.removeChoice(choiceToRemoveEdit.value); 
    console.log(`Car with ID ${carId} removed from modal.`);
} else {
    console.warn(`Choice with value ${carId} not found in Choices instance.`);
}
}



export function createCarID(brand: string, model: string, year: number): string {
    if (!brand || !model || year < 1920 || year > new Date().getFullYear()) {
        throw new Error("Invalid car details provided");
    }

    const formattedBrand = brand.toLowerCase().replace(/\s+/g, '');
    const formattedModel = model.toLowerCase().replace(/\s+/g, '');
    const formattedYear = year.toString();
    const currentDate = new Date();
    const timestamp = [
        currentDate.getFullYear(),
        (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        currentDate.getDate().toString().padStart(2, '0'),
        currentDate.getHours().toString().padStart(2, '0'),
        currentDate.getMinutes().toString().padStart(2, '0'),
        currentDate.getSeconds().toString().padStart(2, '0')
    ].join('')

    return `${formattedBrand}-${formattedModel}-${formattedYear}-${timestamp}`;
}