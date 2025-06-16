

export function validateVehicleForm(form: HTMLFormElement): boolean {

    const carId = (form.querySelector("[name='car']") as HTMLSelectElement)?.value;
    const type = (form.querySelector("[name='vechicle-type']") as HTMLSelectElement)?.value;
    const plate = (form.querySelector("[name='plate-number']") as HTMLInputElement)?.value.trim();
    const startDate = (form.querySelector("[name='date-of-start-rental']") as HTMLInputElement)?.value;
    const duration = parseInt((form.querySelector("[name='rental-duration']") as HTMLInputElement)?.value);
    const price = parseFloat((form.querySelector("[name='price-rental']") as HTMLInputElement)?.value);
    if (carId === "default" || !carId) {
        alert("Будь ласка, виберіть автомобіль.");
        return false;
    }
    if (!type || type === "default") {
        alert("Будь ласка, виберіть тип транспортного засобу.");
        return false;
    }
    if (!plate) {
        alert("Будь ласка, введіть номерний знак.");
        return false;
    }
    if (!startDate) {
        alert("Будь ласка, виберіть дату початку оренди.");
        return false;
    }
    if (startDate < new Date().toISOString().split('T')[0]) {
        alert("Дата початку оренди не може бути в минулому.");
        return false;
    }
    if (isNaN(duration) || duration <= 0) {
        alert("Будь ласка, введіть коректну тривалість оренди.");
        return false;
    }
    if (isNaN(price) || price <= 0) {
        alert("Будь ласка, введіть коректну ціну оренди.");
        return false;
    }


    return true;
}