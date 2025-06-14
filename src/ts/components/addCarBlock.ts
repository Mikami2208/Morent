import { CarDTO } from "../dto/CarDTO";
import { DialogManager } from "../managers/DialogManager";
import { Car } from "../models/Car";
import { FirebaseService } from "../service/FirebaseService";
import { readCarFormData } from "../utils/addCarToDatabase";
import { addCarToVehicleModal, removeCarFromVehicleModal } from "../utils/addCarToVehicleModal";
import { createCarID } from "../utils/createCarID";
import { initChoices } from "./initChoiceJS";


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
      <button class="general-button delete-btn" id="deleteCarBtn">Видалити</button>
      <button class="general-button edit-btn" id"editCarBtn">Редагувати</button>
    </div>
  `;

    const deleteBtn = block.querySelector(".delete-btn") as HTMLButtonElement;
    const editBtn = block.querySelector(".edit-btn") as HTMLButtonElement;
    addCarToVehicleModal(car.getId, car.toString());

    deleteBtn.addEventListener("click", () => {
        FirebaseService.deleteCar(car.getId)
            .then(() => block.remove())
            .catch((err) => console.error("Помилка видалення:", err));
        removeCarFromVehicleModal(car.getId);
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
            event.preventDefault();
          
            const carDTO: CarDTO | null = readCarFormData(form);
            if (!carDTO) {
              console.warn("Будь ласка, заповніть усі поля коректно.");
              return;
            }
          
            const updatedCar = new Car(carDTO);
            updatedCar.setId = car.getId;
          
            const newId = createCarID(updatedCar.getBrand, updatedCar.getModel, updatedCar.getYear);
          
            const isIdChanged = newId !== car.getId;
          
            try {
              if (isIdChanged) {
                await FirebaseService.deleteCar(car.getId);
                updatedCar.setId = newId;
              }
          
              await FirebaseService.setCar(updatedCar, car.getId, updatedCar.getId);
          
              block.remove();
              removeCarFromVehicleModal(car.getId);
              addCarBlock(updatedCar); 
          
              dialog.closeDialog();
            } catch (err) {
              console.error("Помилка оновлення:", err);
            }
          };
          
    });


    carsList.appendChild(block);
}
