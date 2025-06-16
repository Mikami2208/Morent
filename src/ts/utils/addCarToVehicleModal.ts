import { addChoicesOption } from "../components/initChoiceJS";
import { getChoicesInstance } from "../components/initChoiceJS";

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

// Найти choice по value
const choiceToRemove = instance._store.choices.find(choice => choice.value === carId);
const choiceToRemoveEdit = instanceEdit._store.choices.find(choice => choice.value === carId);
if (choiceToRemove && choiceToRemoveEdit) {
    instance.removeChoice(choiceToRemove.value); // Changed from choiceToRemove.id to choiceToRemove.value
    instanceEdit.removeChoice(choiceToRemoveEdit.value); // Changed from choiceToRemove.id to choiceToRemove.value
    console.log(`Car with ID ${carId} removed from modal.`);
} else {
    console.warn(`Choice with value ${carId} not found in Choices instance.`);
}
}
