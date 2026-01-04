import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart, prettierOptions, getData, getLabels } from "../utility/chart.js";
import { domListing } from "../utility/overviewList.js";
import { chartControl } from "../utility/toolsControl.js";
import { inputElseFilter, alertingElse } from "../utility/filterElse.js";

const summary = data.summary;

function donut() {
    let ctx = element.cashFlow_canvas_donut;

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

    const lastMonth = Math.max(...summary[Object.keys(summary).find(k => summary[k].length !== 0)].map(e => e.month))

    const value = {
        income: summary.income.find(e=> e.month === lastMonth).amount,
        expense: summary.expense.find(e=> e.month === lastMonth).amount,
        balance: summary.balance.find(e=> e.month === lastMonth).amount
    }

    const total = Object.values(value).reduce((acc, item) => acc + item, 0);

    const income = ((value.income / total) * 100);
    const expense = (value.expense / total) * 100;
    const balance = (value.balance / total) * 100;

    let dummyOff = {
        income,
        expense,
        balance
    }

    // KALAU NILAI 0 MAKA DIBERIKAN CLASS OFF
    for (const key in dummyOff) {
        if (dummyOff[key] === 0) {
            document.querySelector(`div[data-divDonut__checkbox="cashFlow"][data-category="${key}"]`).classList.add("off-permanent")
            document.querySelector(`div[data-divDonut__percent="cashFlow"][data-category="${key}"]`).classList.add("off-permanent")
            document.querySelector(`input[data-section="cashFlow"][data-checkbox="donut"][data-category="${key}"]`).checked = false
        }
    }



    const percentDom = { income: element.cashFlow_percent_income, expense: element.cashFlow_percent_expense, balance: element.cashFlow_percent_balance }

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

    prettierOptions("doughnut", chart)

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




    // --- INCOME ---
    function overviewIncome() {
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
    }

    overviewIncome()

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
        }

        else {
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
    let ctx = element.cashFlow_canvas_line;

    let chart = getChart(ctx, element.cashFlow_select_type.value);

    let domFill = document.querySelectorAll('input[data-control="cashFlow"][data-type="fill"]')
    let domHidden = document.querySelectorAll('input[data-control="cashFlow"][data-type="hidden"]')

    chart.data = {
        labels: [],
        datasets: []
    }

    const mappingColor = {
        line: {
            income: {
                borderColor: `rgba(26, 139, 87, 1)`,
                backgroundColor: `rgba(26, 139, 87, 0.2)`
            },
            expense: {
                borderColor: `rgba(172, 57, 43, 1)`,
                backgroundColor: `rgba(172, 57, 43, 0.2)`
            },
            balance: {
                borderColor: `rgba(27, 111, 214, 1)`,
                backgroundColor: `rgba(27, 111, 214, 0.2)`
            }
        },
        bar: {
            income: {
                backgroundColor: `rgba(26, 139, 87, 0.5)`
            },
            expense: {
                backgroundColor: ` rgba(172, 57, 43, 0.5)`
            },
            balance: {
                backgroundColor: `rgba(27, 111, 214, 0.5)`
            }
        }
    }

    // CHART.DATA.LABELS
    chart.data.labels = getLabels(data.summary.income, element.cashFlow_filter.value)

    // CHART.DATA.DATASETS
    for (const key in data.summary) {
        if (data.summary[key][0].amount === 0) {
            // KALAU NILAI 0 MAKA DIBERIKAN CLASS OFF
            let label = document.querySelectorAll(`label[data-label="cashFlow"][data-category="${key}"]`)

            label.forEach(e => {
                e.querySelector("input").checked = false
                e.classList.add("off-permanent")
            })

            continue
        };
        let arrayData = getData(data.summary[key], "amount", element.cashFlow_filter.value)
        let defData = {
            label: key,
            tention: 2,
            data: arrayData,
            backgroundColor: mappingColor[element.cashFlow_select_type.value][key].backgroundColor,
            borderColor: mappingColor[element.cashFlow_select_type.value][key].borderColor
        }
        chart.data.datasets.push(defData)
    }

    prettierOptions(element.cashFlow_select_type.value, chart)

    chart.update()

    // CHECKBOX



    document.querySelectorAll(`input[data-control="cashFlow"]`).forEach(e => {
        e.addEventListener("change", () => {
            chartControl(e.dataset.category, chart, e, e.dataset.type)
        })
    })



    // TYPE CHART
    element.cashFlow_select_type.addEventListener("change", () => {
        let data = chart.data

        data.datasets.forEach(e => {
            e.backgroundColor = mappingColor[element.cashFlow_select_type.value][e.label].backgroundColor
        })

        chart.destroy()

        chart = getChart(ctx, element.cashFlow_select_type.value)
        chart.data = data

        prettierOptions(element.cashFlow_select_type.value, chart)

        chart.update()



        // TAMBAH CLASS OPACITY KALAU BAR
        if (element.cashFlow_select_type.value === "bar") {
            document.querySelectorAll('label[data-control="cashFlow"][data-type="fill"]').forEach(e => {
                e.classList.add("off")
            })

        } else {
            document.querySelectorAll('label[data-control="cashFlow"][data-type="fill"]').forEach(e => {
                e.classList.remove("off")
            })
        }



    })



    // TIME PERIOD
    element.cashFlow_filter.addEventListener("change", () => {
        // MONTH / YEAR
        if (element.cashFlow_filter.value !== "custom") {
            element.cashFlow_div_option_else.classList.add("hide")
            chart.data.labels = getLabels(data.summary.income, element.cashFlow_filter.value)

            let dummyColor = {}

            chart.data.datasets.forEach(e => {
                dummyColor[e.label] = {
                    backgroundColor: e.backgroundColor,
                    borderColor: e.borderColor
                }
            })

            chart.data.datasets = []

            for (const key in data.summary) {
                if (data.summary[key][0].amount === 0) continue
                let arrayData = getData(data.summary[key], "amount", element.cashFlow_filter.value)
                let defData = {
                    label: key,
                    tention: 2,
                    data: arrayData,
                    fill: [...domFill].find(el => el.dataset.category === key).checked,
                    hidden: ![...domHidden].find(el => el.dataset.category === key).checked,
                    backgroundColor: dummyColor[key].backgroundColor,
                    borderColor: dummyColor[key].borderColor
                }
                chart.data.datasets.push(defData)
            }

            console.log(chart.data)

            chart.update()
        }

        if (element.cashFlow_filter.value === "custom") {
            [element.cashFlow_filter_input_start, element.cashFlow_filter_input_end].forEach(e => e.value = "")
            element.cashFlow_div_option_else.classList.remove("hide")
        }
    })


    // = FILTER ELSE =

    // INPUT START
    element.cashFlow_filter_input_start.addEventListener("input", () => inputElseFilter(data.summary.income, element.cashFlow_filter_range_type, "start", element.cashFlow_filter_input_start))

    // INPUT END
    element.cashFlow_filter_input_end.addEventListener("input", () => inputElseFilter(data.summary.income, element.cashFlow_filter_range_type, "end", element.cashFlow_filter_input_end))

    // RANGE TYPE
    element.cashFlow_filter_range_type.addEventListener("change", () => {
        inputElseFilter(data.summary.income, element.cashFlow_filter_range_type, "start", element.cashFlow_filter_input_start)
        inputElseFilter(data.summary.income, element.cashFlow_filter_range_type, "end", element.cashFlow_filter_input_end)
    })

    // FILTER ELSE BTN
    element.cashFlow_filter_btn.addEventListener("click", () => {
        let error = alertingElse(element.cashFlow_filter_input_start, element.cashFlow_filter_input_end, element.cashFlow_filter)
        if (error) {
            return alert(error);
        }

        let dummyColor = {}

        chart.data.datasets.forEach(e => {
            dummyColor[e.label] = {
                backgroundColor: e.backgroundColor,
                borderColor: e.borderColor
            }
        })

        chart.destroy()

        chart = getChart(ctx, element.cashFlow_select_type.value)

        let input_start = Number(element.cashFlow_filter_input_start.value);
        let input_end = Number(element.cashFlow_filter_input_end.value) || " ";

        chart.data.labels = getLabels(data.summary.income, element.cashFlow_filter_range_type.value, input_start, input_end)

        for (const key in data.summary) {
            if (data.summary[key][0].amount === 0) continue;
            let arrayData = getData(data.summary[key], "amount", element.cashFlow_filter_range_type.value, input_start, input_end)
            let defData = {
                label: key,
                tention: 2,
                data: arrayData,
                fill: [...domFill].find(el => el.dataset.category === key).checked,
                hidden: ![...domHidden].find(el => el.dataset.category === key).checked,
                backgroundColor: dummyColor[key].backgroundColor,
                borderColor: dummyColor[key].borderColor
            }
            chart.data.datasets.push(defData)
        }

        prettierOptions(element.cashFlow_select_type.value, chart)

        chart.update()
    })
}

donut()
line()