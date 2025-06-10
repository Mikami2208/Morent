

export class DialogManager{

    private dialog: HTMLDialogElement;

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
        document.body.classList.toggle("_locked");
        this.dialog.showModal();
    }

    public closeDialog(): void {
        document.body.classList.toggle("_locked");
        this.dialog.close();
    }
}