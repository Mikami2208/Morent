export function addCloseConfirmation(dialogId: string): void {
    const dialog = document.getElementById(dialogId) as HTMLDialogElement;
    const form = dialog.querySelector("form") as HTMLFormElement;
    const closeBtn = dialog.querySelector(".close-button") as HTMLButtonElement;
  
    if (!dialog || !form || !closeBtn) return;
  
    closeBtn.addEventListener("click", (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(form);
      const hasInput = Array.from(formData.values()).some(val => val.toString().trim() !== "");
  
      if (hasInput) {
        const confirmClose = confirm("Усі незбережені дані будуть втрачені. Закрити без збереження?");
        if (!confirmClose) return; 
      }
      form.reset();
      dialog.close();
    });
  }
  