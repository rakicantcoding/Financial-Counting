import { element } from "./dom/domElements.js";
import { add } from "./features/feature.js";

element.income_btn.addEventListener("click", () => {
    add(element.income_name.value, Number(element.income_amount.value), "income")
})

element.expense_btn.addEventListener("click", () => {
    add(element.expense_name.value, Number(element.expense_amount.value), "expense")
})

element.expense_type.addEventListener("change", () => {
    element.select_note.textContent = `Type: ${element.expense_type.value}`
})

