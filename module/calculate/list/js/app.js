import { element } from "../js/dom/domSelector.js";
import { perbandingan } from "./feature/perbandingan.js";
import { show } from "./view/view.js";

let saveData = JSON.parse(localStorage.getItem("data"))

if (!saveData) {
    alert(`Tolong simpan dahulu simulasinya`)
    window.location.href = "../"
}


// FIRST DATA
let firstData = saveData.firstData

let firstIncome = firstData.income
let firstExpense = firstData.expense
let firstBalance = firstData.balance



// SUMMARY
let summary = saveData.summary

let bulan = summary.month
let tahun = 0
if (bulan > 12) tahun = bulan / 12;
console.log(bulan, tahun)

let totalIncome = summary.income
let totalExpense = summary.expense
let totalBalance = summary.balance


// PERBANDINGAN
function display() {
    let perbandinganIncome = perbandingan(firstIncome, totalIncome)
    let perbandinganExpense = perbandingan(firstExpense, totalExpense)
    let perbandinganBalance = perbandingan(firstBalance, totalBalance)

    // NOMINAL
    let income = totalIncome - firstIncome
    let expense = totalExpense - firstExpense
    let balance = totalBalance - firstBalance

    tahun > 1 ? element.hasilBulan.textContent = `Perkembangan Selama ${tahun.toFixed(1)} Tahun - (${bulan} Bulan)` : element.hasilBulan.textContent = `Perkembangan Selama ${bulan} Bulan:`
    element.hasilIncome.textContent = `Income: (${perbandinganIncome.toFixed(2)}%) Rp. ${Math.round(income).toLocaleString("id-ID")}`
    element.hasilExpense.textContent = `Expense: (${perbandinganExpense.toFixed(2)}%) Rp. ${Math.round(expense).toLocaleString("id-ID")}`
    if (perbandinganBalance === 0) {
        return element.hasilBalance.textContent = `Balance: (${perbandinganBalance}%) Rp. ${Math.round(balance).toLocaleString("id-ID")}`
    }
    element.hasilBalance.textContent = `Balance: (${perbandinganBalance.toFixed(2)}%) Rp. ${Math.round(balance).toLocaleString("id-ID")}`
}





function firstList() {
    let beforeList = saveData.firstList
    let displayIncome = element.incomeDisplayBefore
    let displayExpense = element.expenseDisplayBefore
    let displayBalance = element.balanceDisplayBefore

    let listExpense = beforeList.expense.filter(e => e.category === "expense")
    let listInvest = beforeList.expense.filter(e => e.category === "invest")
    let listInterest = beforeList.expense.filter(e => e.category === "interest")
    let listSaving = beforeList.expense.filter(e => e.category === "saving")

    let income = beforeList.income.reduce((acc, arr) => { return acc + arr.amount }, 0)
    let expense = 0


    function createToggleSection(title, items, renderItem) {
        let div = document.createElement("div");
        div.classList.add("hide");

        let button = document.createElement("button");
        button.classList.add("toggle-btn");
        element.containerListBefore.appendChild(button);

        show(button, title, div); // toggle menu

        let ul = document.createElement("ul");

        let p = document.createElement("p")
        p.textContent = `Month - 1`

        ul.appendChild(p)

        // Isi list
        items.flat().forEach(item => {
            let li = document.createElement("li");
            li.textContent = renderItem(item);
            ul.appendChild(li);
        });

        div.appendChild(ul);
        element.containerListBefore.appendChild(div);
    }


    // EXPENSE
    if (listExpense.length > 0) {
        createToggleSection("Expense", listExpense, item => {
            expense += item.amount
            if (item.type === "nominal") {
                return `[${item.name}] | Rp. ${item.amount.toLocaleString("id-ID")}`
            } else { return `[${item.name}] | (${item.amountPercent.toFixed(2)}%) Rp. ${item.amount.toLocaleString("id-ID")}` }
        })
    }


    // INVEST
    if (listInvest.length > 0) {
        createToggleSection("Invest", listInvest, item => {
            expense += item.deposit
            return `[${item.name}] | Deposit (${item.depositPercent.toFixed(2)}%) Rp. ${item.deposit.toLocaleString("id-ID")} | Portofolio Start Rp. ${item.portofolio.toLocaleString("id-ID")} | TP (${item.tpPercent.toFixed(2)}%)`
        })
    }


    // INTEREST
    if (listInterest.length > 0) {
        createToggleSection("Interest", listInterest, item => {
            expense += item.deposit
            if (item.type === "month") {
                return `[${item.name}] | Deposit (${item.depositPercent.toFixed(2)}%) Rp. ${item.deposit.toLocaleString("id-ID")} | Portofolio Start Rp. ${item.portofolio.toLocaleString("id-ID")} | TP/MONTH (${item.tpPercent.toFixed(2)}%)`
            } else if (item.type === "year") {
                let tpMonth = item.tpPercent / 12
                return `[${item.name}] | Deposit (${item.depositPercent.toFixed(2)}%) Rp. ${item.deposit.toLocaleString("id-ID")} | Portofolio Start Rp. ${item.portofolio.toLocaleString("id-ID")} | TP (${item.tpPercent}%/Year) > TP (${tpMonth.toFixed(2)}%/Month) `
            }
        })
    }


    // SAVING
    if (listSaving.length > 0) {
        createToggleSection("Saving", listSaving, item => {
            expense += item.amount
            console.log(listSaving)
            if (item.type === "nominal") {
                return `[${item.name}] | Deposit (${item.amountPercent}%) Rp. ${item.amount.toLocaleString("id-ID")} | Portofolio Start Rp. ${item.portofolio.toLocaleString("id-ID")}`
            } else if (item.type === "percent") {
                return `[${item.name}] | Deposit (${item.amountPercent}%) Rp. ${item.amount.toLocaleString("id-ID")} | Portofolio Start Rp. ${item.portofolio.toLocaleString("id-ID")}`
            }
        })
    }

    let balance = income - expense

    displayIncome.textContent = `Total Income: Rp. ${income.toLocaleString("id-ID")}`
    displayExpense.textContent = `Total Expense: Rp. ${expense.toLocaleString("id-ID")}`
    displayBalance.textContent = `Total Balance: Rp. ${balance.toLocaleString("id-ID")}`
}


