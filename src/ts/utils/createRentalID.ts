

export function createRentalID(companyName: string): string {
    if (!companyName || typeof companyName !== 'string') {
        throw new Error("Invalid company name");
    }
    const currentDate = new Date();
    const timestamp = [
        currentDate.getFullYear(),
        (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        currentDate.getDate().toString().padStart(2, '0'),
        currentDate.getHours().toString().padStart(2, '0'),
        currentDate.getMinutes().toString().padStart(2, '0'),
        currentDate.getSeconds().toString().padStart(2, '0')
    ].join('')
    return `${companyName}-${timestamp}`;
}