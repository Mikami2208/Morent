import '../scss/styles.scss'
import { initChoices } from './components/initChoiceJS';
import { openModal } from './handlers/modalWindowHandler';
import { DialogManager } from './managers/DialogManager'

initChoices();

document.getElementById('addCarButton')?.addEventListener('click', () => {
    openModal('addCarDialog');
});

document.getElementById('addVehicleButton')?.addEventListener('click', () => {
    openModal('addVehicleDialog');
});

document.getElementById('addRentButton')?.addEventListener('click', () => {
   openModal('addRentDialog');
});

