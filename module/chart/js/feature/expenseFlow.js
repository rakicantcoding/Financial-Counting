import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart, prettierOptions, getData, getLabels } from "../utility/chart.js";
import { chartControl } from "../utility/toolsControl.js";
import { inputElseFilter, alertingElse } from "../utility/filterElse.js";

let list = data.expense

const colorMapping = {
    line: {
        expense: {
            backgroundColor: "rgba(191, 84, 0, 0.3)",
            borderColor: "rgba(191, 84, 0, 1)"
        },
        invest: {
            backgroundColor: "rgba(2, 160, 133, 0.3)",
            borderColor: "rgba(2, 160, 133, 1)"
        },
        interest: {
            backgroundColor: " rgba(148, 143, 42, 0.3)",
            borderColor: " rgba(148, 143, 42, 1)"
        },
        saving: {
            backgroundColor: " rgba(122, 68, 173, 0.3)",
            borderColor: "rgba(122, 68, 173, 1)"
        }
    },

    bar: {
        expense: {
            backgroundColor: "rgba(191, 84, 0, 0.5)"
        },
        invest: {
            backgroundColor: "rgba(2, 160, 133, 0.5)"
        },
        interest: {
            backgroundColor: " rgba(148, 143, 42, 0.5)"
        },
        saving: {
            backgroundColor: " rgba(122, 68, 173, 0.5)"
        }
    }

}

function donut() {
    let ctx = element.expense_canvas_donut;

    let chart = getChart(ctx, "doughnut");

    const value = {};

    for (const key in list) {
        chart.data.labels.push(key)
        if (list[key].length === 0) {
            value[key] = 0;
            continue
        };

        value[key] = list[key][0].amount
    }

    const total = Object.values(value).reduce((acc, item) => acc + item, 0);

    function convestPercent(value) {
        return (value / total) * 100;
    }

    const expense = convestPercent(value.expense);
    const invest = convestPercent(value.invest);
    const interest = convestPercent(value.interest);
    const saving = convestPercent(value.saving);

    // CHECKBOX DONUT
    let checkboxDOM = document.querySelectorAll(`input[data-section="expense"][data-checkbox="donut"]`)
    checkboxDOM.forEach((e, i) => {
        e.addEventListener("change", () => {
            chart.toggleDataVisibility(i);
            chart.update();
        })
    })

    // PERCENT DISPLAY
    let percentDOM = document.querySelectorAll('p[data-percent="expense"]')
    percentDOM.forEach(e => {
        e.textContent = `${convestPercent(value[e.dataset.category]).toFixed(2)}%`

    })


    // DATASETS
    chart.data.datasets.push({
        backgroundColor: ["rgba(191, 84, 0, 0.3)", "rgba(2, 160, 133, 0.3)", " rgba(148, 143, 42, 0.3)", " rgba(122, 68, 173, 0.3)"],
        borderColor: ["rgba(191, 84, 0, 1)", "rgba(2, 160, 133, 1)", " rgba(148, 143, 42, 1)", "rgba(122, 68, 173, 1)"],
        data: [expense, invest, interest, saving]
    })

    prettierOptions("doughnut", chart)

    chart.update()

    for (const key in value) {
        if (value[key] === 0) {
            document.querySelector(`div[data-divDonut__checkbox="expense"][data-category="${key}"]`).classList.add("off-permanent")
            document.querySelector(`div[data-divDonut__percent="expense"][data-category="${key}"]`).classList.add("off-permanent")
            document.querySelector(`input[data-section="expense"][data-checkbox="donut"][data-category="${key}"]`).checked = false
        }
    }
}
//  NEXT = LINE CHART, TYPE, CHECKBOX HIDE & FILL;
function line() {
    let ctx = element.expense_canvas_line;

    let chart = getChart(ctx, element.expense_select_type.value)

    // DATA.LABELS
    let convert = [...new Set(Object.values(list).find(e => e.length !== 0).map(e => e.month))]
    chart.data.labels = getLabels(convert, element.expense_filter.value)

    // DATA.DATASETS
    // WIP = DATA MASIH BELUM SUPPORT YEAR DAN FILTER

    let dataDummy = [];

    for (const key in list) {
        if (list[key].length === 0) {
            let label = document.querySelectorAll(`label[data-label="expense"][data-category="${key}"]`)

            label.forEach(e => {
                e.querySelector("input").checked = false
                e.classList.add("off-permanent")
            })

            continue
        };

        let dummyLoop = Math.max(...list[key].map(e => e.month))
        for (let start = 1; start <= dummyLoop; start++) {
            let amount = list[key].filter(e => e.month === start).reduce((acc, item) => acc + item.amount, 0)
            dataDummy.push({
                label: key,
                month: start,
                amount
            })
        }
        let dummy = dataDummy.filter(e => e.label === key)
        let data = getData(dummy, "amount", element.expense_filter.value)

        chart.data.datasets.push({
            label: key,
            tention: 2,
            data,
            backgroundColor: colorMapping[element.expense_select_type.value][key].backgroundColor,
            borderColor: colorMapping[element.expense_select_type.value][key].borderColor
        })
    }

    prettierOptions(element.expense_select_type, chart)

    chart.update()

    // TYPE CHART
    element.expense_select_type.addEventListener("change", () => {

        let data = chart.data

        data.datasets.forEach(e => {
            e.backgroundColor = colorMapping[element.expense_select_type.value][e.label].backgroundColor
        })

        chart.destroy()

        chart = getChart(ctx, element.expense_select_type.value)
        chart.data = data

        prettierOptions(element.expense_select_type, chart)

        chart.update()



        // TAMBAH CLASS OPACITY KALAU BAR
        if (element.expense_select_type.value === "bar") {
            document.querySelectorAll('label[data-control="expense"][data-type="fill"]').forEach(e => {
                e.classList.add("off")
            })

        } else {
            document.querySelectorAll('label[data-control="expense"][data-type="fill"]').forEach(e => {
                e.classList.remove("off")
            })
        }


    })

    // TIME PERIOD
    element.expense_filter.addEventListener("change", () => {
        if (element.expense_filter.value !== "custom") {
            element.expense_div_option_else.classList.add("hide")
            chart.data.labels = getLabels(convert, element.expense_filter.value)

            let domFill = document.querySelectorAll('input[data-control="expense"][data-type="fill"]')
            let domHidden = document.querySelectorAll('input[data-control="expense"][data-type="hidden"]')

            chart.data.datasets = []

            for (const key in list) {
                let dummy = dataDummy.filter(e => e.label === key)
                let arrayData = getData(dummy, "amount", element.expense_filter.value)
                let defData = {
                    label: key,
                    tention: 2,
                    data: arrayData,
                    fill: [...domFill].find(el => el.dataset.category === key).checked,
                    hidden: ![...domHidden].find(el => el.dataset.category === key).checked,
                    backgroundColor: colorMapping[element.expense_select_type.value][key].backgroundColor,
                    borderColor: colorMapping[element.expense_select_type.value][key].borderColor
                }
                chart.data.datasets.push(defData)
            }
            chart.update()
        }
    })
}

donut()
line()