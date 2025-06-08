

export function createVehicleID(plateNumber: string, startDate: Date, rentalDuration: number): string {
    const datePart = startDate.toISOString().split('T')[0].replace(/-/g, '');
    const durationPart = rentalDuration.toString().padStart(3, '0');
    const platePart = plateNumber.replace(/\s+/g, '').toUpperCase();
    const currentDate = new Date();
    const timestamp = [
        currentDate.getFullYear(),
        (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        currentDate.getDate().toString().padStart(2, '0'),
        currentDate.getHours().toString().padStart(2, '0'),
        currentDate.getMinutes().toString().padStart(2, '0'),
        currentDate.getSeconds().toString().padStart(2, '0')
    ].join('')
    
    return `${datePart}-${durationPart}-${platePart}-t${timestamp}`;
}