

export class DialogManager{

    public dialog: HTMLDialogElement;

    constructor(dialogId: string) {
        const dialog = document.getElementById(dialogId);

        const closeButton = dialog?.querySelector('.close-button');
        closeButton?.addEventListener('click', () => {
            this.closeDialog();
        });
        if (!dialog || !(dialog instanceof HTMLDialogElement)) {
            throw new Error(`Елемент з ID: ${dialogId} не є діалоговим вікном або не існує.`);
        }
        this.dialog = dialog;
    }

    public openDialog(): void {

        this.dialog.showModal();
    }

    public closeDialog(): void {
        this.dialog.close();
    }
}