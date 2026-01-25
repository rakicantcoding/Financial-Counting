import { element } from "./dom/domElement.js";
import { data } from "../../../finance/finance.js";
import { add } from "./feature/input.js";
import { hideExpenseInput, alertInput, saveData, resetData } from "./feature/utility.js";
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


// KALAU INTEREST GANTI KE /YEAR MAKA PLACEHOLDER IKUT GANTI
element.expense_select_interest.addEventListener("change", () => {
    if (element.expense_select_interest.value === "monthly") element.expense_interest.placeholder = `Interest/Month [%]`;
    else element.expense_interest.placeholder = `Interest/Year [%]`;

})

// KALAU MONTH GANTI KE YEAR MAKA PLACEHOLDER IKUT GANTI
element.month_select.addEventListener(`change`, () => {
    if (element.month_select.value === "month") element.month_input.placeholder = `Month`;
    else element.month_input.placeholder = `Year`;
})

// INPUT END


// RESULT
element.month_btn.addEventListener("click", () => {
    if (data.income.length === 0 || Object.values(data.expense).flat().length === 0) return alert("Need input data income and expense first");
    if (!element.month_input.value) return alert("Need input month");
    result()
})

// RESULT END


// SAVE
element.save_btn.addEventListener("click", () => saveData())
// SAVE END



// RESET
element.reset_btn.addEventListener("click", () => resetData())
// RESET END