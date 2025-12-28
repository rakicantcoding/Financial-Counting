import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart, getData, getLabels } from "../utility/chart.js";
import { chartControl } from "../utility/toolsControl.js";
import { inputElseFilter, alertingElse } from "../utility/filterElse.js";

let list = data.expense

const colorMapping = {
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
}

console.log(list)

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

    const expense = value.expense;
    const invest = value.invest;
    const interest = value.interest;
    const saving = value.saving;

    // DATASETS
    chart.data.datasets.push({
        backgroundColor: ["rgba(191, 84, 0, 0.3)", "rgba(2, 160, 133, 0.3)", " rgba(148, 143, 42, 0.3)", " rgba(122, 68, 173, 0.3)"],
        borderColor: ["rgba(191, 84, 0, 1)", "rgba(2, 160, 133, 1)", " rgba(148, 143, 42, 1)", "rgba(122, 68, 173, 1)"],
        data: [expense, invest, interest, saving]
    })

    chart.update()

    // CHART DONUT DONE. WIP = CHECKBOX + PERCENT;
}

donut()