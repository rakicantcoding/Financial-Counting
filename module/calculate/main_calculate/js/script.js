import { element } from "./dom/domElement.js";
import { data } from "../../finance.js";
import { add } from "./feature/input.js";
import { hideExpenseInput, alertInput } from "./feature/utility.js";

// INPUT

// INCOME
element.income_btn.addEventListener("click", () => {
    if (!alertInput("income")) return;
    add("income");
})

//INPUT EXPENSE SELECT
hideExpenseInput()
element.input_select.addEventListener("change", () => hideExpenseInput())

// EXPENSE
element.expense_btn.addEventListener("click", () => {
    if (!alertInput(element.input_select.value)) return;
    add("expense");
})

// INPUT END