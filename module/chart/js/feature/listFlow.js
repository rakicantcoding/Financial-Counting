import { data } from "../utility/storage.js";
import { element } from "../dom/dom.js";
import { getChart, prettierOptions, getData, getLabels, resize } from "../utility/chart.js";
import { chartControl } from "../utility/toolsControl.js";
import { inputElseFilter, alertingElse } from "../utility/filterElse.js";

let list = data.expense;

let category = element.list_category; // SELECT CATEGORY
let name = element.list_name; // SELECT NAME

let ctx = element.list_canvas_line;
let chart = getChart(ctx, element.list_select_type.value);

const mapping = {
    expense: ["amount"],
    invest: ["amount", "takeProfit", "portofolio"],
    interest: ["amount", "interest", "portofolio"],
    saving: ["amount", "portofolio"]
}



const colorMapping = {
    line: {
        amount: {
            backgroundColor: "rgba(172, 57, 43, 0.3)",
            borderColor: "rgba(172, 57, 43, 1)"
        },
        takeProfit: {
            backgroundColor: "rgba(18, 143, 81, 0.3)",
            borderColor: "rgba(18, 143, 81, 1)"
        },
        interest: {
            backgroundColor: "rgba(163, 143, 0, 0.3)",
            borderColor: "rgba(163, 143, 0, 1)"
        },
        portofolio: {
            backgroundColor: "rgba(43, 81, 181, 0.3)",
            borderColor: "rgba(43, 81, 181, 1)"
        },
    },

    bar: {
        amount: {
            backgroundColor: "rgba(172, 57, 43, 0.5)"
        },
        takeProfit: {
            backgroundColor: "rgba(18, 143, 81, 0.5)"
        },
        interest: {
            backgroundColor: "rgba(163, 143, 0, 0.5)"
        },
        portofolio: {
            backgroundColor: "rgba(43, 81, 181, 0.5)",
        }
    }

}



// FUNGSI UNTUK OFF DAN ON CHECKBOX
function checkboxCheck() {
    const allDomLabel = document.querySelectorAll(`label[data-label="list"]`)
    allDomLabel.forEach(e => e.classList.add("off"))

    mapping[element.list_category.value].forEach(el => {
        const domLabel = document.querySelectorAll(`label[data-label="list"][data-type="hidden"][data-category="${el}"]`)
        domLabel.forEach(y => {
            y.classList.remove("off")
        })
    })

    if (element.list_select_type.value !== "bar") {
        mapping[element.list_category.value].forEach(el => {
            const domLabel = document.querySelectorAll(`label[data-label="list"][data-type="fill"][data-category="${el}"]`)
            domLabel.forEach(y => {
                y.classList.remove("off")
            })
        })
    }

}


function categoryChoosen() {
    name.innerHTML = "";
    let result = [...new Set(list[category.value].map(e => e.name))];

    result.forEach(e => {
        let option = document.createElement("option")
        option.value = e
        option.textContent = e
        name.append(option)
    })
}


function nameChoosen() {
    chart.destroy();
    chart = getChart(ctx, element.list_select_type.value);

    let dummyData = list[category.value].filter(e => e.name === name.value)

    let label = getLabels(dummyData, element.list_filter.value)
    chart.data.labels = label

    mapping[category.value].forEach(e => {
        let data = getData(dummyData, e, element.list_filter.value)

        let hide = document.querySelector(`input[data-control="list"][data-type="hidden"][data-category="${e}"]`).checked
        let fill = document.querySelector(`input[data-control="list"][data-type="fill"][data-category="${e}"]`).checked

        let dummmy = {
            backgroundColor: colorMapping[element.list_select_type.value][e].backgroundColor,
            borderColor: colorMapping[element.list_select_type.value][e].borderColor,
            label: e,
            hidden: !hide,
            fill,
            tention: 2,
            data
        }
        chart.data.datasets.push(dummmy)
    })

    prettierOptions(element.list_select_type.value, chart)

    chart.update()



    // INPUT START
    element.list_filter_input_start.addEventListener("input", () => inputElseFilter(dummyData, element.list_filter_range_type, "start", element.list_filter_input_start))

    // INPUT END
    element.list_filter_input_end.addEventListener("input", () => inputElseFilter(dummyData, element.list_filter_range_type, "end", element.list_filter_input_end))

    // RANGE TYPE
    element.list_filter_range_type.addEventListener("change", () => {
        inputElseFilter(dummyData, element.list_filter_range_type, "start", element.list_filter_input_start)
        inputElseFilter(dummyData, element.list_filter_range_type, "end", element.list_filter_input_end)
    })

    // FILTER
    element.list_filter_btn.addEventListener("click", () => {
        let error = alertingElse(element.list_filter_input_start, element.list_filter_input_end, element.list_filter)
        if (error) {
            return alert(error);
        }

        chart.destroy()

        let input_start = Number(element.list_filter_input_start.value);
        let input_end = Number(element.list_filter_input_end.value) || " ";

        chart = getChart(ctx, element.list_select_type.value)

        chart.data.labels = getLabels(dummyData, element.list_filter_range_type.value, input_start, input_end)

        mapping[category.value].forEach(e => {
            let data = getData(dummyData, e, element.list_filter_range_type.value, input_start, input_end)

            let hide = document.querySelector(`input[data-control="list"][data-type="hidden"][data-category="${e}"]`).checked
            let fill = document.querySelector(`input[data-control="list"][data-type="fill"][data-category="${e}"]`).checked

            let isi = {
                label: e,
                backgroundColor: colorMapping[element.list_select_type.value][e].backgroundColor,
                tention: 2,
                hidden: !hide,
                fill,
                data
            }

            if (element.list_select_type.value !== "bar") isi.borderColor = colorMapping[element.list_select_type.value][e].borderColor;

            chart.data.datasets.push(isi)
        })

        prettierOptions(element.list_select_type.value, chart)

        chart.update()
    })


}



