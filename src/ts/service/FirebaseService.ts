import type { CarDTO } from "../dto/CarDTO";
import { Vehicle } from "../models/Vehicle";
import { Car } from "../models/Car";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, setDoc, getDoc, query, where, limit, writeBatch, deleteDoc } from "firebase/firestore";
import { Rental } from "../models/Rental";
import { VehicleDTO } from "../dto/VehicleDTO";
import type { RentalDTO } from "../dto/RentalDTO";
import { createCarID } from "../utils/createCarID";
import { ModelFactory } from "../factories/ModelFactory"; // шлях змінюй відповідно


export class FirebaseService {

    public static async addCar(car: Car): Promise<void> {
        try {
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

    public static async setCar(car: Car, oldId: string, newId: string): Promise<void> {
        try {
            await this.deleteCar(oldId)
            car.setId = newId; // Оновлюємо ID автомобіля на новий
            await this.addCar(car) // Оновлюємо ID на основі нових даних

        } catch (error) {
            console.error("Помилка при оновленні авто:", error);
            throw new Error("Не вдалося оновити авто в базі даних");
        }
    }

    public static async setVehicle(vehicle: Vehicle, oldId: string, newId: string): Promise<void> {
        try {
            await this.deleteVehicle(oldId);
            vehicle.setId = newId;
            await this.addVehicle(vehicle);
        } catch (error) {
            console.error("Помилка при оновленні транспортного засобу:", error);
            throw new Error("Не вдалося оновити транспортний засіб в базі даних");
        }
    }

    public static async setRental(rental: Rental, oldId: string, newId: string): Promise<void> {
        try {
            await this.deleteRental(oldId);
            rental.setId = newId;
            await this.addRental(rental);
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
            return await ModelFactory.create("vehicles", vehicleDoc.data() as VehicleDTO) as Vehicle;
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

    public static async deleteCar(carId: string): Promise<void> {
        try {
            const carDocRef = doc(db, "cars", carId);
            await deleteDoc(carDocRef);
        } catch (error) {
            console.error("Помилка при видаленні авто:", error);
            throw new Error("Не вдалося видалити авто з бази даних");
        }
    }

    public static async deleteVehicle(vehicleId: string): Promise<void> {
        try {
            const vehicleDocRef = doc(db, "vehicles", vehicleId);
            await deleteDoc(vehicleDocRef);
        } catch (error) {
            console.error("Помилка при видаленні транспортного засобу:", error);
            throw new Error("Не вдалося видалити транспортний засіб з бази даних");
        }

    }

    public static async deleteRental(rentalId: string): Promise<void> {
        try {
            const rentalDocRef = doc(db, "rentals", rentalId);
            await deleteDoc(rentalDocRef);
        } catch (error) {
            console.error("Помилка при видаленні прокату:", error);
            throw new Error("Не вдалося видалити прокат з бази даних");
        }
    }



    public static async getElementsByCollectionName(collectionName: string): Promise<any[]> {
        try {
            const collectionRef = collection(db, collectionName);
            const querySnapshot = await getDocs(collectionRef);
            const elements: any[] = [];

            for (const doc of querySnapshot.docs) {
                const rawData = { id: doc.id, ...doc.data() };
                const instance = await ModelFactory.create(collectionName as any, rawData);
                elements.push(instance);
            }

            return elements;
        } catch (error) {
            console.error(`Помилка при отриманні елементів з колекції ${collectionName}:`, error);
            throw new Error(`Не вдалося отримати елементи з колекції ${collectionName}`);
        }
    }
}