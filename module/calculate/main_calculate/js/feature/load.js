import { element } from "../dom/domElement.js";
import { data } from "../../../finance.js";
import { incomeResult, resultSelect } from "./utility.js";

// DISPLAY
function display() {
    const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = Object.values(data.expense).flat().map(e => e.amount).reduce((sum, item) => sum + item, 0);
    const totalBalance = totalIncome - totalExpense;

    element.income_display.textContent = `Rp. ${totalIncome.toLocaleString("id-ID")}`;
    element.expense_display.textContent = `Rp. ${totalExpense.toLocaleString("id-ID")}`;
    element.balance_display.textContent = `Rp. ${totalBalance.toLocaleString("id-ID")}`;
}
// DISPLAY END


// LOAD DATA PERCENT
function loadExpensePercent() {
    const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0)

    for (const key in data.expense) {
        if (data.expense[key].find(e => e.percent)) {
            data.expense[key].filter(item => item.percent).forEach(item => {
                item.amount = (item.percent / 100) * totalIncome;
            })
        }
    }
}


// LIST
function list() {
    // INCOME
    element.income_list.innerHTML = "";

    data.income.length > 0 ? element.income_list_note.classList.add("hide") : element.income_list_note.classList.remove("hide");

    if (data.income.length > 0) {
        let key_container = document.createElement("div");
        key_container.classList.add("key-container");

        let p_key = document.createElement("p");
        p_key.textContent = `Category: income`;

        let key_list = document.createElement("div");
        key_list.classList.add("key-list");

        key_container.append(p_key, key_list)

        data.income.forEach(e => {
            let key_item = document.createElement("div");
            key_item.classList.add("key-item");

            let div_title = document.createElement("div");
            div_title.classList.add("div-title");

            let p_title = document.createElement("p");
            p_title.textContent = `Name: ${e.name}`;

            let btn_del = document.createElement("button");
            btn_del.dataset.id = e.id;
            btn_del.dataset.category = e.category;
            btn_del.classList.add("btn-del");
            btn_del.textContent = `X`;

            div_title.append(p_title, btn_del);

            let div_item = document.createElement("div");
            div_item.classList.add("div-item")

            let p_amount = document.createElement("p");
            p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}`;

            div_item.append(p_amount)

            key_item.append(div_title, div_item)
            key_list.append(key_item)
        })
        element.income_list.append(key_container)
    };

    // EXPENSE
    element.expense_list.innerHTML = "";


    if (element.list_select.value === "all") {

        Object.values(data.expense).flat().length > 0 ? element.expense_list_note.classList.add("hide") : element.expense_list_note.classList.remove("hide");

        if (Object.values(data.expense).flat().length > 0) {
            for (const key in data.expense) {
                if (data.expense[key].length > 0) {

                    let key_container = document.createElement("div")
                    key_container.classList.add("key-container");
                    let p_key = document.createElement("p")
                    p_key.textContent = `Category: ${key}`;

                    let key_list = document.createElement("div")
                    key_list.classList.add("key-list")

                    key_container.append(p_key, key_list);

                    data.expense[key].forEach(e => {

                        let key_item = document.createElement("div");
                        key_item.classList.add("key-item")

                        let div_title = document.createElement("div");
                        div_title.classList.add("div-title")

                        let p_title = document.createElement("p");
                        p_title.textContent = `Name: ${e.name}`;

                        let btn_del = document.createElement("button");
                        btn_del.textContent = `X`;
                        btn_del.dataset.id = e.id;
                        btn_del.dataset.category = e.category;
                        btn_del.classList.add("btn-del");

                        div_title.append(p_title, btn_del);

                        let div_item = document.createElement("div");
                        div_item.classList.add("div-item");

                        if (key === "expense") {
                            let p_amount = document.createElement("p");

                            if (e.type_amount !== "nominal") {
                                p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                            } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                            div_item.append(p_amount);
                        }

                        if (key === "invest") {
                            let p_amount = document.createElement("p");

                            let p_takeProfit = document.createElement("p");
                            p_takeProfit.textContent = `Take Profit: ${e.takeProfit} %`;

                            let p_portofolio = document.createElement("p");
                            p_portofolio.textContent = `Portofolio: ${e.portofolio.toLocaleString("id-ID")}`;

                            if (e.type_amount !== "nominal") {
                                p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                            } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                            div_item.append(p_amount, p_takeProfit, p_portofolio);
                        }

                        if (key === "interest") {
                            let p_amount = document.createElement("p");

                            let p_interest = document.createElement("p");

                            let p_portofolio = document.createElement("p");
                            p_portofolio.textContent = `Portofolio: ${e.portofolio.toLocaleString("id-ID")}`;

                            if (e.type_amount !== "nominal") {
                                p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                            } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                            if (e.type_interest !== "monthly") {
                                p_interest.textContent = `Interest: ${e.interest}% / Month`
                            } else {
                                let sisa = e.interest / 12;
                                p_interest.textContent = `Interest: ${e.interest}% / Year (${sisa.toFixed(2)}% / Month)`
                            }
                            div_item.append(p_amount, p_interest, p_portofolio);
                        }

                        if (key === "saving") {
                            let p_amount = document.createElement("p");

                            let p_portofolio = document.createElement("p");
                            p_portofolio.textContent = `Portofolio: Rp. ${e.portofolio.toLocaleString("id-ID")}`

                            if (e.type_amount !== "nominal") {
                                p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                            } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                            div_item.append(p_amount, p_portofolio);
                        }

                        key_item.append(div_title, div_item)

                        key_list.append(key_item)
                    })
                    element.expense_list.append(key_container)
                }

            }
        }
    }

    else if (element.list_select.value !== "all") {
        data.expense[element.list_select.value].length === 0 ? element.expense_list_note.classList.remove("hide") : element.expense_list_note.classList.add("hide");

        const key = element.list_select.value;

        if (data.expense[element.list_select.value].length > 0) {
            let key_container = document.createElement("div")
            key_container.classList.add("key-container");
            let p_key = document.createElement("p")
            p_key.textContent = `Category: ${element.list_select.value}`;

            let key_list = document.createElement("div")
            key_list.classList.add("key-list")

            key_container.append(p_key, key_list);

            let key_item = document.createElement("div");
            key_item.classList.add("key-item");

            data.expense[element.list_select.value].forEach(e => {

                let div_title = document.createElement("div");
                div_title.classList.add("div-title")

                let p_title = document.createElement("p");
                p_title.textContent = `Name: ${e.name}`;

                let btn_del = document.createElement("button");
                btn_del.textContent = `X`;
                btn_del.dataset.id = e.id;
                btn_del.dataset.category = e.category;
                btn_del.classList.add("btn-del");

                div_title.append(p_title, btn_del);

                let div_item = document.createElement("div");
                div_item.classList.add("div-item");


                if (key === "expense") {
                    let p_amount = document.createElement("p");

                    if (e.type_amount !== "nominal") {
                        p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                    } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                    div_item.append(p_amount);
                }

                if (key === "invest") {
                    let p_amount = document.createElement("p");

                    let p_takeProfit = document.createElement("p");
                    p_takeProfit.textContent = `Take Profit: ${e.takeProfit} %`;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: ${e.portofolio.toLocaleString("id-ID")}`;

                    if (e.type_amount !== "nominal") {
                        p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                    } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                    div_item.append(p_amount, p_takeProfit, p_portofolio);
                }

                if (key === "interest") {
                    let p_amount = document.createElement("p");

                    let p_interest = document.createElement("p");

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: ${e.portofolio.toLocaleString("id-ID")}`;

                    if (e.type_amount !== "nominal") {
                        p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                    } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                    if (e.type_interest !== "monthly") {
                        p_interest.textContent = `Interest: ${e.interest}% / Month`
                    } else {
                        let sisa = e.interest / 12;
                        p_interest.textContent = `Interest: ${e.interest}% / Year (${sisa.toFixed(2)}% / Month)`
                    }
                    div_item.append(p_amount, p_interest, p_portofolio);
                }

                if (key === "saving") {
                    let p_amount = document.createElement("p");

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${e.portofolio.toLocaleString("id-ID")}`

                    if (e.type_amount !== "nominal") {
                        p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")} (${e.percent}%)`;
                    } else { p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}` };

                    div_item.append(p_amount, p_portofolio);
                }

                key_item.append(div_title, div_item)
            })

            key_list.append(key_item)
            element.expense_list.append(key_container)
        }
    }

    document.querySelectorAll(".btn-del").forEach(e => {
        e.addEventListener("click", () => {
            let id = Number(e.dataset.id)
            if (e.dataset.category === "income") data.income = data.income.filter(item => item.id !== id)
            else { data.expense[e.dataset.category] = data.expense[e.dataset.category].filter(item => item.id !== id) }
            load()
        })
    })
}

element.list_select.addEventListener("change", () => list())
// LIST END



// RESULT
let keyMapping = {}
element.result_select.addEventListener("change", ()=> resultSelect(keyMapping))
export function result() {

    // MELAKUKAN FILTER SELAIN EXPENSE TYPE NOMINAL MAKA AKAN MASUK
    const expenseFiltered = {};
    for (const key in data.expense) {
        if (data.expense[key].length > 0) {
            if (key === "expense" && data.expense.expense.find(e => e.type_amount !== "nominal")) {
                expenseFiltered.expense = data.expense.expense.filter(e => e.type_amount !== "nominal");
            }
            if (key !== "expense") { expenseFiltered[key] = data.expense[key] }
        }
    }

    // CEK APAKAH CATEGORY SELAIN EXPENSE ADA ISINYA ATAU TIDAK
    if (Object.values(expenseFiltered).flat().filter(e => e.category !== "expense").length === 0) return alert("Need input with non-expense category");


    const month = element.month_select.value !== "month" ? (Number(element.month_input.value) * 12) : Number(element.month_input.value);
    element.month_title.innerHTML = "";
    let month_title = document.createElement("p");
    element.month_title.append(month_title);

    if (month > 12) {
        let year = parseInt(month / 12);
        let sisa = month % 12;
        month_title.textContent = `${year} Year. ${sisa.toFixed(0)} Month`
    } else {
        month_title.textContent = `${month} Month`
    }


    element.income_result.innerHTML = "";
    element.expense_result.innerHTML = "";

    let result = {
        summary: {
            income: [],
            expense: [],
            balance: []
        },
        income: [],
        expense: {
            expense: [],
            invest: [],
            interest: [],
            saving: [],
        },
    }

    // TAMBAHKAN EXPENSE AMOUNT TYPE NOMINAL
    let totalExpense = 0
    if (data.expense.expense.find(e => e.type_amount === "nominal")) {
        data.expense.expense.forEach(e => {
            if (e.type_amount === "nominal") {
                totalExpense += e.amount
            }
        })
    }

    const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0)
    let TPLastMonth = 0;

    // BUAT KEY CONTAINER UNTUK SETIAP CATEGORY YANG ADA ISINYA
    keyMapping = {}
    for (const key in expenseFiltered) {
        keyMapping[key] = document.createElement("div");
        keyMapping[key].classList.add("key-container");
        let key_title = document.createElement("p");
        key_title.textContent = `Category: ${key}`;
        keyMapping[key].append(key_title);
        element.expense_result.append(keyMapping[key]);
    }

    resultSelect(keyMapping);



    let income_key_container = incomeResult();


    // MELAKUKAN SIMULASI
    for (let i = 1; i <= month; i++) {
        let incomeThisMonth = totalIncome + TPLastMonth;
        TPLastMonth = 0;
        let totalExpenseThisMonth = totalExpense;

        // INCOME
        (() => {
            let key_list = document.createElement("div");
            key_list.classList.add("key-result");
            income_key_container.append(key_list)

            result.income.push({ month: i, incomeThisMonth })
            let key_item = document.createElement("div");

            let p_month = document.createElement("p");

            if (i > 12) {
                let result = parseInt(i / 12);
                let sisa = i % 12;
                p_month.textContent = `${result} Year. ${sisa.toFixed(0)} Month`;
            } else {
                p_month.textContent = `${i} Month`;
            }


            key_list.append(p_month, key_item)

            let div_item = document.createElement("div");
            div_item.classList.add("div-item")
            let p_amount = document.createElement("p");
            p_amount.textContent = `Total Income: Rp. ${parseInt(incomeThisMonth).toLocaleString("id-ID")}`;
            div_item.append(p_amount);
            key_item.append(div_item);
        })();


        // EXPENSE
        for (const key in expenseFiltered) {
            let p_month = document.createElement("p");

            if (i > 12) {
                let result = parseInt(i / 12);
                let sisa = i % 12;
                p_month.textContent = `${result} Year. ${sisa.toFixed(0)} Month`;
            } else {
                p_month.textContent = `${i} Month`;
            }

            let key_list = document.createElement("div");
            key_list.classList.add("key-result");
            key_list.append(p_month)

            keyMapping[key].append(key_list);

            expenseFiltered[key].forEach(item => {

                let def = {
                    month: i,
                    name: item.name,
                    category: item.category,
                    type_amount: item.type_amount,
                    id: item.id
                }

                let portofolio;

                if (key !== "expense") {
                    portofolio = result.expense[key].findLast(e => e.id === item.id)?.portofolio ?? item.portofolio;
                }

                let key_item = document.createElement("div");
                key_item.classList.add("key-item");

                key_list.append(key_item);

                let p_title = document.createElement("p");
                p_title.textContent = `Name: ${item.name}`;

                let div_item = document.createElement("div"); // APPEND ITEM KESINI;
                div_item.classList.add("div-item")

                key_item.append(p_title, div_item)

                let totalAmount = item.percent ? (item.percent / 100) * incomeThisMonth : item.amount;
                totalExpenseThisMonth += totalAmount;

                let p_amount = document.createElement("p");
                p_amount.textContent = item.type_amount !== "nominal" ? `Amount: Rp. ${parseInt(totalAmount).toLocaleString("id-ID")} (${item.percent}%)` : `Amount: Rp. ${totalAmount.toLocaleString("id-ID")}`;

                // EXPENSE
                if (key === "expense") {
                    div_item.append(p_amount);

                    result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent })
                }

                // INVEST
                if (key === "invest") {
                    portofolio += totalAmount;
                    let takeProfit = (item.takeProfit / 100) * portofolio;
                    TPLastMonth += takeProfit;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${parseInt(portofolio).toLocaleString("id-ID")}`;

                    let p_takeProfit = document.createElement("p");
                    p_takeProfit.textContent = `Take Profit: Rp. ${parseInt(takeProfit).toLocaleString("id-ID")} (${item.takeProfit.toFixed(2)}%)`

                    if (item.type_amount !== "nominal") {
                        result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent, portofolio, takeProfit })
                    } else { result.expense[key].push({ ...def, amount: totalAmount, portofolio, takeProfit }) }
                    div_item.append(p_amount, p_portofolio, p_takeProfit);
                }

                // INTEREST
                if (key === "interest") {
                    portofolio += totalAmount;
                    let interest = item.type_interest !== "month" ? (item.interest / 12) : item.interest;
                    let profit = (interest / 100) * portofolio;
                    TPLastMonth += profit;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${parseInt(portofolio).toLocaleString("id-ID")}`;

                    let p_interest = document.createElement("p");
                    p_interest.textContent = item.type_interest !== "monthly" ? `Interest: Rp. ${parseInt(profit).toLocaleString("id-ID")} (${interest.toFixed(2)}% /month - ${item.interest.toFixed(2)}% /year)` : `Interest: Rp. ${parseInt(profit).toLocaleString("id-ID")} (${interest.toFixed(2)}% /month)`;

                    if (item.type_amount !== "nominal") {
                        result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent, portofolio, interest: profit })
                    } else { result.expense[key].push({ ...def, amount: totalAmount, portofolio, interest: profit }) }

                    div_item.append(p_amount, p_portofolio, p_interest);
                }

                // SAVING
                if (key === "saving") {
                    portofolio += totalAmount;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${parseInt(portofolio).toLocaleString("id-ID")}`;

                    if (item.type_amount !== "nominal") {
                        result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent, portofolio })
                    } else { result.expense[key].push({ ...def, amount: totalAmount, portofolio }) }

                    div_item.append(p_amount, p_portofolio)
                }

                totalExpense += totalAmount;
            })

        }
        let totalBalance = incomeThisMonth - totalExpense;
        result.summary.income.push({ month: i, amount: incomeThisMonth });
        result.summary.expense.push({ month: i, amount: totalExpense });
        result.summary.balance.push({ month: i, amount: totalBalance });
    }



    // HIDE NOTE
    for (const key in result) {
        let mapping = {
            income: element.income_result_note,
            expense: element.expense_result_note
        }
        if (key !== "summary") mapping[key].classList.add("hide");
    }

    data.result = result;
}

// RESULT END

// LOAD
export function load() {
    loadExpensePercent()
    display()
    list()
}
// LOAD END