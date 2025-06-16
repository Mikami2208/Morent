import firebase from "firebase/compat/app";
import { Vehicle } from "../models/Vehicle";
import { FirebaseService } from "../service/FirebaseService";
import { DialogManager } from "../managers/DialogManager";
import type { Category } from "../models/Category";
import { readVehicleFormData } from "../utils/addVehicleToDatabase";
import type { VehicleDTO } from "../dto/VehicleDTO";
import { createVehicleID } from "../utils/createVehicleID";
import  { Car } from "../models/Car";
import { addVehicleToRentModal, removeVehicleFromRentModal } from "../utils/addVehicleToRentalModal";
import { remove } from "firebase/database";



export function addVehicleBlock(vechicle: Vehicle): void {
  const vehicleBlock = document.getElementById('tzList') as HTMLDivElement;
  console.log("Додаємо блок для транспортного засобу:", vehicleBlock);

  const block = document.createElement("div");
  block.classList.add("cars__info-block");
  block.id = vechicle.getId;


  block.innerHTML = `
    <div class="cars__info">
    <p>Авто: ${vechicle.getCar.toString()}</p>
      <p>Вид автомобіля: ${vechicle.getCategory}</p> 
      <p>Номерний знак: ${vechicle.getPlateNumber}</p> 
      <p>Дата виходу в прокат: ${vechicle.getStartDate.toLocaleDateString()}</p> 
      <p>Тривалість прокату: ${vechicle.getRentalDuration} днів</p> 
      <p>Ціна: ${vechicle.getPrice}</p> 
      </div>
    <div class="cars__buttons">
      <button class="general-button delete-btn">Видалити</button>
      <button class="general-button edit-btn">Редагувати</button>
    </div>
  `;

  const deleteBtn = block.querySelector(".delete-btn") as HTMLButtonElement;
  const editBtn = block.querySelector(".edit-btn") as HTMLButtonElement;

  addVehicleToRentModal(vechicle.getId, vechicle.toString());

  deleteBtn.addEventListener("click", () => {
    FirebaseService.deleteVehicle(vechicle.getId).then(() => {
      block.remove()
      removeVehicleFromRentModal(vechicle.getId);
    })
      .catch((err) => console.log("Помилка видалення:", err));
  });
  console.log(editBtn)
  editBtn.addEventListener("click", () => {
    const dialog: DialogManager = new DialogManager("editVehicleDialog");
    dialog.openDialog();
    const form = document.getElementById("editVehicleForm") as HTMLFormElement;
    if (!form) return;
  
  
    (document.getElementById("editPlateNumber") as HTMLInputElement).value = vechicle.getPlateNumber;
    (document.getElementById("editStartDate") as HTMLInputElement).value = vechicle.getStartDate.toISOString().split('T')[0];
    (document.getElementById("editRentalDuration") as HTMLInputElement).value = vechicle.getRentalDuration.toString();
    (document.getElementById("editPriceVehicle") as HTMLInputElement).value = vechicle.getPrice.toString();
    console.log(vechicle.getPrice.toString())
    form.onsubmit = async (event) => {
      event.preventDefault();
  
      const vehicleDTO: VehicleDTO | null = await readVehicleFormData(form);
      if (vehicleDTO !== null) {
        const updatedVehicle = new Vehicle(vehicleDTO);
        updatedVehicle.setId = vechicle.getId;
  
        const newId = createVehicleID(vechicle.getPlateNumber, vechicle.getStartDate, vechicle.getRentalDuration);
        try {
          await FirebaseService.deleteVehicle(vechicle.getId);
          updatedVehicle.setId = newId;
  
          await FirebaseService.setVehicle(updatedVehicle, vechicle.getId, newId);
          block.remove();
          removeVehicleFromRentModal(vechicle.getId);
          addVehicleBlock(updatedVehicle);
  
          dialog.closeDialog();
        } catch (error) {
          console.error("Помилка при оновленні транспортного засобу:", error);
        }
      }
    }
  });



  vehicleBlock.appendChild(block);
}