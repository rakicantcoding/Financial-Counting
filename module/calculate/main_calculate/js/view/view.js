import { element } from "../dom/domSelector.js";
import { totalExpense } from "../feature/fungsiTambahan.js";

function hitungPercent(income, percent) {
    return income * (percent / 100)
}




// DISPLAY INVEST
export function loadDisplay() {
    let firstList = JSON.parse(localStorage.getItem("firstList")) || [{ income: [], expense: [] }]
    let income = firstList.income
    let expense = firstList.expense
    let totalIncome = income.reduce((acc, curr) => {
        return acc + curr.amount
    }, 0)

    let fixExpense = totalExpense(income, expense)
    let totalBalance = totalIncome - fixExpense

    console.log(`Total: ${fixExpense.toLocaleString("id-ID")}`)

    element.incomeDisplay.textContent = `Total Income Rp. ${totalIncome.toLocaleString("id-ID")}`
    element.expenseDisplay.textContent = `Total Expense Rp. ${fixExpense.toLocaleString("id-ID")}`
    element.balanceDisplay.textContent = `Total Balance Rp. ${totalBalance.toLocaleString("id-ID")}`
}




export function loadList() {
    let firstList = JSON.parse(localStorage.getItem("firstList"))
    let ulIncome = element.listIncomeUl
    ulIncome.innerHTML = ""

    let ulExpense = element.listExpenseUl
    ulExpense.innerHTML = ""

    let income = firstList.income
    let expense = firstList.expense.filter(e=>e.category === "expense")
    let invest = firstList.expense.filter(e=> e.category === "invest")
    let interest = firstList.expense.filter(e=> e.category === "interest")
    let saving = firstList.expense.filter(e=> e.category === "saving")

    income.forEach(e => {
        let li = document.createElement("li")
        let button = document.createElement("button")
        button.classList.add("button-delete")
        button.textContent = `❌`
        button.onclick = () => {
            firstList.income = firstList.income.filter(item => item.id !== e.id)

            localStorage.setItem("firstList", JSON.stringify(firstList))
            loadList()
            loadDisplay()
        }

        li.textContent = `Income - [${e.name}] | Rp. ${e.amount.toLocaleString("id-ID")}`
        li.appendChild(button)
        ulIncome.appendChild(li)
    })

    let totalIncome = firstList.income.reduce((acc, curr) => {
        return acc + curr.amount
    }, 0)

    // EXPENSE
    if (expense.length > 0) {
        expense.forEach(e => {
            let li = document.createElement("li")
            let button = document.createElement("button")
            button.classList.add("button-delete")
            button.textContent = `❌`
            button.onclick = () => {
                firstList.expense = firstList.expense.filter(item => item.id !== e.id)

                localStorage.setItem("firstList", JSON.stringify(firstList))
                loadList()
                loadDisplay()
            }
            if (e.type === "nominal") {
                li.textContent = `Expense - [${e.name}] Rp. ${e.amount.toLocaleString("id-ID")}`
            }
            else if (e.type === "percent") {
                let nominal = hitungPercent(totalIncome, e.amountPercent)
                li.textContent = `Expense - [${e.name}] (${e.amountPercent}%) Rp. ${nominal.toLocaleString("id-ID")}`
            }

            li.appendChild(button)
            ulExpense.appendChild(li)
        })
    }

    // INVEST
    if (invest.length > 0) {
        invest.forEach(e => {
            let li = document.createElement("li")
            let button = document.createElement("button")
            button.classList.add("button-delete")
            button.textContent = `❌`
            button.onclick = () => {
                firstList.expense = firstList.expense.filter(item => item.id !== e.id)

                localStorage.setItem("firstList", JSON.stringify(firstList))
                loadList()
                loadDisplay()
            }
            let nominal = hitungPercent(totalIncome, e.depositPercent)

            let portoStart = e.portofolio

            li.textContent = `Invest - [${e.name}] Deposit (${e.depositPercent}%) Rp. ${nominal.toLocaleString("id-ID")} | TP (${e.tpPercent}%) | Portofolio Start Rp. ${portoStart.toLocaleString("id-ID")}`

            li.appendChild(button)
            ulExpense.appendChild(li)
        })
    }


    // INTEREST
    if (interest.length > 0) {
        interest.forEach(e => {
            let li = document.createElement("li")
            let button = document.createElement("button")
            button.classList.add("button-delete")
            button.textContent = `❌`
            button.onclick = () => {
                firstList.expense = firstList.expense.filter(item => item.id !== e.id)

                localStorage.setItem("firstList", JSON.stringify(firstList))
                loadList()
                loadDisplay()
            }
            let nominal = hitungPercent(totalIncome, e.depositPercent)

            let portoStart = e.portofolio

            if (e.type === "month") {
                li.textContent = `Interest - [${e.name}] Deposit (${e.depositPercent}%) Rp. ${nominal.toLocaleString("id-ID")} | TP/${e.type} (${e.tpPercent}%/month) | Portofolio Start Rp. ${portoStart.toLocaleString("id-ID")}`
            }

            else if (e.type === "year") {
                let tpType = e.tpPercent / 12

                li.textContent = `Interest - [${e.name}] Deposit (${e.depositPercent}%) Rp. ${nominal.toLocaleString("id-ID")} | TP/${e.type} (${e.tpPercent}%) (${tpType.toFixed(2)}%/month) | Portofolio Start Rp. ${portoStart.toLocaleString("id-ID")}.`
            }

            li.appendChild(button)
            ulExpense.appendChild(li)
        })
    }

    // SAVING

    if (saving.length > 0) {
        saving.forEach(e => {
            let li = document.createElement("li")
            let button = document.createElement("button")
            button.classList.add("button-delete")
            button.textContent = `❌`
            button.onclick = () => {
                firstList.expense = firstList.expense.filter(item => item.id !== e.id)

                localStorage.setItem("firstList", JSON.stringify(firstList))
                loadList()
                loadDisplay()
            }
            let nominal = 0

            if (e.type === "percent") {
                nominal = totalIncome * (e.amountPercent / 100)
                li.textContent = `Saving - [${e.name}] Deposit Rp. ${nominal.toLocaleString("id-ID")} (${e.amountPercent}%) | Portofolio Start Rp. ${e.portofolio.toLocaleString("id-ID")}`
            }

            else if (e.type === "nominal") {
                nominal = e.amount
                li.textContent = `Saving - [${e.name}] Deposit Rp. ${nominal.toLocaleString("id-ID")} | Portofolio Start Rp. ${e.portofolio.toLocaleString("id-ID")}`
            }

            li.appendChild(button)
            ulExpense.appendChild(li)
        })
    }
}






export function expenseOption(opsi) {
    let input = element.expenseAmount

    if (opsi === "nominal") {
        input.placeholder = `Expense Amount Nominal`
    }
    else {
        input.placeholder = `Expense Amount Percent %`
    }
}




export function interestOption(opsi) {
    let input = element.interestTp

    if (opsi === "month") {
        input.placeholder = `Interest Profit/Month [%]`
    } else {
        input.placeholder = `Interest Profit/Year [%]`
    }
}


export function savingOption(opsi) {
    let input = element.savingAmount

    if (opsi === " nominal") {
        input.textContent = `Savinng Amount Nominal`
    }

    else {
        input.placeholder = `Saiving Amount Percent %`
    }
}