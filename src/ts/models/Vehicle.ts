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
    private price: number;

    constructor(dto: VehicleDTO) {
        if (!(dto.car instanceof Car)) {
            throw new Error("Авто не може бути пустим");
        }
        this.id = createVehicleID(dto.plateNumber, dto.startDate, dto.rentalDuration);
        this.car = dto.car;
        this.category = dto.category;
        this.plateNumber = dto.plateNumber;
        this.startDate = dto.startDate instanceof Date
            ? dto.startDate
            : new Date((dto.startDate as any).seconds ? (dto.startDate as any).seconds * 1000 : dto.startDate);
        this.rentalDuration = dto.rentalDuration;
        this.price = dto.price;
    }

    get getId(): string {
        return this.id;
    }
    get getCar(): Car {
        return this.car;
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
    get getPrice(): number {
        return this.price;
    }

    set setId(id: string) {
        if (!id) {
            throw new Error("ID не може бути пустим");
        }
        this.id = id;
    }
    public toString(): string {
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
            rentalDuration: this.rentalDuration,
            price: this.price
        };

    }
}