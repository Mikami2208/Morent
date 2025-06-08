

export function createCarID(brand: string, model: string, year: number): string {
    if (!brand || !model || year < 1920 || year > new Date().getFullYear()) {
        throw new Error("Invalid car details provided");
    }

    const formattedBrand = brand.toLowerCase().replace(/\s+/g, '');
    const formattedModel = model.toLowerCase().replace(/\s+/g, '');
    const formattedYear = year.toString();
    const currentDate = new Date();
    const timestamp = [
        currentDate.getFullYear(),
        (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        currentDate.getDate().toString().padStart(2, '0'),
        currentDate.getHours().toString().padStart(2, '0'),
        currentDate.getMinutes().toString().padStart(2, '0'),
        currentDate.getSeconds().toString().padStart(2, '0')
    ].join('')

    return `${formattedBrand}-${formattedModel}-${formattedYear}-${timestamp}`;
}