import { element } from "../dom/domSelector.js";
import { loadDisplay, loadList } from "../view/view.js";
import { save } from "../feature/fungsiTambahan.js";

localStorage.removeItem("income")
localStorage.removeItem("expense")
localStorage.removeItem("firstList")

let income = [];
let expense = [];

let firstList = {
    income: [],
    expense: []
}

let saveData = {
    firstData: {},
    firstList: {
        income: [],
        expense: []
    },
    summary: {},
    cashFlow: {},
    list: {
        expense: [],
        invest: [],
        interest: [],
        saving: []
    }
}








function cekId(arr) {
    if (arr.length > 0) {
        return arr[arr.length - 1].id + 1
    } else { return 1 }
}

// FUNGSI JUMLAH SEMUA
function release(e) {
    return e.reduce((arr, curr) => {
        return arr + curr.amount
    }, 0)
}


// FUNGSI LOAD SEMUA
function loadAll() {
    loadDisplay()
    loadList()
}


// INCOME
export function addIncome(name, amount) {
    if (name === "" || isNaN(amount)) {
        return alert("Wajib mengisi input income dengan benar")
    }

    let isi = JSON.parse(localStorage.getItem("firstList")) || { income: [], expense: [] }

    let id = cekId(isi.income)

    let list = { id, name, amount, category: "income" }

    isi.income.push(list)

    income = isi.income

    localStorage.setItem("firstList", JSON.stringify(isi))
    loadAll()
}



// EXPENSE
export function addExpense(name, amount, type, category) {
    if (name === "" || isNaN(amount)) {
        return alert("Wajib mengisi input expense dengan benar")
    }

    let isi = JSON.parse(localStorage.getItem("firstList")) || { income: [], expense: [] }

    income = isi.income

    if (income.length <= 0) {
        return alert(`Masukkan Income dahulu`)
    }

    let list = {}

    let id = cekId(isi.expense)

    let nominal = 0

    if (type === "percent") {
        let totalIncome = income.reduce((acc, arr) => { return acc + arr.amount }, 0)
        nominal = totalIncome * (amount / 100)
        list = { id, name, amountPercent: amount, amount: nominal, type, category }
    }

    else if (type === "nominal") {
        list = { id, name, amount, type, category }
    }

    isi.expense.push(list)

    expense = isi.expense

    localStorage.setItem("firstList", JSON.stringify(isi))

    loadAll()
}




// INVEST DEPOSIT PAKAI %
export function addInvest(name, deposit, tp, portofolio, category) {
    if (name === "" || isNaN(deposit) || isNaN(tp)) {
        return alert("Wajib mengisi input invest dengan benar")
    }

    let isi = JSON.parse(localStorage.getItem("firstList")) || { income: [], expense: [] }

    income = isi.income

    if (income.length <= 0) {
        return alert(`Masukkan Income Dahulu`)
    }

    let id = cekId(isi.expense)

    let totalIncome = income.reduce((acc, arr) => { return acc + arr.amount }, 0)

    let nominalDeposit = totalIncome * (deposit / 100)

    let list = { id, name, depositPercent: deposit, deposit: nominalDeposit, tpPercent: tp, portofolio, type: "percent", category }

    isi.expense.push(list)

    expense = isi.expense

    localStorage.setItem("firstList", JSON.stringify(isi))

    loadAll()
}


// INTEREST
export function addInterest(name, deposit, tp, portofolio, type, category) {
    if (name === "" || isNaN(deposit) || isNaN(tp)) {
        return alert(`Tolong isi semua input interest`)
    }

    let isi = JSON.parse(localStorage.getItem("firstList")) || { income: [], expense: [] }
    income = isi.income

    if (income.length <= 0) {
        return alert(`Masukkan Inomce Dahulu`)
    }

    let totalIncome = income.reduce((acc, arr) => { return acc + arr.amount }, 0)

    let nominalDeposit = totalIncome * (deposit / 100)

    let id = cekId(isi.expense)

    let list = { id, name, depositPercent: deposit, deposit: nominalDeposit, tpPercent: tp, portofolio, type, category }

    isi.expense.push(list)

    expense = isi.expense

    localStorage.setItem("firstList", JSON.stringify(isi))

    loadAll()
}


