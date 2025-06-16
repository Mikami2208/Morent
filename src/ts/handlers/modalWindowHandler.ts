import { DialogManager } from "../managers/DialogManager";


export function openModal(modalId: string): void {
    const modal: DialogManager = new DialogManager(modalId);
    modal.openDialog();
}

export function closeModal(modalId: string): void {
    const modal: DialogManager = new DialogManager(modalId);
    modal.closeDialog();
}