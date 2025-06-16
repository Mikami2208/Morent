export function validateCarForm(form: HTMLFormElement): boolean {
    const brand = (form.querySelector("#brand") as HTMLInputElement)?.value.trim();
    const model = (form.querySelector("#model") as HTMLInputElement)?.value.trim();
    const price = parseFloat((form.querySelector("#price") as HTMLInputElement)?.value);
    const year = parseInt((form.querySelector("#year") as HTMLInputElement)?.value);

    if(!brand){
        alert("Будь ласка, введіть марку автомобіля.");
        return false;
    }
    if(!model){
        alert("Будь ласка, введіть модель автомобіля.");
        return false;
    }
    if(isNaN(price) || price <= 0){
        alert("Будь ласка, введіть коректну ціну автомобіля.");
        return false;
    }
    if(isNaN(year) || year < 1946 || year > new Date().getFullYear()){
        alert("Будь ласка, введіть коректний рік автомобіля.");
        return false;
    }
    if(year < 1946){
        alert("Автомобілі, випущені до 1946 року, не допускаються.");
        return false;
    }
    if(year > new Date().getFullYear()){
        alert("Автомобілі, випущені в майбутньому, не допускаються.");
        return false;
    }

    return true;
}
