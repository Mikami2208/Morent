import '../scss/styles.scss'
import { initChoices } from './components/initChoiceJS';
import { closeModal, openModal } from './handlers/modalWindowHandler';
import { DialogManager } from './managers/DialogManager'
import { FirebaseService, fetchAllData } from './service/FirebaseService';
import { initVehicleCreation, renderVehicleBlock } from './service/vehicleService';
import { initCarCreation, renderCarBlock } from './service/carService';
import { addAllCarsToPageFromDB } from './utils/carUtils';
import { initRentalCreation, renderRentalBlock } from './service/rentalService';
import { addAllVehiclesToPageFromDB } from './utils/vehicleUtils';
import { populateCategorySelect } from './utils/populateCategorySelect';
import { addCloseConfirmation } from './utils/addCloseConfirmation';
import { addAllRentalsToPageFromDB } from './utils/rentalUtils';
/*window.addEventListener("DOMContentLoaded", async () => {
    const { cars, vehicles, rentals } = await fetchAllData();
  
    // Тепер можеш використовувати ці дані:
    cars.forEach(car => {
        renderCarBlock(car);
    })
    vehicles.forEach(vehicle => {
        renderVehicleBlock(vehicle);
    });
    rentals.forEach(rental => {
       renderRentalBlock(rental);
    });
  });*/
  
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

    await addAllCarsToPageFromDB();
    await addAllVehiclesToPageFromDB();
    await addAllRentalsToPageFromDB();


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







