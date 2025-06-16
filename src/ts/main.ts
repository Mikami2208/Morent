import '../scss/styles.scss'
import { initChoices } from './components/initChoiceJS';
import { closeModal, openModal } from './handlers/modalWindowHandler';
import { DialogManager } from './managers/DialogManager'
import { FirebaseService } from './service/FirebaseService';
import { initVehicleCreation } from './service/vehicleService';
import { initCarCreation } from './service/carService';
import { addCarsToVehicleModalFromDB } from './utils/carUtils';
import { initRentalCreation } from './service/rentalService';
import { addVehiclesToRentalModalFromDB } from './utils/vehicleUtils';
import { populateCategorySelect } from './utils/populateCategorySelect';
import { addCloseConfirmation } from './utils/addCloseConfirmation';

(async function initApp() {
    populateCategorySelect();
    initChoices();
    initCarCreation();
    initVehicleCreation();
    initRentalCreation();
    addCloseConfirmation('addCarDialog');
    addCloseConfirmation('addVehicleDialog');
    addCloseConfirmation('addRentDialog');
    addCloseConfirmation('editCarDialog');
    addCloseConfirmation('editVehicleDialog');
    addCloseConfirmation('editRentDialog');

    await addCarsToVehicleModalFromDB();
    await addVehiclesToRentalModalFromDB();


})();


document.getElementById('addCarButton')?.addEventListener('click', () => {
    openModal('addCarDialog');

});

document.getElementById('addVehicleButton')?.addEventListener('click', () => {
    openModal('addVehicleDialog');
});

document.getElementById('addRentButton')?.addEventListener('click', () => {
    openModal('addRentDialog');
});







