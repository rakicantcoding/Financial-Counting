import { element } from "./dom/domSelector.js";
import { addIncome, addExpense, addInvest, addSimulate, addInterest, addSaving } from "./feature/finance.js";
import { option } from "./feature/functionOption.js";
import { expenseOption, interestOption, savingOption } from "./view/view.js";


element.simulationSelect.value = "month"


// BUTTON INCOME
element.incomeButton.addEventListener("click", () => {
    let name = element.incomeName.value.trim()
    let amount = parseFloat(element.incomeAmount.value)

    addIncome(name, amount)
})





// OPTION MAIN
let category = "expense"
element.selectMain.value = category
option(category)

element.selectMain.addEventListener("change", () => {
    option(category)
})




// EXPENSE OPTION
let expenseType = "nominal"
element.expenseSelect.value = expenseType

element.expenseSelect.addEventListener("change", () => {
    expenseType = element.expenseSelect.value
    expenseOption(expenseType)
})


element.expenseButton.addEventListener("click", () => {
    let name = element.expenseName.value.trim()
    let amount = parseFloat(element.expenseAmount.value)

    addExpense(name, amount, expenseType, "expense")
})





// BUTTON INVEST
element.investButton.addEventListener("click", () => {
    let name = element.investName.value.trim()
    let deposit = parseFloat(element.investAmount.value)
    let takeProfit = parseFloat(element.investTakePrpfit.value)
    let portofolio = parseFloat(element.investPortofolioAmount.value) || 0

    addInvest(name, deposit, takeProfit, portofolio, "invest")
})




// INTEREST OPTION
let interestType = "month"
element.interestSelect.value = interestType

element.interestSelect.addEventListener("change", () => {
    interestType = element.interestSelect.value
    interestOption(interestType)
})



// BUTTON INTEREST
element.interestButton.addEventListener("click", () => {
    let name = element.interestName.value.trim()
    let deposit = parseFloat(element.interestAmount.value)
    let takeProfit = parseFloat(element.interestTp.value)
    let portofolio = parseFloat(element.interestPortofolioAmount.value) || 0

    addInterest(name, deposit, takeProfit, portofolio, interestType, "interest")
})



let savingType = "nominal"
element.savingSelect.value = savingType

element.savingSelect.addEventListener("change", () => {
    savingType = element.savingSelect.value
    savingOption(savingType)
})


// BUTTON SAVING
element.savingButton.addEventListener("click", () => {
    let name = element.savingName.value.trim()
    let amount = parseFloat(element.savingAmount.value)
    let portofolio = parseFloat(element.savingPortofolioAmount.value) || 0

    addSaving(name, amount, portofolio, savingType, "saving")
})


let type = "month"
element.simulationSelect.addEventListener("change", () => {
    type = element.simulationSelect.value
})


// BUTTON SIMULASI
element.simulationButton.addEventListener("click", () => {
    let month = parseFloat(element.simulationInput.value)

    if (month < 0) {
        return alert(`Masukkan bulan simulasi dengan benar`)
    } else if (month === 0) {
        return alert(`Masukkan bulan lebih dari 0`)
    }
    addSimulate(month, type)
})


