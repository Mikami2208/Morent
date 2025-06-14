import Choices from "choices.js";

/**
 * Объект для хранения всех ChoiceJS инстансов
 */
const choicesInstances: Record<string, Choices> = {};

/**
 * Инициализация всех select-елементів на сторінці з ChoiceJS
 */
export function initChoices(): void {
  initSingleChoice("vechicle-type", false);
  initSingleChoice("carSelect", true);
  initSingleChoice("tzSelect", true);
  initSingleChoice("vechicle-type-edit", true);
  initSingleChoice("carSelectEdit", true);
}

/**
 * Ініціалізує один select через Choices та зберігає його інстанс
 * @param selectId - id елемента <select>
 * @param searchEnabled - чи ввімкнено пошук
 */
function initSingleChoice(selectId: string, searchEnabled: boolean): void {
  const selectElement = document.getElementById(selectId) as HTMLSelectElement | null;
  if (!selectElement) {
    console.warn(`Елемент select з id="${selectId}" не знайдено`);
    return;
  }

  // Якщо інстанс уже існує, знищуємо перед повторною ініціалізацією
  if (choicesInstances[selectId]) {
    choicesInstances[selectId].destroy();
  }

  const instance = new Choices(selectElement, {
    searchEnabled,
    itemSelectText: '',
    removeItemButton: true,
    shouldSort: false,
  });

  choicesInstances[selectId] = instance;
}

/**
 * Додає нову опцію до select з ChoiceJS
 * @param selectId 
 * @param value 
 * @param label
 */
export function addChoicesOption(selectId: string, value: string, label: string): void {
  const instance = choicesInstances[selectId];
  if (!instance) {
    console.error(`Choices instance не знайдено для selectId="${selectId}". Переконайся, що ти викликав initChoices().`);
    return;
  }

  instance.setChoices(
    [{ value, label, selected: false, disabled: false }],
    'value',
    'label',
    false 
  );
}

export function getChoicesInstance(selectId: string): Choices | undefined {
    return choicesInstances[selectId];
  }