import { addCarBlock } from "../components/addCarBlock";
import { CarDTO } from "../dto/CarDTO";
import { Car } from "../models/Car";
import { FirebaseService } from "../service/FirebaseService";


export function addCarToDatabase(): void {
    const addCarForm = document.getElementById('addCarForm') as HTMLFormElement;
    const dialog = document.getElementById('addCarDialog') as HTMLDialogElement;
  
    if (!addCarForm || !dialog) {
      console.error('Форма або діалог не знайдені.');
      return;
    }
  
    addCarForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(addCarForm);
      const brand = formData.get('brand')?.toString().trim() || "";
      const model = formData.get('model')?.toString().trim() || "";
      const price = parseFloat(formData.get('price') as string);
      const year = parseInt(formData.get('year') as string, 10);
  
      if (!brand || !model || isNaN(price) || isNaN(year)) {
        console.warn("Будь ласка, заповніть усі поля коректно.");
        return;
      }
  
      const newCarDTO: CarDTO = new CarDTO(brand, model, price, year);
      const newCar: Car = new Car(newCarDTO);
  
      try {
        await FirebaseService.addCar(newCar);
        console.log("Автомобіль успішно додано:", newCar);
        addCarBlock(newCar); // Додаємо блок на сторінку
        addCarForm.reset();
        dialog.close(); // Закриваємо діалог після додавання
      } catch (error) {
        console.error("Помилка при додаванні автомобіля:", error);
      }
    });
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