

export function validateRentalForm(form: HTMLFormElement): boolean {
    const companyName = (form.querySelector("[name='companyName']") as HTMLInputElement)?.value.trim();
    const vehicleId = (form.querySelector("[name='tz-select']") as HTMLSelectElement)?.value;

    if(!companyName) {
        alert("Будь ласка, введіть назву компанії.");
        return false;
    }
    if(!vehicleId || vehicleId === "default") {
        alert("Будь ласка, виберіть транспортний засіб.");
        return false;
    }
    

    return true;
}
