import { CarDTO } from "../dto/CarDTO";
import { DialogManager } from "../managers/DialogManager";
import { Car } from "../models/Car";
import { FirebaseService } from "../service/FirebaseService";
import { readCarFormData } from "../utils/addCarToDatabase";
import { createCarID } from "../utils/createCarID";

/**
 * Створює HTML-блок автомобіля і додає його до DOM
 */
export function addCarBlock(car: Car): void {
  const carsList = document.querySelector(".cars__cars-list") as HTMLDivElement;
  if (!carsList) return;

  const block = document.createElement("div");
  block.classList.add("cars__info-block");
  block.id = car.getId;

  block.innerHTML = `
    <div class="cars__info">
      <p>Марка: ${car.getBrand}</p>
      <p>Модель: ${car.getModel}</p>
      <p>Ціна: ${car.getPrice} $</p>
      <p>Рік: ${car.getYear}</p>
    </div>
    <div class="cars__buttons">
      <button class="general-button delete-btn">Видалити</button>
      <button class="general-button edit-btn">Редагувати</button>
    </div>
  `;

  // Обробка кнопок
  const deleteBtn = block.querySelector(".delete-btn") as HTMLButtonElement;
  const editBtn = block.querySelector(".edit-btn") as HTMLButtonElement;

   deleteBtn.addEventListener("click", () => {
    FirebaseService.deleteCar(car.getId)
      .then(() => block.remove())
      .catch((err) => console.error("Помилка видалення:", err));
  });

  editBtn.addEventListener("click", () => {
    const dialog: DialogManager = new DialogManager("editCarDialog");
    dialog.openDialog();
    const form = document.getElementById("editCarForm") as HTMLFormElement;
    if (!form) return;
  
    (document.getElementById("editBrand") as HTMLInputElement).value = car.getBrand;
    (document.getElementById("editModel") as HTMLInputElement).value = car.getModel;
    (document.getElementById("editYear") as HTMLInputElement).value = car.getYear.toString();
    (document.getElementById("editPrice") as HTMLInputElement).value = car.getPrice.toString();

    form.onsubmit = async (event) => {
        const carDTO: CarDTO | null = readCarFormData(form);
        if (!carDTO) {
          console.warn("Будь ласка, заповніть усі поля коректно.");
          return;
        }
        event.preventDefault();
        const updatedCar: Car = new Car(carDTO);
        updatedCar.setId = car.getId
        const newId = createCarID(updatedCar.getBrand, updatedCar.getModel, updatedCar.getYear);
        await FirebaseService.setCar(updatedCar, car.getId, newId)
          .then(() => {
            block.remove();
            addCarBlock(updatedCar); 
            dialog.closeDialog(); 
          })
          .catch((err) => console.error("Помилка оновлення:", err));
    }
  });

  carsList.appendChild(block);
}
