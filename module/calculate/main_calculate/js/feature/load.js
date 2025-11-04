import { element } from "../dom/domElement.js";
import { data } from "../../../finance.js";

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
        p_key.textContent = `Income`;

        let key_list = document.createElement("div");
        key_list.classList.add("key-list");

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
        element.income_list.append(key_list)
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
export function result() {
    const month = Number(element.month_input.value);
    element.income_result.innerHTML = "";
    element.expense_result.innerHTML = "";

    const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0)
    let TPLastMonth = 0;



    const expenseFiltered = {};
    for (const key in data.expense) {
        if (data.expense[key].length > 0) {
            if (key === "expense") expenseFiltered.expense = data.expense.expense.filter(e => e.type_amount !== "nominal");
            else { expenseFiltered[key] = data.expense[key] }
        }
    }

    let keyMapping = {
        expense: document.createElement("div"),
        invest: document.createElement("div"),
        interest: document.createElement("div"),
        saving: document.createElement("div")
    }

    Object.values(keyMapping).flat().forEach(e => element.expense_result.append(e));

    for (let i = 1; i <= month; i++) {
        let incomeThisMonth = totalIncome + TPLastMonth;
        TPLastMonth = 0;

        for (const key in expenseFiltered) {
            let key_title = document.createElement("p");
            let p_month = document.createElement("p");
            p_month.textContent = `${i} Month`
            key_title = `Category: ${key}`;
            let key_list = document.createElement("div");

            keyMapping[key].append(key_title, p_month, key_list);

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
                    portofolio = data.result.expense[key].findLast(e => e.id === item.id)?.portofolio ?? item.portofolio;
                }

                let p_title = document.createElement("p");
                p_title.textContent = `Name: ${item.name}`;

                let div_item = document.createElement("div"); // APPEND ITEM KESINI;
                key_list.append(p_title, div_item);

                let totalAmount = item.percent ? (item.percent / 100) * incomeThisMonth : item.amount;

                let p_amount = document.createElement("p");
                p_amount.textContent = item.type_amount !== "amount" ? `Amount: Rp. ${totalAmount.toLocaleString("id-ID")} (${item.percent}%)` : `Amount: Rp. ${totalAmount.toLocaleString("id-ID")}`;

                // EXPENSE
                if (key === "expense") {
                    div_item.append(p_amount);

                    data.result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent })
                }

                // INVEST
                if (key === "invest") {
                    portofolio += totalAmount;
                    let takeProfit = (item.percent / 100) * portofolio;
                    TPLastMonth += takeProfit;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${portofolio.toLocaleString("id-ID")}`;

                    let p_takeProfit = document.createElement("p");
                    p_takeProfit.textContent = `Take Profit: Rp. ${takeProfit} (${item.takeProfit})`

                    if (item.type_amount !== "nominal") {
                        data.result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent, portofolio, takeProfit })
                    } else { data.result.expense[key].push({ ...def, amount: totalAmount, portofolio, takeProfit }) }
                    div_item.append(p_amount, p_portofolio, p_takeProfit);
                }

                // INTEREST
                if (key === "interest") {
                    portofolio += totalAmount;
                    let interest = item.type_interest !== "month" ? (item.interest / 12) : item.interest;
                    let profit = (interest / 100) * portofolio;
                    TPLastMonth += profit;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${portofolio.toLocaleString("id-ID")}`;

                    let p_interest = document.createElement("p");
                    p_interest.textContent = item.type_interest !== "monthly" ? `Interest: Rp. ${profit.toLocaleString("id-ID")} (${interest.toFixed(2)}% /month - ${item.interest.toFixed(2)}% /year)` : `Interest: Rp. ${profit.toLocaleString("id-ID")} (${interest.toFixed(2)}% /month)`;

                    if (item.type_amount !== "nominal") {
                        data.result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent, portofolio, interest: profit })
                    } else { data.result.expense[key].push({ ...def, amount: totalAmount, portofolio, interest: profit }) }

                    div_item.append(p_amount, p_portofolio, p_interest);
                }

                // SAVING
                if (key === "saving") {
                    portofolio += totalAmount;

                    let p_portofolio = document.createElement("p");
                    p_portofolio.textContent = `Portofolio: Rp. ${portofolio.toLocaleString("id-ID")}`;

                    if (item.type_amount !== "nominal") {
                        data.result.expense[key].push({ ...def, amount: totalAmount, percent: item.percent, portofolio })
                    } else { data.result.expense[key].push({ ...def, amount: totalAmount, portofolio }) }

                    div_item.append(p_amount, p_portofolio)
                }
            })
        }
    }
}

// RESULT END

// LOAD
export function load() {
    loadExpensePercent()
    display()
    list()
}
// LOAD END