function afterList() {
    element.labelAfter.textContent = `After ${bulan} Month:`

    element.incomeDisplayAfter.textContent = `Total Income: Rp ${totalIncome.toLocaleString("id-ID")}`
    element.expenseDisplayAfter.textContent = `Total Expense: Rp. ${totalExpense.toLocaleString("id-ID")}`
    element.balanceDisplayAfter.textContent = `Total Balance: Rp. ${totalBalance.toLocaleString("id-ID")}`
}


function cashflowBefore() {
    let firstData = saveData.firstData

    if (firstData.income) {
        let div = document.createElement("div")
        let ul = document.createElement("ul")
        let li = document.createElement("li")
        li.textContent = `Month 1 - Rp. ${firstData.income.toLocaleString("id-ID")}`
        ul.appendChild(li)
        div.appendChild(ul)
        element.incomeListBefore.appendChild(div)
    }


    if (firstData.expense) {
        let div = document.createElement("div")
        let ul = document.createElement("ul")
        let li = document.createElement("li")
        li.textContent = `Month 1 - Rp. ${firstData.expense.toLocaleString("id-ID")}`
        ul.appendChild(li)
        div.appendChild(ul)
        element.expenseListBefore.appendChild(div)
    }


    if (firstData.balance || !firstData.balance) {
        let div = document.createElement("div")
        let ul = document.createElement("ul")
        let li = document.createElement("li")
        li.textContent = `Month 1 - Rp. ${firstData.balance.toLocaleString("id-ID")}`
        ul.appendChild(li)
        div.appendChild(ul)
        element.balanceListBefore.appendChild(div)
    }
}


