import { element } from "./dom/domElement.js";
import { data } from "../../finance.js";
import { add } from "./feature/input.js";
import { hideExpenseInput, alertInput } from "./feature/utility.js";
import { result } from "./feature/load.js";

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
    if (data.income.length === 0) return alert("Need input data income first");
    if (!alertInput(element.input_select.value)) return;
    add("expense");
})

// INPUT END


// RESULT
element.month_btn.addEventListener("click", () => {
    if (data.income.length === 0 || Object.values(data.expense).flat().length === 0) return alert("Need input data income and expense first");
    if (!element.month_input.value) return alert("Need input month");
    result()
})

// RESULT END