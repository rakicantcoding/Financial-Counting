import { element } from "../dom/domSelector.js";


let h3 = element.labelExpense // LABEL
const expense = element.expenseContainer //EXPENSE
const invest = element.investContainer //INVEST
const interest = element.interestContainer //INTEREST
const saving = element.savingContainer //SAVING


export function option(category) {
    // AMBIL KATEGORI
    category = element.selectMain.value

    // PERBESAR HURUF UNTUK LABEL
    let label = category.toUpperCase()


    // EXPENSE
    if (category === "expense") {
        expense.classList.remove("hide")
        h3.textContent = `CATEGORY EXPENSE: ${label}`
        
        invest.classList.add("hide")
        interest.classList.add("hide")
        saving.classList.add("hide")
    }

    // INVEST
    else if (category === "invest") {
        invest.classList.remove("hide")
        h3.textContent = `CATEGORY EXPENSE: ${label}`

        expense.classList.add("hide")
        interest.classList.add("hide")
        saving.classList.add("hide")
    }

    // INTEREST
    else if (category === "interest") {
        interest.classList.remove("hide")
        h3.textContent = `CATEGORY EXPENSE: ${label} COMPOUNDING`
        element.interestTp.placeholder = `Interest Profit/Month [%]`
        
        expense.classList.add("hide")
        invest.classList.add("hide")
        saving.classList.add("hide")
    }

    else if (category === "saving") {
        saving.classList.remove("hide")
        h3.textContent = `CATEGORY EXPENSE: ${label}`
        
        expense.classList.add("hide")
        invest.classList.add("hide")
        interest.classList.add("hide")
    }


    // ERROR
    if (!category) {
        return console.log(`Terjadi error`)
    }
}


