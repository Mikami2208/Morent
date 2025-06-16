import { Rental } from "../models/Rental";
import { FirebaseService } from "../service/FirebaseService";
import { DialogManager } from "../managers/DialogManager";
import { createRentalID } from "../utils/createRentalID";
import { RentalDTO } from "../dto/RentalDTO";
import { Vehicle } from "../models/Vehicle";
import type { VehicleDTO } from "../dto/VehicleDTO";

export function addRentalBlock(rental: Rental): void {
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
    console.log(rental.getCompanyName)
    nameInput.value = rental.getCompanyName;
    select.value = rental.getVehicle()[0]?.getId || "";

    form.onsubmit = async (event) => {
      event.preventDefault();
      const companyName = nameInput.value.trim();
      const vehicleId = select.value;

      if (!companyName || !vehicleId) return;

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
        addRentalBlock(newRental);
        dialog.closeDialog();
      } catch (err) {
        console.error("Помилка при оновленні:", err);
      }
    };
  });
 
  rentalList.appendChild(block);
}
