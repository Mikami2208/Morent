import type { VehicleDTO } from "./VehicleDTO";


export class RentalDTO{
    public companyName: string;
    public vehicle: VehicleDTO[];

    constructor(
        companyName: string,
        vehicle: VehicleDTO[]
    ) {
        this.companyName = companyName;
        this.vehicle = vehicle;
    }
}