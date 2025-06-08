

export class CarDTO {
    public brand: string;
    public model: string;
    public year: number;
    public price: number;
    constructor(
        brand: string, model: string, year: number, price: number
    ){
        this.brand = brand
        this.model = model
        this.year =  year
        this.price = price
    }
}