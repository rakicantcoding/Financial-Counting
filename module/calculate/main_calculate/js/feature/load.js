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

    if (data.income.length > 0) {
        data.income.forEach(e => {
            let div = document.createElement("div");

            let div_title = document.createElement("div");

            let p_title = document.createElement("p");
            p_title.textContent = `Name: ${e.name}`;

            let div_item = document.createElement("div");
            div_item.classList.add("list-div_item");

            let item = document.createElement("div")
            item.classList.add("list-item_div")
            let p_amount = document.createElement("p");
            p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}`;
            item.append(p_amount)

            let btn_del = document.createElement("button");
            btn_del.textContent = `X`;
            btn_del.dataset.name = e.name;
            btn_del.dataset.category = e.category;
            btn_del.classList.add("btn-del");

            div_title.append(p_title, btn_del)

            div_item.append(item);

            div.append(div_title, div_item);
            element.income_list.appendChild(div);
        })
    };

    // EXPENSE
    element.expense_list.innerHTML = "";

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
                    div_title.classList.add("key-title")

                    let p_title = document.createElement("p");
                    p_title.textContent = `Name: ${e.name}`;

                    let btn_del = document.createElement("button");
                    btn_del.textContent = `X`;
                    btn_del.dataset.name = e.name;
                    btn_del.dataset.category = e.category;
                    btn_del.classList.add("btn-del");

                    div_title.append(p_title, btn_del);

                    let div_item = document.createElement("div");
                    div_item.classList.add("key-item");

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
// LIST END



// LOAD
export function load() {
    loadExpensePercent()
    display()
    list()
}
// LOAD END