// SAVING
export function addSaving(name, amount, portofolio, type, category) {
    if (name === "" || isNaN(amount)) {
        return alert(`Tolong isi input saving dengan benar`)
    }

    let isi = JSON.parse(localStorage.getItem("firstList")) || { income: [], expense: [] }

    income = isi.income

    if (income.length <= 0) {
        return alert(`Masukkan Income Dahulu`)
    }

    let list = {}

    let nominal = 0

    let totalIncome = income.reduce((acc, curr) => {
        return acc + curr.amount
    }, 0)

    let id = cekId(isi.expense)

    if (type === "percent") {
        nominal = totalIncome * (amount / 100)
        list = { id, name, amountPercent: amount, amount: nominal, portofolio, type, category }
    }

    else if (type === "nominal") {
        list = { id, name, amount, portofolio, type, category }
    }

    isi.expense.push(list)

    expense = isi.expense

    localStorage.setItem("firstList", JSON.stringify(isi))

    loadAll()
}



// SIMULATE
export function addSimulate(month, type) {
    let ul = element.simulationUl
    ul.innerHTML = ""

    if (type === "year") {
        month *= 12
    }

    firstList = JSON.parse(localStorage.getItem("firstList")) || { income: [], expense: [] }

    saveData.list = {
        expense: [],
        invest: [],
        interest: [],
        saving: []
    }

    income = firstList.income
    expense = firstList.expense

    if (income.length === 0 || expense.length === 0) {
        return alert("Masukkan terlebuh dahulu income dan expense")
    }

    if (isNaN(month)) {
        return alert("Masukkan input simualsi dengan benar")
    }

    let cashFlow = {
        income: [],
        expense: [],
        balance: []
    }

    
    let totalIncome = release(income)
    let incomeAwal = totalIncome
    let incomeBulanIni = 0
    let profitBulanIni = 0
    let totalExpense = 0
    let totalBalance = 0

    // GROUP
    let expenseGroup = expense.filter(e => e.category === "expense")
    let investGroup = expense.filter(e => e.category === "invest")
    let interestGroup = expense.filter(e => e.category === "interest")
    let savingGroup = expense.filter(e => e.category === "saving")


    // EXPENSE
    let expenseNominal = expenseGroup.filter(e => e.type === "nominal").reduce((acc, arr) => acc + arr.amount, 0)

    // CLEAR STORAGE
    localStorage.removeItem("data")

    for (let bulan = 1; bulan <= month; bulan++) {
        profitBulanIni = 0
        incomeBulanIni = totalIncome
        let li = document.createElement("li") //LABEL BULAN
        li.textContent = `Month ${bulan}`
        li.classList.add("div-list")
        let labelIncome = document.createElement("div")
        let labelExpense = document.createElement("div")
        let labelBalance = document.createElement("div")
        labelIncome.classList.add("label")
        labelExpense.classList.add("label")
        labelBalance.classList.add("label")
        let detailContainer = document.createDocumentFragment()
        detailContainer.textContent = `List:`
        let expenseFix = expenseNominal

        // EXPENSE
        if (expenseGroup.length > 0) {
            let nominal = 0
            let expense = []
            expenseGroup.forEach(e => {
                if (e.type === "nominal") {

                    expense.push({
                        id: e.id,
                        month: bulan,
                        name: e.name,
                        amount: e.amount,
                        type: e.type,
                        category: e.category
                    })

                    let div = document.createElement("div")
                    let liDiv = document.createElement("li")
                    liDiv.textContent = `Expense - [${e.name}] | Rp. ${e.amount.toLocaleString("id-ID")}`
                    div.appendChild(liDiv)
                    detailContainer.appendChild(div)
                }

                if (e.type === "percent") {

                    let nominalThis = incomeBulanIni * (e.amountPercent / 100)
                    nominal += nominalThis

                    expense.push({
                        id: e.id,
                        month: bulan,
                        name: e.name,
                        amountPercent: e.amountPercent,
                        amount: nominal,
                        type: e.type,
                        category: e.category
                    })

                    let div = document.createElement("div")
                    let liDiv = document.createElement("li")
                    liDiv.textContent = `Expense - [${e.name}] | (${e.amountPercent}%) Rp. ${nominalThis.toLocaleString("id-ID")}`
                    div.appendChild(liDiv)
                    detailContainer.appendChild(div)
                }
            })
            save(saveData, "expense", expense)
            expenseFix += nominal
        }


        // INVEST
        if (investGroup.length > 0) {
            let invest = []
            investGroup.forEach(e => {
                // TAMBAH DEPOSIT
                let deposit = incomeBulanIni * (e.depositPercent / 100)
                // CEK PORTO
                let portofolio = e.portofolio
                portofolio += deposit
                e.portofolio = portofolio //UPDATE NILAI PORTO

                let tp = portofolio * (e.tpPercent / 100)

                expenseFix += deposit

                profitBulanIni += tp

                let div = document.createElement("div")
                let liDiv = document.createElement("li")
                liDiv.textContent = `Invest - [${e.name}] | Deposit (${e.depositPercent}%) Rp. ${deposit.toLocaleString("id-ID")} | Portofolio Rp. ${portofolio.toLocaleString("id-ID")} | Profit (${e.tpPercent}%) Rp. ${tp.toLocaleString("id-ID")}`
                div.appendChild(liDiv)
                detailContainer.appendChild(div)

                invest.push({
                    id: e.id,
                    month: bulan,
                    name: e.name,
                    depositPercent: e.depositPercent,
                    deposit: deposit,
                    tpPercent: e.tpPercent,
                    tp: tp,
                    portofolio: portofolio,
                    type: e.type,
                    category: e.category
                })
            })
            save(saveData, "invest", invest)
        }

        // INTERST
        if (interestGroup.length > 0) {
            let interest = []

            interestGroup.forEach(e => {
                // AMBIL DEPOSIT DARI INCOME BULAN INI
                let deposit = incomeBulanIni * (e.depositPercent / 100)

                expenseFix += deposit

                //CEK PORTOFOLIO
                let portofolio = e.portofolio
                portofolio += deposit
                e.portofolio = portofolio

                let tp = 0
                let tpType = 0
                if (e.type === "month") {
                    tp = portofolio * (e.tpPercent / 100)
                    tpType = e.tpPercent
                } else if (e.type === "year") {
                    tp = portofolio * (e.tpPercent / 100 / 12)
                    tpType = e.tpPercent / 12
                }

                profitBulanIni += tp

                let div = document.createElement("div")
                let liDiv = document.createElement("li")
                liDiv.textContent = `Interest - [${e.name}] | Deposit (${e.depositPercent}%) Rp. ${deposit.toLocaleString("id-ID")} | Portofolio Rp. ${portofolio.toLocaleString("id-ID")} | Profit (${tpType.toFixed(2)}%) Rp. ${tp.toLocaleString("id-ID")}`
                div.appendChild(liDiv)
                detailContainer.appendChild(div)

                interest.push({
                    id: e.id,
                    month: bulan,
                    name: e.name,
                    depositPercent: e.depositPercent,
                    deposit: deposit,
                    tpPercent: tpType,
                    tp: tp,
                    portofolio: portofolio,
                    type: e.type,
                    category: e.category
                })
            })
            save(saveData, "interest", interest)
        }


        // SAVING
        if (savingGroup.length > 0) {
            let saving = []

            savingGroup.forEach(e => {
                let nominal = 0
                if (e.type === "percent") {
                    nominal = incomeBulanIni * (e.amountPercent / 100)
                }

                else if (e.type === "nominal") {
                    nominal = e.amount
                }

                expenseFix += nominal
                
                console.log(nominal)

                let portofolio = e.portofolio
                portofolio += nominal
                e.portofolio = portofolio

                let div = document.createElement("div")
                let liDiv = document.createElement("li")

                if (e.type === "percent") {
                    saving.push({
                        id: e.id,
                        month: bulan,
                        name: e.name,
                        amountPercent: e.amountPercent,
                        amount: nominal,
                        portofolio,
                        type: e.type,
                        category: e.category
                    })
                    liDiv.textContent = `Saving - [${e.name}] | Deposit (${e.amountPercent}%) Rp. ${nominal.toLocaleString("id-ID")}  | Portofolio Rp. ${portofolio.toLocaleString("id-ID")}`
                }

                else if (e.type === "nominal") {
                    saving.push({
                        id: e.id,
                        month: bulan,
                        name: e.name,
                        amount: nominal,
                        portofolio,
                        type: e.type,
                        category: e.category
                    })
                    liDiv.textContent = `[${e.name}] | Deposit Rp. ${nominal.toLocaleString("id-ID")} | Portofolio Rp. ${portofolio.toLocaleString("id-ID")}`
                }
                div.appendChild(liDiv)
                detailContainer.appendChild(div)
            })
            save(saveData, "saving", saving)
        }


        if (bulan === 1) {
            let balance = totalIncome - expenseFix
            saveData.firstData = {
                income: totalIncome,
                expense: expenseFix,
                balance: balance
            }
        }


        totalExpense = expenseFix
        totalBalance = incomeBulanIni - totalExpense

        function formatNumber(value, digits = 0) {
            let num = Number(value.toFixed(digits));
            return num === 0 ? 0 : num;
        }

        totalBalance = formatNumber(totalBalance)

        totalIncome = incomeAwal + profitBulanIni

        console.log(totalIncome, "ini TotalIncome")
        console.log(incomeBulanIni, "ini incomeBulanIni")
        console.log(profitBulanIni, "ini profitBulanIni")


        cashFlow.income.push(
            {
                month: bulan,
                amount: incomeBulanIni
            }
        )

        cashFlow.expense.push({
            month: bulan,
            amount: totalExpense
        })

        cashFlow.balance.push({
            month: bulan,
            amount: totalBalance
        })

        if (bulan === month) {
            saveData.summary = {
                month: bulan,
                income: incomeBulanIni,
                expense: totalExpense,
                balance: totalBalance
            }
            saveData.cashFlow = cashFlow
        }

        labelIncome.textContent = `Total Income Rp. ${incomeBulanIni.toLocaleString("id-ID")}`
        labelExpense.textContent = `Total Expense Rp. ${totalExpense.toLocaleString("id-ID")}`
        labelBalance.textContent = `Total Balance Rp. ${totalBalance.toLocaleString("id-ID")}`



        li.appendChild(labelIncome)
        li.appendChild(labelExpense)
        li.appendChild(labelBalance)
        li.appendChild(detailContainer)
        ul.appendChild(li)
    }
}


element.save.addEventListener("click", () => {
    if (income.length <= 0 || expense.length <= 0) {
        return alert("Masukkan dahulu data sebelum save")
    }

    if (Object.keys(saveData.summary).length === 0 || Object.keys(saveData.cashFlow).length === 0) {
        return alert("Lakukan simulasi terlebih dahulu")
    }

    firstList = JSON.parse(localStorage.getItem("firstList"))
    saveData.firstList = firstList

    localStorage.setItem("data", JSON.stringify(saveData))
    window.location.href = `./list/list.html`
})


element.clear.addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})