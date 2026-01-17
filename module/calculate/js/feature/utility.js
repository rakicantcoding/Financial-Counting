import { data } from "../../../../finance/finance.js";
import { element } from "../dom/domElement.js";

// HIDE INPUT EXPENSE
export function hideExpenseInput() {
    document.querySelectorAll(".item_input").forEach(e => e.classList.add("hide"))

    const mapping = {
        expense: [element.expense_div_select],
        invest: [element.expense_div_select, element.expense_takeProfit, element.expense_portofolio],
        interest: [element.expense_div_select, element.interest_div_select, element.expense_portofolio],
        saving: [element.expense_div_select, element.expense_portofolio]
    }

    mapping[element.input_select.value].forEach(e => e.classList.remove("hide"))

    const mapping_input = {
        income: [element.income_name, element.income_amount],

        expense: [element.expense_name, element.expense_amount],

        invest: [element.expense_name, element.expense_amount, element.expense_takeProfit, element.expense_portofolio],

        interest: [element.expense_name, element.expense_amount, element.expense_interest, element.expense_portofolio],

        saving: [element.expense_name, element.expense_amount, element.expense_portofolio]
    }
    for (const key in mapping_input) {
        mapping_input[key].forEach(e => e.value = "")
    }
}

// HIDE INPUT EXPENSE END



// ALERT EXPENSE
export function alertInput(category) {
    const mapping = {
        income: [element.income_name, element.income_amount],

        expense: [element.expense_name, element.expense_amount],

        invest: [element.expense_name, element.expense_amount, element.expense_takeProfit],

        interest: [element.expense_name, element.expense_amount, element.expense_interest],

        saving: [element.expense_name, element.expense_amount]
    }

    for (const e of mapping[category]) {
        if (!e.value) {
            alert("Input required first");
            return false;
        }
    }

    return true
}
// ALERT EXPENSE END


// CHECK ID
export function checkid() {
    const newId = data.globalId
    data.globalId++;
    return newId
}
// CHECK ID END



// HIDE SHOW RESULT
export function resultSelect(keyMapping) {

    if (element.result_select.value === "all") {

        element.expense_result_note.classList.add("hide");
        Object.values(keyMapping).flat().forEach(e => e.classList.remove("hide"));

    }

    else {

        if (!keyMapping[element.result_select.value]) {
            element.expense_result_note.classList.remove("hide");
            Object.values(keyMapping).flat().forEach(e => e.classList.add("hide"));
        }

        else {
            element.expense_result_note.classList.add("hide");
            for (const key in keyMapping) {
                keyMapping[key].classList.add("hide");
                keyMapping[element.result_select.value].classList.remove("hide");
            }
        }

    }
}


// INCOME RESULT
export function incomeResult() {
    let key_container = document.createElement("div");
    key_container.classList.add("key-container");
    let p_title = document.createElement("p");
    p_title.textContent = `Category: income`;
    key_container.append(p_title);
    element.income_result.append(key_container);
    return key_container
}
// INCOME RESULT END


// SAVE DATA
export function saveData() {
    if (data.income.length === 0 || Object.values(data.expense).flat().length === 0) return alert(`Need input income and expense`);
    if (Object.values(data.expense).flat().length === 0) return alert("Need input expense");
    if (Object.values(data.expense).flat().filter(e => e.category !== "expense").length === 0) return alert(`Need to input a category other than expense.`);
    if (!data.result) return alert(`Need input month`);

    localStorage.setItem("result", JSON.stringify(data.result));
    window.location.href = "../chart/index.html";
}
// SAVE DATA END


// RESET
export function resetData() {
    localStorage.clear();
}

// RESET END