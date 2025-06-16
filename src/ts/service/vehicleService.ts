
import { Vehicle } from "../models/Vehicle";
import { FirebaseService } from "../service/FirebaseService";
import { DialogManager } from "../managers/DialogManager";
import { readVehicleFormData } from "../utils/vehicleUtils";
import { VehicleDTO } from "../dto/VehicleDTO";
import { createVehicleID } from "../utils/vehicleUtils";
import { addVehicleToRentModal, removeVehicleFromRentModal } from "../utils/vehicleUtils";
import type { Category } from "../models/Category";
import type { Car } from "../models/Car";
import { validateVehicleForm } from "../validation/vehicleValidation";

export function initVehicleCreation(): void {
  const addVehicleForm = document.getElementById("addVehicleForm") as HTMLFormElement;
  const dialog: DialogManager = new DialogManager("addVehicleDialog");
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

    if (!validateVehicleForm(addVehicleForm)) {
      return;
    }

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
      dialog.closeDialog();
      console.log("Транспортний засіб успішно додано:", newVehicle);
      renderVehicleBlock(newVehicle);
      addVehicleForm.reset();

    } catch (error) {
      console.error("Помилка при додаванні транспортного засобу:", error);
    }
  });
}

export function renderVehicleBlock(vechicle: Vehicle): void {
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
  console.log(vechicle.getId)
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



    form.onsubmit = async (event) => {
      event.preventDefault();

      if (!validateVehicleForm(form)) {
        return;
      }
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
          renderVehicleBlock(updatedVehicle);

          dialog.closeDialog();
        } catch (error) {
          console.error("Помилка при оновленні транспортного засобу:", error);
        }
      }
    }
  });



  vehicleBlock.appendChild(block);
}