function cashflow() {
    let cashflow = saveData.cashFlow

    let incomeGroup = cashflow.income
    let expenseGroup = cashflow.expense
    let balanceGroup = cashflow.balance

    if (incomeGroup.length > 0) {
        let div = document.createElement("div")
        let ul = document.createElement("ul")

        incomeGroup.forEach(item => {
            let li = document.createElement("li")
            li.textContent = `Month ${item.month} - Rp. ${item.amount.toLocaleString("id-ID")}`
            ul.appendChild(li)
        })
        div.appendChild(ul)
        element.incomeCashFlow.appendChild(div)
    }


    if (expenseGroup.length > 0) {
        let div = document.createElement("div")
        let ul = document.createElement("ul")
        expenseGroup.forEach(item => {
            let li = document.createElement("li")
            li.textContent = `Month ${item.month} - Rp. ${item.amount.toLocaleString("id-ID")}`
            ul.appendChild(li)
        })
        div.appendChild(ul)
        element.expenseCashFlow.appendChild(div)
    }


    if (balanceGroup.length > 0) {
        let div = document.createElement("div")
        let ul = document.createElement("ul")
        balanceGroup.forEach(item => {
            let li = document.createElement("li")
            li.textContent = `Month ${item.month} - Rp. ${item.amount.toLocaleString("id-ID")}`
            ul.appendChild(li)
        })
        div.appendChild(ul)
        element.balanceCashFlow.appendChild(div)
    }
}




function list() {
    let list = saveData.list;

    console.log(list)

    // Helper function biar DRY
    function createToggleSection(title, items, renderItem, renderMonth) {
        let div = document.createElement("div");
        div.classList.add("hide");

        let month = 0


        let button = document.createElement("button");
        button.classList.add("toggle-btn");
        element.containerList.appendChild(button);

        show(button, title, div); // toggle menu

        let ul = null

        // Isi list
        items.flat().forEach(item => {
            if (month !== item.month) {
                month = item.month
                let p = document.createElement("p")
                p.textContent = renderMonth(month)
                div.appendChild(p)

                ul = document.createElement("ul")
                div.appendChild(ul)
            }

            let li = document.createElement("li");
            li.textContent = renderItem(item);
            ul.appendChild(li);
        });
        element.containerList.appendChild(div);
    }

    // EXPENSE
    if (list.expense.length > 0) {
        createToggleSection("Expense", list.expense, item => {
            if (item.type === "nominal") {
                return `[${item.name}] | Rp. ${item.amount.toLocaleString("id-ID")}`;
            } else if (item.type === "percent") {
                return `[${item.name}] | (${item.amountPercent.toFixed(2)}%) Rp. ${item.amount.toLocaleString("id-ID")} `;
            }
        }, month => `Month - ${month}`);
    }

    // INVEST
    if (list.invest.length > 0) {
        createToggleSection("Invest", list.invest, item => {
            return `[${item.name}] | Deposit (${item.depositPercent.toFixed(2)}%) Rp. ${item.deposit.toLocaleString("id-ID")} | Portofolio Rp. ${item.portofolio.toLocaleString("id-ID")} | TP (${item.tpPercent.toFixed(2)}%) Rp. ${item.tp.toLocaleString("id-ID")} `;
        }, month => `Month - ${month}`);
    }

    // INTEREST
    if (list.interest.length > 0) {
        createToggleSection("Interest", list.interest, item => {
            return `[${item.name}] | Deposit (${item.depositPercent.toFixed(2)} %) Rp. ${item.deposit.toLocaleString("id-ID")} | Portofolio Rp. ${item.portofolio.toLocaleString("id-ID")} | TP (${item.tpPercent.toFixed(2)}%) Rp. ${item.tp.toLocaleString("id-ID")} `;
        }, month => `Month - ${month}`);
    }

    // SAVING
    if (list.saving.length > 0) {
        createToggleSection("Saving", list.saving, item => {
            if (item.type === "percent") {
                return `[${item.name}] | Deposit (${item.amountPercent.toFixed(2)}%) Rp. ${item.amount.toLocaleString("id-ID")} | Portofolio Rp. ${item.portofolio.toLocaleString("id-ID")}`;
            } else if (item.type === "nominal") {
                return `[${item.name}] | Deposit Rp. ${item.amount.toLocaleString("id-ID")} | Portofolio Rp. ${item.portofolio.toLocaleString("id-ID")}`;
            }
        }, month => `Month - ${month}`);
    }
}



display()
firstList()
afterList()
cashflowBefore()
cashflow()
list()

show(element.incomeCashFlowButton, "Income", element.incomeCashFlow)
show(element.expenseCashFlowButton, "Expense", element.expenseCashFlow)
show(element.balanceCashFlowButton, "Balance", element.balanceCashFlow)

show(element.incomeBeforeButton, "Income", element.incomeListBefore)
show(element.expenseBeforeButton, "Expense", element.expenseListBefore)
show(element.balanceBeforeButton, "Balance", element.balanceListBefore)