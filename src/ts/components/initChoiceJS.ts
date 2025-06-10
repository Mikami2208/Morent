
import Choices from "choices.js";

export function initChoices() {
  const selectElement = document.getElementById('vechicle-type');
    if (selectElement) {
  const choices = new Choices(selectElement, {
    searchEnabled: false,
    itemSelectText: '',
    removeItemButton: true, 
  });
}

const carSelect = document.getElementById('carSelect');
if (carSelect) {
  const choices = new Choices(carSelect, {
    searchEnabled: true,
    itemSelectText: '',
    removeItemButton: true, 
  });

  const vechicleChoice = document.getElementById('tzSelect');
  if(vechicleChoice){
    const vechicleChoices = new Choices(vechicleChoice, {
      searchEnabled: true,
      itemSelectText: '',
      removeItemButton: true, 
    });
  }

}

}
