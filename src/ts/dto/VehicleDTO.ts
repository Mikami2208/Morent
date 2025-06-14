import type { Car } from "../models/Car"
import type { Category } from "../models/Category"


export class VehicleDTO{
    public car: Car
    public category: Category
    public plateNumber: string
    public startDate: Date
    public rentalDuration: number
    public price: number
    constructor(car: Car, category: Category, plateNumber: string, startDate: Date, rentalDuration: number, price: number) {
        this.car = car;
        this.category = category;
        this.plateNumber = plateNumber;
        this.startDate = startDate;
        this.rentalDuration = rentalDuration;
        this.price = price;
    }
}