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

    const lastMonth = Math.max(...list[Object.keys(list).find(k => list[k].length !== 0)].map(e => e.month))

    const value = {};

    for (const key in list) {
        chart.data.labels.push(key)
        if (list[key].length === 0) {
            value[key] = 0;
            continue
        };

        value[key] = list[key].filter(e => e.month === lastMonth).reduce((acc, item) => acc + item.amount, 0)
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


function line() {
    let ctx = element.expense_canvas_line;

    let chart = getChart(ctx, element.expense_select_type.value)

    // DATA.LABELS
    const dummyArrayLabel = list[Object.keys(list).find(l => list[l].length > 1)]

    let dummyLabel = getLabels(dummyArrayLabel, element.expense_filter.value)

    chart.data.labels = dummyLabel

    let dummyCheckbox = [] // ARRAY UNTUK HIDE DAN FILL

    for (const key in list) {
        if (list[key].length === 0) {
            let label = document.querySelectorAll(`label[data-label="expense"][data-category="${key}"]`)

            label.forEach(e => {
                e.querySelector("input").checked = false
                e.classList.add("off-permanent")
            })

            continue
        };

        let data = getData(list[key], "amount", element.expense_filter.value)

        chart.data.datasets.push({
            label: key,
            tention: 2,
            data,
            backgroundColor: colorMapping[element.expense_select_type.value][key].backgroundColor,
            borderColor: colorMapping[element.expense_select_type.value][key].borderColor
        })

        // MENAMBAHKAN DOM AGAR BISA MELAKUKAN EVENT CHECKBOX
        dummyCheckbox.push(Array.from(document.querySelectorAll(`input[data-control="expense"][data-category="${key}"]`)))
    }

    prettierOptions(element.expense_select_type.value, chart)

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

        prettierOptions(element.expense_select_type.value, chart)

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
            chart.data.labels = getLabels(dummyArrayLabel, element.expense_filter.value)

            let domFill = document.querySelectorAll('input[data-control="expense"][data-type="fill"]')
            let domHidden = document.querySelectorAll('input[data-control="expense"][data-type="hidden"]')

            let dummyColor = {}

            chart.data.datasets.forEach(e => {
                dummyColor[e.label] = {
                    backgroundColor: e.backgroundColor,
                    borderColor: e.borderColor
                }
            })

            chart.data.datasets = []

            for (const key in list) {
                if (list[key].length === 0) continue;
                let data = getData(list[key], "amount", element.expense_filter.value)

                let defData = {
                    label: key,
                    tention: 2,
                    data,
                    fill: [...domFill].find(el => el.dataset.category === key).checked,
                    hidden: ![...domHidden].find(el => el.dataset.category === key).checked,
                    backgroundColor: dummyColor[key].backgroundColor,
                    borderColor: dummyColor[key].borderColor
                }
                chart.data.datasets.push(defData)
            }
            chart.update()
        }

        if (element.expense_filter.value === "custom") {
            [element.expense_filter_input_start, element.expense_filter_input_end].forEach(e => e.value = "")
            element.expense_div_option_else.classList.remove("hide")
        }
    })

    // CHECK BOX HIDE & FILL
    let domCheckbox = dummyCheckbox.flat()
    domCheckbox.forEach(e => {
        e.addEventListener("change", () => {
            chartControl(e.dataset.category, chart, e, e.dataset.type)
        })
    })

    // = FILTER ELSE =

    // INPUT START
    element.expense_filter_input_start.addEventListener("input", () => inputElseFilter(dummyArrayLabel, element.expense_filter_range_type, "start", element.expense_filter_input_start))

    // INPUT END
    element.expense_filter_input_end.addEventListener("input", () => inputElseFilter(dummyArrayLabel, element.expense_filter_range_type, "end", element.expense_filter_input_end))

    // RANGE TYPE
    element.expense_filter_range_type.addEventListener("change", () => {
        inputElseFilter(dummyArrayLabel, element.expense_filter_range_type, "start", element.expense_filter_input_start)
        inputElseFilter(dummyArrayLabel, element.expense_filter_range_type, "end", element.expense_filter_input_end)
    })

    // FILTER
    element.expense_filter_btn.addEventListener("click", () => {
        let error = alertingElse(element.expense_filter_input_start, element.expense_filter_input_end, element.expense_filter)
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

        let input_start = Number(element.expense_filter_input_start.value);
        let input_end = Number(element.expense_filter_input_end.value) || " ";

        chart = getChart(ctx, element.expense_select_type.value)

        chart.data.labels = getLabels(dummyArrayLabel, element.expense_filter_range_type.value, input_start, input_end)

        for (const key in list) {
            if (list[key].length === 0) continue;

            let data = getData(list[key], "amount", element.expense_filter_range_type.value, input_start, input_end)

            chart.data.datasets.push({
                label: key,
                tention: 2,
                data,
                backgroundColor: colorMapping[element.expense_select_type.value][key].backgroundColor,
                borderColor: colorMapping[element.expense_select_type.value][key].borderColor
            })
        }

        prettierOptions(element.expense_select_type.value, chart)

        chart.update()
    })
}

donut()
line()
