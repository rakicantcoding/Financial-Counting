import { data } from "../../../finance.js";
import { element } from "../dom/domElement.js";

// HIDE INPUT EXPENSE
export function hideExpenseInput() {
    document.querySelectorAll(".item_input").forEach(e => e.classList.add("hide"))

    const mapping = {
        expense: [element.expense_div_select],
        invest: [element.expense_div_select, element.expense_takeProfit, element.expense_portofolio],
        interest: [element.interest_div_select, element.expense_takeProfit, element.expense_portofolio],
        saving: [element.expense_div_select, element.expense_portofolio]
    }

    mapping[element.input_select.value].forEach(e => e.classList.remove("hide"))

    const mapping_input = {
        income: [element.income_name, element.income_amount],

        expense: [element.expense_name, element.expense_amount],

        invest: [element.expense_name, element.expense_amount, element.expense_takeProfit],

        interest: [element.expense_name, element.expense_amount, element.expense_interest],

        saving: [element.expense_name, element.expense_amount]
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


// DELETE BTN
document.querySelectorAll(".btn-del").forEach(e => {
    e.addEventListener("click", () => {

    })
})

// DELETE BTN END

