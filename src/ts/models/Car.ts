import { CarDTO } from "../dto/CarDTO";
import { createCarID } from "../utils/createCarID";



export class Car {
    private id: string;
    private brand: string;
    private model: string;
    private year: number;
    private price: number;

    constructor(dto: CarDTO){

        if(!dto.brand || !dto.model || !dto.price){
            throw new Error("Марка, модель, рік - обовʼязкові поля")
        }
        if(dto.year < 1920 || dto.year > new Date().getFullYear()){
            throw new Error("Невірний рік")
        }
        if(dto.price < 0){
            throw new Error("Невірна ціна. Ціна не може бути меньше нуля")
        }

        this.id = createCarID(dto.brand, dto.model, dto.year);
        this.brand = dto.brand
        this.model = dto.model
        this.year = dto.year
        this.price = dto.price
    }

    get getId(): string {
        return this.id;
    }
    get getBrand(): string {
        return this.brand;
    }
    get getModel(): string {
        return this.model;
    }
    get getYear(): number {
        return this.year;
    }
    get getPrice(): number {
        return this.price;
    }
    
    public toString():string{
        return `Марка: ${this.brand}; Модель: ${this.model}; Ціна: ${this.price}; Рік: ${this.year}`
    }

    public toJSON(){
        return {
            id: this.id,
            brand: this.brand,
            model: this.model,
            year: this.year,
            price: this.price
        };
        }

    
}