// TYPE CHART
element.list_select_type.addEventListener("change", () => {

    let data = chart.data

    data.datasets.forEach(e => {
        e.backgroundColor = colorMapping[element.list_select_type.value][e.label].backgroundColor;

        if (element.list_select_type.value !== "bar") e.borderColor = colorMapping[element.list_select_type.value][e.label].borderColor;
    })

    chart.destroy()

    chart = getChart(ctx, element.list_select_type.value)
    chart.data = data

    prettierOptions(element.list_select_type.value, chart)

    chart.update()



    // TAMBAH CLASS OPACITY KALAU BAR
    checkboxCheck()


})



// TIME PERIOD
element.list_filter.addEventListener("change", () => {
    if (element.list_filter.value !== "custom") {
        element.list_div_option_else.classList.add("hide")

        let dummyData = list[category.value].filter(e => e.name === name.value)

        chart.data.labels = getLabels(dummyData, element.list_filter.value)

        let domFill = document.querySelectorAll('input[data-control="list"][data-type="fill"]')
        let domHidden = document.querySelectorAll('input[data-control="list"][data-type="hidden"]')

        let dummyColor = {}

        chart.data.datasets.forEach(e => {
            dummyColor[e.label] = {
                backgroundColor: colorMapping[element.list_select_type.value][e.label].backgroundColor,
            }

            if (element.list_select_type.value !== "bar") {
                dummyColor[e.label].borderColor = colorMapping[element.list_select_type.value][e.label].borderColor
            }
        })

        chart.data.datasets = []

        mapping[category.value].forEach(e => {
            let data = getData(dummyData, e, element.list_filter.value)
            let dummmy = {
                backgroundColor: dummyColor[e].backgroundColor,
                label: e,
                data,
                fill: [...domFill].find(el => el.dataset.category === e).checked,
                hidden: ![...domHidden].find(el => el.dataset.category === e).checked,
            }

            if (element.list_select_type.value !== "bar") dummmy.borderColor = dummyColor[e].borderColor;
            chart.data.datasets.push(dummmy)
        })
        chart.update()
    }

    if (element.list_filter.value === "custom") {
        [element.list_filter_input_start, element.list_filter_input_end].forEach(e => e.value = "")
        element.list_div_option_else.classList.remove("hide")
    }
})



// MENGISI OPTION UNTUK SELECT CATEGORY
for (const key in list) {
    if (list[key].length === 0) continue;
    let option_category = document.createElement("option");
    option_category.textContent = key
    category.append(option_category)
}



// CHECK BOX
const checkBoxDom = Array.from(document.querySelectorAll(`input[data-control="list"]`));
checkBoxDom.forEach(e => {
    e.addEventListener("change", () => {
        chartControl(e.dataset.category, chart, e, e.dataset.type)
    })
})



// CATEGORY SELECT
categoryChoosen()
category.addEventListener("change", () => {
    categoryChoosen(); // Jalankan fungsi category (mengisi select name dengan option semua item)

    checkboxCheck(); // Jalankan fungsi checkbox (memberikan class off pada label yang tidak ada fungsinya)

    nameChoosen(); // Langsung jalankan select name
})



checkboxCheck()



// NAME SELECT
nameChoosen()
name.addEventListener("change", () => {
    nameChoosen()
})


window.addEventListener('resize', function () {
    resize(chart);
});