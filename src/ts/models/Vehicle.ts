import { VehicleDTO } from "../dto/VehicleDTO";
import { createVehicleID } from "../utils/createVehicleID";
import { Car } from "./Car";
import { Category } from "./Category";


export class Vehicle {
    private id: string;
    private car: Car;
    private category: Category;
    private plateNumber: string;
    private startDate: Date;
    private rentalDuration: number;

    constructor(dto: VehicleDTO) {
        if(dto.rentalDuration < 1){
            throw new Error("Тривалість прокату не може бути меньше одного дня")
        }
        this.id = createVehicleID(dto.plateNumber, dto.startDate, dto.rentalDuration);
        this.car = dto.car;
        this.category = dto.category;
        this.plateNumber = dto.plateNumber;
        this.startDate = new Date(dto.startDate);
        this.rentalDuration = dto.rentalDuration;
    }

    get getId(): string {
        return this.id;
    }
    get getCar(): string {
        return this.car.getId;
    }
    get getCategory(): Category {
        return this.category;
    }
    get getPlateNumber(): string {
        return this.plateNumber;
    }
    get getStartDate(): Date {
        return this.startDate;
    }
    get getRentalDuration(): number {
        return this.rentalDuration;
    }
    public getPrice(): number {
        return this.car.getPrice * this.rentalDuration;
    }

    public toString(): string{
        return `Дані про авто: '${this.car.toString()};\n 
        Категорія: ${this.category};\n 
        Номерний знак: ${this.plateNumber};\n 
        Дата початку прокату: ${this.startDate.toLocaleDateString()};\n 
        Тривалість прокату: ${this.rentalDuration} днів'`;
    }

    public toJSON(): object {
        return {    
            id: this.id,
            car: this.car.getId,
            category: this.category,
            plateNumber: this.plateNumber,
            startDate: this.startDate,
            rentalDuration: this.rentalDuration
        };
        
    }
}