import '../scss/styles.scss'
import { initChoices } from './components/initChoiceJS';
import { openModal } from './handlers/modalWindowHandler';
import { DialogManager } from './managers/DialogManager'
import { FirebaseService } from './service/FirebaseService';
import { addCarToDatabase } from './utils/addCarToDatabase';
import { addCarsToVehicleModalFromDB } from './utils/addCarsToVehicleModal';
import { addRentalToDatabase } from './utils/addRentalToDB';
import { addVehicleToDatabase } from './utils/addVehicleToDatabase';
import { addVehiclesToRentalModalFromDB } from './utils/addVehiclesToRentalModalFromDB';
import { populateCategorySelect } from './utils/populateCategorySelect';

(async function initApp() {
    populateCategorySelect();
    initChoices();  
    addCarToDatabase();
    addVehicleToDatabase();
    addRentalToDatabase();
  
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





