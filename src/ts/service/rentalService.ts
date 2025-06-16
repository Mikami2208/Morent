
import { FirebaseService } from "../service/FirebaseService";
import { RentalDTO } from "../dto/RentalDTO";
import { Rental } from "../models/Rental";
import { Vehicle } from "../models/Vehicle";
import { VehicleDTO } from "../dto/VehicleDTO";
import { DialogManager } from "../managers/DialogManager";
import { validateRentalForm } from "../validation/rentalValidation";

export function initRentalCreation(): void {
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

    
      if(!validateRentalForm(rentalForm)){
        return;
      }
        let vehicle: Vehicle | null = null;

        try {
          vehicle = await FirebaseService.getVehicleById(vehicleId || "") as Vehicle;
          if (!vehicle) {
            console.error("Транспортний засіб не знайдено за ID:", vehicleId);
            return;
          }
        } catch (error) {
          console.error("Помилка при отриманні транспорту:", error);
          return;
        }

        const vehicleDto = new VehicleDTO(vehicle.getCar, vehicle.getCategory, vehicle.getPlateNumber, vehicle.getStartDate, vehicle.getRentalDuration, vehicle.getPrice);

        const rentalDto = new RentalDTO(companyName as string, [vehicleDto]);
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
            renderRentalBlock(rental);
            rentalForm.reset();
        } catch (error) {
            console.error("Помилка при додаванні прокату:", error);
        }
    });
}

export function renderRentalBlock(rental: Rental): void {
  const rentalList = document.getElementById('rentalList') as HTMLDivElement;
  if (!rentalList) return;

  console.log(rental.getCompanyName)
  const block = document.createElement("div");
  block.classList.add("cars__info-block");
  block.id = rental.getId;

  // Рендеримо список авто
  const vehiclesHTML = rental.getVehicle().map(v => `<li>${v.toString()}</li>`).join("");

  block.innerHTML = `
    <div class="cars__info">
      <p>Назва фірми: ${rental.getCompanyName}</p>
      <p>Авто:</p>
      <ul class="vehicle__list">${vehiclesHTML}</ul>
    </div>
    <div class="cars__buttons">
      <button class="general-button delete-btn">Видалити</button>
      <button class="general-button edit-btn">Редагувати</button>
    </div>
  `;

  // Видалення
  block.querySelector(".delete-btn")?.addEventListener("click", async () => {
    try {
      await FirebaseService.deleteRental(rental.getId);
      block.remove();
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  });

  // Редагування
  block.querySelector(".edit-btn")?.addEventListener("click", () => {
    const dialog = new DialogManager("editRentDialog");
    dialog.openDialog();

    const form = dialog.dialog.querySelector("form") as HTMLFormElement;
    const nameInput = form.querySelector("#editCompanyName") as HTMLInputElement;
    const select = form.querySelector("select") as HTMLSelectElement;
    nameInput.value = rental.getCompanyName;
    select.value = rental.getVehicle()[0]?.getId || "";


    form.onsubmit = async (event) => {
      event.preventDefault();
      const companyName = nameInput.value.trim();
      const vehicleId = select.value;
      if(!validateRentalForm(form)){
        return;
      }


      try {
        const vehicle = await FirebaseService.getVehicleById(vehicleId);
        const dto: RentalDTO = {
          companyName,
          vehicle: [vehicle as unknown as VehicleDTO]
        };

        const newRental = new Rental(dto);
        await FirebaseService.setRental(newRental, rental.getId, newRental.getId);
        block.remove();
        FirebaseService.deleteRental(rental.getId);
        renderRentalBlock(newRental);
        dialog.closeDialog();
      } catch (err) {
        console.error("Помилка при оновленні:", err);
      }
    };
  });
 
  rentalList.appendChild(block);
}
