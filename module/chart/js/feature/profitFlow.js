import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart, prettierOptions, getData, getLabels, resize } from "../utility/chart.js";
import { chartControl } from "../utility/toolsControl.js";
import { inputElseFilter, alertingElse } from "../utility/filterElse.js";

function emptyHandle() {
    let list = {}

    if (data.expense.invest.length !== 0) list.invest = data.expense.invest;
    if (data.expense.interest.length !== 0) list.interest = data.expense.interest;

    if (Object.values(list).length === 0) {
        let head = document.querySelector(`div[data-head = "profit"]`);
        let headerContentBody = document.querySelector(`div[data-headerContentBody="profit"]`);
        let contentBottom = document.querySelector(`div[data-contentBottom="profit"]`);
        let line = document.querySelector(`div[data-chartL = "profit"]`);

        let checkBox = Array.from(document.querySelectorAll(`input[data-control = "profit"]`));
        checkBox.forEach(e => e.checked = false);

        head.classList.add("hide");
        headerContentBody.classList.add("off-permanent");
        contentBottom.classList.add("off-permanent");

        line.innerHTML = "";

        let div = document.createElement("div");
        div.textContent = `"You don’t have any profitable data yet."`;
        div.classList.add("line-note");
        line.append(div);

        return undefined
    }

    return true
}

function donut() {
    let ctx = element.profit_canvas_donut;

    let chart = getChart(ctx, "doughnut");

    const mappingColor = {
        invest: {
            backgroundColor: "rgba(2, 160, 133, 0.3)",
            borderColor: "rgba(2, 160, 133, 1)"
        },
        interest: {
            backgroundColor: " rgba(148, 143, 42, 0.3)",
            borderColor: " rgba(148, 143, 42, 1)"
        }
    }

    let list = {}

    if (data.expense.invest.length !== 0) list.invest = data.expense.invest;
    if (data.expense.interest.length !== 0) list.interest = data.expense.interest;

    if (Object.values(list).length === 0) {
        return
    };

    let totalMap = {};
    // TOTAL SELURUH PROFIT SETIAP KATEGORI
    for (const key in list) {
        let dummyTotal = Math.floor(list[key].map(e => e.takeProfit || e.interest).reduce((acc, item) => acc + item, 0))

        totalMap[key] = dummyTotal;
    };

    let dummyTotal = Object.values(totalMap).reduce((acc, item) => acc + item, 0);

    let datasets = {
        backgroundColor: [],
        borderColor: [],
        data: [],
    };

    for (const key in totalMap) {
        chart.data.labels.push(key)

        let dummyDom = document.querySelector(`p[data-percent="profit"][data-category="${key}"]`);
        let result = (totalMap[key] / dummyTotal) * 100;

        datasets.data.push(result);

        dummyDom.textContent = `${result.toFixed(2)}%`;

        datasets.backgroundColor.push(mappingColor[key].backgroundColor);
        datasets.borderColor.push(mappingColor[key].borderColor);
    }

    chart.data.datasets.push(datasets);

    let checkboxDOM = document.querySelectorAll(`input[data-section="profit"][data-checkbox="donut"]`)
    checkboxDOM.forEach((e, i) => {
        e.addEventListener("change", () => {
            chart.toggleDataVisibility(i);
            chart.update();
        })
    })

    prettierOptions("doughnut", chart);
}

