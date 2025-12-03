import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart } from "../utility/chart.js";
import { chartControl } from "./toolsControl.js";

const summary = data.summary;

function donut() {
    let ctx = element.cashFlowCanvasDonut;

    let chart = getChart(ctx, "doughnut")

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
    function domListing(category, motherElement) {
        let key_container = document.createElement("div");
        key_container.classList.add("key-container");
        motherElement.append(key_container);

        let key_p = document.createElement("p");
        key_p.textContent = `Category: ${category}`;

        let key_list = document.createElement("div");
        key_list.classList.add("key-list");
        key_container.append(key_p, key_list);
        return key_list
    }

    // --- INCOME ---
    (() => {
        let list = data.list.income;
        if (list.length > 0) {
            element.cashFlow_list_income.innerHTML = "";

            list.forEach((e) => {
                let key_list = domListing("income", element.cashFlow_list_income);
                let p_name = document.createElement("p");
                p_name.textContent = `Name: ${e.name}`;
                let p_amount = document.createElement("p");
                p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}`;

                let key_item = document.createElement("div");
                key_item.classList.add("key-item");
                key_list.append(key_item)

                key_item.append(p_name, p_amount);
            })
        } else {
            element.cashFlow_list_income.innerHTML = "";
            let div_alert = document.createElement("div");
            div_alert.textContent = `Empty`;
            div_alert.classList.add("list-note");
            element.cashFlow_list_income.append(div_alert);
        }

    })()

    // --- EXPENSE ---
    function loadExpense(option) {
        if (option !== "all") {
            let list = data.list.expense[option];

            if (list.length > 0) {
                element.cashFlow_list_expense.innerHTML = "";
                let key_list = domListing(option, element.cashFlow_list_expense);

                list.forEach((e) => {
                    let p_name = document.createElement("p");
                    p_name.textContent = `Name: ${e.name}`;

                    let p_amount = document.createElement("p");
                    p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}${e.percent ? ` (${e.percent.toFixed(2)}%)` : ""}`

                    let key_item = document.createElement("div");
                    key_item.classList.add("key-item");
                    key_list.append(key_item)

                    key_item.append(p_name, p_amount);

                    if (option !== "expense") {
                        let p_portofolio = document.createElement("p");
                        p_portofolio.textContent = `Portofolio: Rp. ${e.portofolio.toLocaleString("id-ID")}`;
                        key_item.append(p_portofolio);

                        // INVEST
                        if (option === "invest") {
                            let p_takeProfit = document.createElement("p");
                            p_takeProfit.textContent = `Take Profit: (${e.takeProfit.toFixed(2)}%)`;
                            key_item.append(p_takeProfit);
                        };

                        // INTEREST
                        if (option === "interest") {
                            let p_interest = document.createElement("p");
                            p_interest.textContent = `Interest: (${e.type_interest === "month" ? `${e.interest.toFixed(2)}%/m` : `${(e.interest / 12).toFixed(2)}%/m ${e.interest.toFixed(2)}%/y`})`;
                            key_item.append(p_interest);
                        };
                    };
                })
            } else {
                element.cashFlow_list_expense.innerHTML = "";
                let p_alert = document.createElement("p");
                p_alert.textContent = `Empty`;
                p_alert.classList.add("list-note");
                element.cashFlow_list_expense.append(p_alert);
            }
        } else {
            if (Object.values(data.list.expense).flat().length > 1) {
                element.cashFlow_list_expense.innerHTML = "";
                for (const option in data.list.expense) {
                    if (data.list.expense[option].length > 0) {
                        let list = data.list.expense[option];
                        let key_list = domListing(option, element.cashFlow_list_expense);

                        list.forEach((e) => {
                            let p_name = document.createElement("p");
                            p_name.textContent = `Name: ${e.name}`;

                            let p_amount = document.createElement("p");
                            p_amount.textContent = `Amount: Rp. ${e.amount.toLocaleString("id-ID")}${e.percent ? ` (${e.percent.toFixed(2)}%)` : ""}`

                            let key_item = document.createElement("div");
                            key_item.classList.add("key-item");
                            key_list.append(key_item)

                            key_item.append(p_name, p_amount);

                            if (option !== "expense") {
                                let p_portofolio = document.createElement("p");
                                p_portofolio.textContent = `Portofolio: Rp. ${e.portofolio.toLocaleString("id-ID")}`;
                                key_item.append(p_portofolio);

                                // INVEST
                                if (option === "invest") {
                                    let p_takeProfit = document.createElement("p");
                                    p_takeProfit.textContent = `Take Profit: (${e.takeProfit.toFixed(2)}%)`;
                                    key_item.append(p_takeProfit);
                                };

                                // INTEREST
                                if (option === "interest") {
                                    let p_interest = document.createElement("p");
                                    p_interest.textContent = `Interest: (${e.type_interest === "month" ? `${e.interest.toFixed(2)}%/m` : `${(e.interest / 12).toFixed(2)}%/m ${e.interest.toFixed(2)}%/y`})`;
                                    key_item.append(p_interest);
                                };
                            };
                        })
                    }
                }
            } else {
                element.cashFlow_list_expense.innerHTML = "";
                let p_alert = document.createElement("p");
                p_alert.classList.add("list-note");
                p_alert.textContent = "Empty";
                element.cashFlow_list_expense.append(p_alert)
            }
        }
    }

    loadExpense(element.cashFlow_list_select.value)
    element.cashFlow_list_select.addEventListener("change", () => loadExpense(element.cashFlow_list_select.value))
}

function line() {
    let ctx = element.cashFlowCanvasLine;

    let chart = getChart(ctx, element.cashFlowSelectType.value);

    chart.data = {
        labels: [],
        datasets: []
    }

    const mappingColor = {
        income: {
            borderColor: `rgba(26, 139, 87, 1)`,
            backgroundColor: `rgba(26, 139, 87, 0.2)`
        },
        expense: {
            borderColor: `rgba(172, 57, 43, 1)`,
            backgroundColor: ` rgba(172, 57, 43, 0.2)`
        },
        balance: {
            borderColor: `rgba(27, 111, 214, 1)`,
            backgroundColor: `rgba(27, 111, 214, 0.2)`
        }
    }

    // CHART.DATA
    for (let month = 1; month <= data.summary.income.length; month++) {
        let tahun = month > 12 ? parseInt(month / 12) : 0;
        let bulan = month > 12 ? parseFloat(month % 12) : month;
        let result = tahun ? `${tahun}Y ${bulan}M` : `${bulan}M`;
        chart.data.labels.push(result)
    }

    for (const key in data.summary) {

        chart.data.datasets.push({
            label: key,
            data: data.summary[key].map(e => e.amount),
            tention: 2,
            fill: false,
            backgroundColor: mappingColor[key].backgroundColor,
            borderColor: mappingColor[key].borderColor
        })
    }

    chart.options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
                x: {
                    beginAtZero: true
                }
            }
    }

    chart.update()



    document.querySelectorAll(`[data-control="cashFlow"]`).forEach(e => {
        e.addEventListener("change", () => {
            chartControl(e.dataset.category, chart, e, e.dataset.type)
            console.log(chart.data)
        })
    })
}

donut()
line()


