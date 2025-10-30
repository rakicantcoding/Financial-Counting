// ADD INPUT INCOME & EXPENSE
import { data } from "../../../finance.js";
import { element } from "../dom/domElement.js";
import { load } from "./load.js";

export function add(category) {
    if (category === "income") data.income.push({ name: element.income_name.value, amount: Number(element.income_amount.value) });

    else if (category === "expense") {
        const category_input = element.input_select.value;
        const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);




        // EXPENSE
        if (category_input === "expense") {
            let def = {
                name: element.expense_name.value,
                amount: Number(element.expense_amount.value),
                type_amount: element.expense_select_amount.value,
                category: category_input,
            }

            if (def.type_amount !== "nominal") {
                let percentResult = (def.amount / 100) * totalIncome;
                def.percent = def.amount
                def.amount = percentResult
            }

            data.expense.expense.push(def)
        }

        // INVEST
        if (category_input === "invest") {
            let def = {
                name: element.expense_name.value,
                amount: Number(element.expense_amount.value),
                takeProfit: Number(element.expense_takeProfit.value),
                portofolio: element.expense_portofolio ? Number(element.expense_portofolio.value) : 0,
                type_amount: element.expense_select_amount.value,
                category: category_input
            }

            if (def.type_amount !== "nominal") {
                let percentResult = (def.amount / 100) * totalIncome;
                def.percent = def.amount
                def.amount = percentResult
            }

            data.expense.invest.push(def)
        }

        // INTEREST
        if (category_input === "interest") {
            let def = {
                name: element.expense_name.value,
                amount: Number(element.expense_amount.value),
                interest: Number(element.expense_interest.value),
                portofolio: element.expense_portofolio ? Number(element.expense_portofolio.value) : 0,
                type_amount: element.expense_select_amount.value,
                type_interest: element.expense_select_interest.value,
                category: category_input
            }

            if (def.type_amount !== "nominal") {
                let percentResult = (def.amount / 100) * totalIncome;
                def.percent = def.amount
                def.amount = percentResult
            }

            data.expense.interest.push(def)
        }

        // SAVING
        if (category_input === "saving") {
            let def = {
                name: element.expense_name.value,
                amount: Number(element.expense_amount.value),
                portofolio: element.expense_portofolio ? Number(element.expense_portofolio.value) : 0,
                type_amount: element.expense_select_amount.value,
                category: category_input
            }

            if (def.type_amount !== "nominal") {
                let percentResult = (def.amount / 100) * totalIncome;
                def.percent = def.amount
                def.amount = percentResult
            }

            data.expense.saving.push(def)
        }


    }
    load()
}

// ADD INPUT INCOME & EXPENSE END