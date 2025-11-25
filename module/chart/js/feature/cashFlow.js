import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart } from "../utility/chart.js";

let ctx = element.cashFlowCanvas;

let chart = getChart(ctx, "doughnut")

const summary = data.summary;

const keyMapping = {
    income: {
        backgroundColor: "rgba(46, 139, 87, 0.3)",
        borderColor: "rgba(46, 139, 87, 1)"
    },
    expense: {
        backgroundColor: "rgba(192, 57, 43, 0.3)",
        borderColor: "rgba(192, 57, 43, 1)",
    },
    balance: {
        backgroundColor: "rgba(47, 111, 214, 0.3))",
        borderColor: "rgba(47, 111, 214, 1)"
    }
}

const value = {
    income: summary.income[0].amount,
    expense: summary.expense[0].amount,
    balance: summary.balance[0].amount
}

const total = Object.values(value).reduce((acc, item) => acc + item, 0);

const income = (value.income / total) * 100;
const expense = (value.expense / total) * 100;
const balance = (value.balance / total) * 100;

const percentDom = { income: element.cashFlow_income_percent, expense: element.cashFlow_expense_percent, balance: element.cashFlow_balance_percent }

for (const key in percentDom) {
    const map = { income, expense, balance }
    percentDom[key].textContent = `${map[key].toFixed(2)}%`
}

chart.data = {
    labels: ["income", "expense", "balance"],
    datasets: [
        {
            data: [income, expense, balance],
            backgroundColor: [keyMapping.income.backgroundColor, keyMapping.expense.backgroundColor, keyMapping.balance.backgroundColor],
            borderColor: [keyMapping.income.borderColor, keyMapping.expense.borderColor, keyMapping.balance.borderColor],
        }
    ]
}

chart.options = {
    responsive: true,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (ctx) {
                    return ctx.label + ": " + ctx.raw.toFixed(2) + "%";
                }
            }
        },
        legend: {
            display: false
        }
    }
}

chart.update()

let dom = [
    element.cashFlow_checkBox_income,
    element.cashFlow_checkBox_expense,
    element.cashFlow_checkBox_balance
]

dom.forEach((e, i) => {
    e.addEventListener("change", () => {
        chart.toggleDataVisibility(i);
        chart.update();
    })
})


// LIST
function loadList(data, motherElement) {

    function mapping(i) {
        return {
            income: { name: i.name, amount: i.amount },
            expense: {name: i.name, amount: i.amount, type_amount: i.type_amount},
            invest: {name: i.name, amount: i.amount, type_amount: i.type_amount, portofolio: i.portofolio, tp}
        }
    }

    for (const key in data) {
        let key_container = document.createElement("div");
        key_container.classList.add("key-container");
        motherElement.append(key_container);

        let key_p = document.createElement("p");
        key_p.textContent = key;

        let key_list = document.createElement("div");
        key_list.classList.add("key-list");
        key_container.append(key_p, key_list);

        data[key].forEach(e => {

        })
    }
}