import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart, prettierOptions, getData, getLabels, resize } from "../utility/chart.js";
import { chartControl } from "../utility/toolsControl.js";
import { inputElseFilter, alertingElse } from "../utility/filterElse.js";

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

    // HIDE HEAD SECTION DONUT JIKA LIST KOSONG
    if (Object.values(list).length === 0) {
        let head = document.querySelector(`div[data-head = "profit"]`);
        let headerContentBody = document.querySelector(`div[data-headerContentBody="profit"]`);
        let contentCheckBox = document.querySelector(`div[data-contentCheckbox="profit"]`);
        let line = document.querySelector(`div[data-chartL = "profit"]`);

        let checkBox = Array.from(document.querySelectorAll(`input[data-control = "profit"]`));
        checkBox.forEach(e => e.checked = false);

        head.classList.add("hide");
        headerContentBody.classList.add("off-permanent");
        contentCheckBox.classList.add("off-permanent");

        line.innerHTML = "";

        let div = document.createElement("div");
        div.textContent = `"You don’t have any profitable data yet."`;
        div.classList.add("line-note");
        line.append(div);

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
    
}

donut()
line()