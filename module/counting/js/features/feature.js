import { element } from "../dom/domElements.js";

let data = {
    income: [],
    expense: {
        nominal: [],
        percent: []
    }
}

element.select_note.textContent = `Type: ${element.expense_type.value}`


function loadData() {
    if (data.expense.percent.length == 0) return;

    let totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0)

    if (data.expense.percent.length > 0) {

        data.expense.percent.forEach(e => {
            e.amount = (totalIncome / 100) * e.percent
        })
    }

}

function load() {
    element.income_item.innerHTML = "";
    element.expense_item.innerHTML = "";

    function template(name, amount, appenDiv, category, type) {

        let div_main = document.createElement("div")
        div_main.classList.add("item-list")

        let div_data = document.createElement("div");
        div_data.classList.add("div-data")

        let div_name = document.createElement("div");
        div_name.classList.add("div-name")

        let p_name = document.createElement("p");
        p_name.textContent = name;

        div_name.appendChild(p_name);

        let div_amount = document.createElement("div");
        div_amount.classList.add("div-amount")
        let p_amount = document.createElement("p");
        p_amount.textContent = `Rp. ${amount.toLocaleString("id-ID")}`;

        div_amount.appendChild(p_amount);

        let div_btn = document.createElement("div")
        let btn_del = document.createElement("button");
        btn_del.textContent = `Delete`;
        btn_del.classList.add("btn", "btn-del")
        btn_del.value = name;
        btn_del.dataset.category = category;
        if (type) btn_del.dataset.type = type;

        btn_del.classList.add("btn", "btn-del")

        div_btn.appendChild(btn_del)

        div_data.append(div_name, div_amount)

        div_main.append(div_data, div_btn)

        appenDiv.appendChild(div_main)
    }

    for (const key in data) {
        if (key === "income") {
            data[key].forEach(e => {
                template(e.name, e.amount, element.income_item, e.category)
            })
        }

        else if (key === "expense") {
            if (data[key].nominal.length > 0) data[key].nominal.forEach(e => {
                template(e.name, e.amount, element.expense_item, e.category, e.type)
            })
            else if (data[key].percent.length > 0) data[key].percent.forEach(e => {
                template(e.name, e.amount, element.expense_item, e.category, e.type)
            })
        }
    }

    let totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0)



    let expenseNominal = data.expense.nominal.reduce((sum, item) => sum + item.amount, 0)
    let expensePercent = data.expense.percent.reduce((sum, item) => sum + item.amount, 0)

    let totalExpense = expenseNominal + expensePercent;

    let balance = totalIncome - totalExpense;

    function loadCheckbox_percent() {
        if (element.checkbox_display_percent.checked) {

            if (totalIncome > 0) {
                document.querySelectorAll(".display-percent_item").forEach(e => {
                    e.classList.remove("hide")
                });

                checkbox_display(element.display_percent_expense, totalIncome, balance)
                checkbox_display(element.display_percent_balance, totalIncome, totalExpense)
            }

            else {
                document.querySelectorAll(".display-percent_item").forEach(e => {
                    e.classList.add("hide")
                })
            }
        }

        else {
            document.querySelectorAll(".display-percent_item").forEach(e => {
                e.classList.add("hide")
            })
        }
    }

    element.income_display.textContent = `Rp. ${totalIncome.toLocaleString("id-ID")}`;
    element.expense_display.textContent = `Rp. ${totalExpense.toLocaleString("id-ID")}`;
    element.balance_display.textContent = `Rp. ${balance.toLocaleString("id-ID")}`;

    document.querySelectorAll(".btn-del").forEach(btn => {
        btn.addEventListener("click", () => del(btn.value, btn.dataset.category, btn.dataset.type))
    })

    element.checkbox_display_percent.addEventListener("change", () => {
        loadCheckbox_percent()
    })

    loadData()
    loadCheckbox_percent()
}


export function add(name, amount, category) {
    if (!name || !amount) {
        return alert("Input name and amount first");
    }

    else if (category === "expense" && data.income.length == 0) {
        return alert("Input your Income first");
    }

    else if (data.income.some(e => e.name === name) || data.expense.percent.some(e => e.name === name) || data.expense.nominal.some(e => e.name === name)) {
        return alert("Name already used");
    }

    if (category === "expense") {

        if (data.income.length < 0) return alert("Input income first");

        let dummy = {}
        if (element.expense_type.value === "nominal") {
            dummy = {
                name,
                amount,
                category,
                type: element.expense_type.value
            }
        }

        else {
            let totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
            dummy = {
                name,
                percent: amount,
                amount: (totalIncome / 100) * amount,
                category,
                type: element.expense_type.value
            }
        }

        data.expense[element.expense_type.value].push(dummy)
    }

    else {
        data[category].push({ name, amount, category })
    }

    load()
}



function del(name, category, type) {
    if (category === "income") data.income = data.income.filter(e => e.name !== name);

    if (category === "expense") data.expense[type] = data.expense[type].filter(e => e.name !== name);

    load()
}




document.querySelectorAll(".div-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        console.log("click")
    })
})



function checkbox_display(element_percent, nominal_awal, nominal_akhir) {
    const percent = (((nominal_akhir - nominal_awal) / nominal_awal) * 100)
    element_percent.textContent = `${Math.abs(percent).toFixed(1)}%`
}

