

import { addChoicesOption } from "../components/initChoiceJS";
import { getChoicesInstance } from "../components/initChoiceJS";

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
  