import { RentalDTO } from "../dto/RentalDTO";
import { createRentalID } from "../utils/rentalUtils";
import { Vehicle } from "./Vehicle";


export class Rental{
    private id:string;
    private companyName: string;
    private vehicle: Vehicle[];

    constructor(
       dto: RentalDTO
    ) {
        if (dto.vehicle.length === 0) {
            throw new Error("Прокат повинен містити хоча б одне авто");
        }
        this.id = createRentalID(dto.companyName);
        this.companyName = dto.companyName;
        this.vehicle = dto.vehicle.map(v => v);
    }


    get getId(): string {
        return this.id;
    }
    get getCompanyName(): string {
        return this.companyName;
    }
    public getVechicleId(): string[] {
        return this.vehicle.map(v => v.getId);
    }

    public getVehicle(): Vehicle[] {
        return this.vehicle;
    }

    public toString(): string {
        return `Прокат: ${this.companyName},\n Авто: ${this.vehicle.map(v => v.toString()).join(", ")}`;
    }

    public toShortString(): string {
        return `Прокат: ${this.companyName},\n Авто: ${this.vehicle.map(v => v.getStartDate).join(", ")}\n Сумарная вартість: ${this.vehicle.reduce((total, v) => total + v.getPrice, 0)}`;
    }

    set setId(id: string) {
        if (!id) {
            throw new Error("ID не може бути пустим");
        }
        this.id = id;
    }

    public toJSON(): object {
        return {
            id: this.id,
            companyName: this.companyName,
            vehicle: this.getVechicleId()
        };
    }

}