function line() {
    let ctx = element.profit_canvas_line;

    let chart = getChart(ctx, element.profit_select_type.value);

    let list = {}

    if (data.expense.invest.length !== 0) list.invest = data.expense.invest;
    if (data.expense.interest.length !== 0) list.interest = data.expense.interest;

    if (Object.values(list).length === 0) {
        return
    };

    let dummyCheckbox = []

    const colorMapping = {
        line: {
            invest: {
                backgroundColor: "rgba(2, 160, 133, 0.3)",
                borderColor: "rgba(2, 160, 133, 1)"
            },
            interest: {
                backgroundColor: " rgba(148, 143, 42, 0.3)",
                borderColor: " rgba(148, 143, 42, 1)"
            }
        },

        bar: {
            invest: {
                backgroundColor: "rgba(2, 160, 133, 0.5)"
            },
            interest: {
                backgroundColor: " rgba(148, 143, 42, 0.5)"
            }
        }

    }

    const dummyArrayLabel = list[Object.keys(list).find(l => list[l].length > 1)]

    let dummyLabel = getLabels(dummyArrayLabel, element.expense_filter.value);
    chart.data.labels = dummyLabel;

    let domLabel = document.querySelectorAll(`label[data-label="profit"]`);
    domLabel.forEach(e => {
        e.classList.add("off-permanent")
        let checkBox = e.querySelectorAll(`input`)
        checkBox.forEach(i => i.checked = false)
    })

    for (const key in list) {
        let domLabel = document.querySelectorAll(`label[data-label="profit"][data-category="${key}"]`);
        let domHidden = document.querySelector(`label[data-label="profit"][data-category="${key}"][data-type="hidden"]`);
        domLabel.forEach(e => {
            e.classList.remove("off-permanent");
        });
        domHidden.querySelector(`input`).checked = true;

        let dummyData = getData(list[key], key !== "interest" ? "takeProfit" : "interest", element.profit_filter.value);
        chart.data.datasets.push({
            data: dummyData,
            backgroundColor: colorMapping[element.expense_select_type.value][key].backgroundColor,
            borderColor: colorMapping[element.expense_select_type.value][key].borderColor,
            label: key,
            tention: 2,
        })

        dummyCheckbox.push(Array.from(document.querySelectorAll(`input[data-control="profit"][data-category="${key}"]`)))
    }

    prettierOptions(element.profit_select_type.value, chart)

    chart.update()

    // TYPE CHART
    element.profit_select_type.addEventListener("change", () => {

        let data = chart.data

        data.datasets.forEach(e => {
            e.backgroundColor = colorMapping[element.profit_select_type.value][e.label].backgroundColor
        })

        chart.destroy()

        chart = getChart(ctx, element.profit_select_type.value)
        chart.data = data

        prettierOptions(element.profit_select_type.value, chart)

        chart.update()



        // TAMBAH CLASS OPACITY KALAU BAR
        if (element.profit_select_type.value === "bar") {
            document.querySelectorAll('label[data-control="profit"][data-type="fill"]').forEach(e => {
                e.classList.add("off")
            })

        } else {
            document.querySelectorAll('label[data-control="profit"][data-type="fill"]').forEach(e => {
                e.classList.remove("off")
            })
        }


    })

    // TIME PERIOD
    element.profit_filter.addEventListener("change", () => {
        if (element.profit_filter.value !== "custom") {
            element.profit_div_option_else.classList.add("hide")
            chart.data.labels = getLabels(dummyArrayLabel, element.profit_filter.value)

            let domFill = document.querySelectorAll('input[data-control="profit"][data-type="fill"]')
            let domHidden = document.querySelectorAll('input[data-control="profit"][data-type="hidden"]')

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
                let data = getData(list[key], key !== "interest" ? "takeProfit" : "interest", element.profit_filter.value)

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

        if (element.profit_filter.value === "custom") {
            [element.profit_filter_input_start, element.profit_filter_input_end].forEach(e => e.value = "")
            element.profit_div_option_else.classList.remove("hide")
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
    element.profit_filter_input_start.addEventListener("input", () => inputElseFilter(dummyArrayLabel, element.profit_filter_range_type, "start", element.profit_filter_input_start))

    // INPUT END
    element.profit_filter_input_end.addEventListener("input", () => inputElseFilter(dummyArrayLabel, element.profit_filter_range_type, "end", element.profit_filter_input_end))

    // RANGE TYPE
    element.profit_filter_range_type.addEventListener("change", () => {
        inputElseFilter(dummyArrayLabel, element.profit_filter_range_type, "start", element.profit_filter_input_start)
        inputElseFilter(dummyArrayLabel, element.profit_filter_range_type, "end", element.profit_filter_input_end)
    })

    // FILTER
    element.profit_filter_btn.addEventListener("click", () => {
        let error = alertingElse(element.profit_filter_input_start, element.profit_filter_input_end, element.profit_filter)
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

        let input_start = Number(element.profit_filter_input_start.value);
        let input_end = Number(element.profit_filter_input_end.value) || " ";

        chart = getChart(ctx, element.profit_select_type.value)

        chart.data.labels = getLabels(dummyArrayLabel, element.profit_filter_range_type.value, input_start, input_end)

        for (const key in list) {
            if (list[key].length === 0) continue;

            let data = getData(list[key], key !== "interest" ? "takeProfit" : "interest", element.profit_filter_range_type.value, input_start, input_end)

            chart.data.datasets.push({
                label: key,
                tention: 2,
                data,
                backgroundColor: colorMapping[element.profit_select_type.value][key].backgroundColor,
                borderColor: colorMapping[element.profit_select_type.value][key].borderColor
            })
        }

        prettierOptions(element.profit_select_type.value, chart)

        chart.update()
    })

    window.addEventListener('resize', function () {
        resize(chart);
    });
}

let status = emptyHandle()

if (status) {
    donut()
    line()
}