import { RentalDTO } from "../dto/RentalDTO";
import { createRentalID } from "../utils/createRentalID";
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
        this.vehicle = dto.vehicle.map(v => new Vehicle(v));
    }

    get getId(): string {
        return this.id;
    }
    get getCompanyName(): string {
        return this.companyName;
    }
    public getVechicle(): string[] {
        return this.vehicle.map(v => v.getId);
    }

    public toString(): string {
        return `Прокат: ${this.companyName},\n Авто: ${this.vehicle.map(v => v.toString()).join(", ")}`;
    }

    public toShortString(): string {
        return `Прокат: ${this.companyName},\n Авто: ${this.vehicle.map(v => v.getStartDate).join(", ")}\n Сумарная вартість: ${this.vehicle.reduce((total, v) => total + v.getPrice(), 0)}`;
    }

    public toJSON(): object {
        return {
            id: this.id,
            companyName: this.companyName,
            vehicle: this.getVechicle()
        };
    }

}