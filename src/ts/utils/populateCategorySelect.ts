
import { Category } from "../models/Category";

export function populateCategorySelect(): void {
  const select = document.getElementById("vechicle-type") as HTMLSelectElement;
  const selectEdit = document.getElementById("vechicle-type-edit") as HTMLSelectElement;
  if (!select) console.log("Select element not found");

  console.log(select)

  select.innerHTML = "";

  for (const key in Category) {
    const value = Category[key as keyof typeof Category];
    console.log(key)

    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;

    select.appendChild(option);
    selectEdit.appendChild(option.cloneNode(true));
    
  }
}
