import type { Vehicle } from "../models/Vehicle";
import type { VehicleDTO } from "./VehicleDTO";


export class RentalDTO{
    public companyName: string;
    public vehicle: Vehicle[];

    constructor(
        companyName: string,
        vehicle: Vehicle[]
    ) {
        this.companyName = companyName;
        this.vehicle = vehicle;
    }
}