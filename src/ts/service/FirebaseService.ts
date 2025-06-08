import type { CarDTO } from "../dto/CarDTO";
import { Vehicle } from "../models/Vehicle";
import { Car } from "../models/Car";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, setDoc, getDoc, query, where, limit, writeBatch } from "firebase/firestore";
import { Rental } from "../models/Rental";
import type { VehicleDTO } from "../dto/VehicleDTO";
import type { RentalDTO } from "../dto/RentalDTO";


export class FirebaseService{

    public static async addCar(car: Car): Promise<void> {
         try{
            const carDocRef = doc(db, "cars", car.getId);
            await setDoc(carDocRef, car.toJSON());

         } catch (error) {
            console.error("Помилка при додаванні авто:", error);
            throw new Error("Не вдалося додати авто до бази даних");
         }
    }

    public static async addVehicle(vehicle: Vehicle): Promise<void> {
        try {
            const vehicleDocRef = doc(db, "vehicles", vehicle.getId);
            await setDoc(vehicleDocRef, vehicle.toJSON());
        } catch (error) {
            console.error("Помилка при додаванні транспортного засобу:", error);
            throw new Error("Не вдалося додати транспортний засіб до бази даних");
        }
    }

    public static async addRental(rental: Rental): Promise<void> {
        try {
            const rentalDocRef = doc(db, "rentals", rental.getId);
            await setDoc(rentalDocRef, rental.toJSON());
        } catch (error) {
            console.error("Помилка при додаванні прокату:", error);
            throw new Error("Не вдалося додати прокат до бази даних");
        }
    }

    public static async setCar(car: Car, id: string): Promise<void> {
        try {
            const carDocRef = doc(db, "cars", id);
            await setDoc(carDocRef, car.toJSON());
        } catch (error) {
            console.error("Помилка при оновленні авто:", error);
            throw new Error("Не вдалося оновити авто в базі даних");
        }
    }

    public static async setVehicle(vehicle: Vehicle, id: string): Promise<void> {
        try {
            const vehicleDocRef = doc(db, "vehicles", id);
            await setDoc(vehicleDocRef, vehicle.toJSON());
        } catch (error) {
            console.error("Помилка при оновленні транспортного засобу:", error);
            throw new Error("Не вдалося оновити транспортний засіб в базі даних");
        }
    }

    public static async setRental(rental: Rental, id: string): Promise<void> {
        try {
            const rentalDocRef = doc(db, "rentals", id);
            await setDoc(rentalDocRef, rental.toJSON());
        } catch (error) {
            console.error("Помилка при оновленні прокату:", error);
            throw new Error("Не вдалося оновити прокат в базі даних");
        }
    }

    public static async getCarById(id: string): Promise<Car | null> {
        try {
            const carDocRef = doc(db, "cars", id);
            const carDoc = await getDoc(carDocRef);
            if (carDoc.exists()) {
                return new Car(carDoc.data() as CarDTO);
            } else {
                console.warn("Авто не знайдено");
                return null;
            }
        } catch (error) {
            console.error("Помилка при отриманні авто:", error);
            throw new Error("Не вдалося отримати авто з бази даних");
        }
    }

    public static async getVehicleById(id: string): Promise<Vehicle | null> {
        try {
            const vehicleDocRef = doc(db, "vehicles", id);
            const vehicleDoc = await getDoc(vehicleDocRef);
            if (vehicleDoc.exists()) {
                return new Vehicle(vehicleDoc.data() as VehicleDTO);
            } else {
                console.warn("Транспортний засіб не знайдено");
                return null;
            }
        } catch (error) {
            console.error("Помилка при отриманні транспортного засобу:", error);
            throw new Error("Не вдалося отримати транспортний засіб з бази даних");
        }
    }

    public static async getRentalById(id: string): Promise<Rental | null> {
        try {
            const rentalDocRef = doc(db, "rentals", id);
            const rentalDoc = await getDoc(rentalDocRef);
            if (rentalDoc.exists()) {
                return new Rental(rentalDoc.data() as RentalDTO);
            } else {
                console.warn("Прокат не знайдено");
                return null;
            }
        } catch (error) {
            console.error("Помилка при отриманні прокату:", error);
            throw new Error("Не вдалося отримати прокат з бази даних");
        }
    }
}