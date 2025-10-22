import { element } from "./dom/dom.js";
import { getChart, mappingCashflow, loadChart_list } from "./feature/chart.js";
import { changeChartType, show, fill, loadListName_select } from "./feature/chartControl.js";
import { loadSummary, loadCheckbox, eventCheckbox } from "./feature/summary.js";
import { loadCheckboxChart } from "./visual/visualChartControl.js";

const data = JSON.parse(localStorage.getItem("data"))

// CASHFLOW
let ctxCashflow = element.cashFlowCanvas.getContext("2d")

// MENGAMBIL SEMUA DATA CASHFLOW
let cashflowCanvas = getChart(ctxCashflow, element.cashFlow_type.value, element.view_type_cashflow.value)

let dataCashflow = mappingCashflow(cashflowCanvas, element.view_type_cashflow.value)

// MENAMBAHKAN DATA CASHFLOW KE DALAM DATASETS
cashflowCanvas.data.datasets = [dataCashflow.income, dataCashflow.expense, dataCashflow.balance]
cashflowCanvas.update()


element.view_type_cashflow.addEventListener("change", () => {
    cashflowCanvas.destroy()

    cashflowCanvas = getChart(ctxCashflow, element.cashFlow_type.value, element.view_type_cashflow.value)

    dataCashflow = mappingCashflow(cashflowCanvas, element.view_type_cashflow.value)

    cashflowCanvas.data.datasets = [dataCashflow.income, dataCashflow.expense, dataCashflow.balance]

    cashflowCanvas.update()
    loadCheckboxChart(document.querySelectorAll(".show_cashFlow"), document.querySelectorAll(".fill_cashFlow"))
})


loadSummary(data.cashFlow[element.summary_cashFlow_select.value])
element.summary_cashFlow_select.addEventListener("change", () => {
    loadSummary(data.cashFlow[element.summary_cashFlow_select.value])
})



// CASHFLOW TYPE
element.cashFlow_type.addEventListener("change", () => {
    cashflowCanvas = changeChartType(cashflowCanvas, element.cashFlow_type.value)
    if (element.cashFlow_type.value !== "line") {
        element.cashflow_fill_control.classList.add("off")
    } else {
        element.cashflow_fill_control.classList.remove("off")
    }
})


document.querySelectorAll(".show_cashFlow").forEach(e => {
    e.addEventListener("change", () =>
        show(cashflowCanvas, e.value, e.checked)
    )
})


// CASHFLOW CHECK-BOX FILL
document.querySelectorAll(".fill_cashFlow").forEach(e => {
    e.addEventListener("change", () =>
        fill(cashflowCanvas, e.value, e.checked)
    )
})



// LIST
const ctxList = element.listCanvas.getContext("2d")

let listCanvas = getChart(ctxList, element.list_type.value, element.view_type_list.value)


// LIST TYPE
element.list_type.addEventListener("change", () => {
    listCanvas = changeChartType(listCanvas, element.list_type.value)
    element.list_type.value === "line" ? element.list_fill_control.classList.remove("off") : element.list_fill_control.classList.add("off")
})


// LOAD ISI LIST SELECT NAME 
loadListName_select(element.listCanvas_select_category.value)

listCanvas.data.datasets = loadChart_list(listCanvas, element.listCanvas_select_name.value, element.view_type_list.value)
listCanvas.update()

// SELECT CATEGORY
element.listCanvas_select_category.addEventListener("change", () => {
    document.querySelectorAll(".show_list").forEach(e => e.checked = true)
    loadCheckboxChart(document.querySelectorAll(".show_list"),document.querySelectorAll(".fill_list"))
    loadListName_select(element.listCanvas_select_category.value)
    listCanvas.data.datasets = loadChart_list(listCanvas, element.listCanvas_select_name.value, element.view_type_list.value)
    listCanvas.update()

    loadCheckbox(element.listCanvas_select_category.value)
    loadSummary(data.list[element.listCanvas_select_category.value].flat().filter(e => e.name === element.summary_list_control_select.value))
    eventCheckbox()
})

// SELECT NAME
element.listCanvas_select_name.addEventListener("change", () => {
    document.querySelectorAll(".show_list").forEach(e => e.checked = true)
    loadCheckboxChart(document.querySelectorAll(".show_list"), document.querySelectorAll(".fill_list"))
    listCanvas.data.datasets = loadChart_list(element.listCanvas_select_name.value)
    listCanvas.update()
})


// GANTI MODE TAHUN.BULAN
element.view_type_list.addEventListener("change", () => {
    loadCheckboxChart(document.querySelectorAll(".show_list"),document.querySelectorAll(".fill_list"))

    listCanvas.destroy()

    listCanvas = getChart(ctxList, element.list_type.value, element.view_type_list.value)

    listCanvas.data.datasets = loadChart_list(listCanvas, element.listCanvas_select_name.value, element.view_type_list.value)
    listCanvas.update()
})


// SHOW
document.querySelectorAll(".show_list").forEach(e => e.addEventListener("change", () =>
    show(listCanvas, e.value, e.checked)
))


// FILL
document.querySelectorAll(".fill_list").forEach(e => e.addEventListener("change", () =>
    fill(listCanvas, e.value, e.checked)
))

// LOAD CHECKBOX DI AWAL
loadCheckbox(element.listCanvas_select_category.value)

// LOAD SUMMARY DI AWAL
loadSummary(data.list[element.listCanvas_select_category.value].flat().filter(e => e.name === element.summary_list_control_select.value))

element.summary_list_control_select.addEventListener("change", () => loadSummary(data.list[element.listCanvas_select_category.value].flat().filter(e => e.name === element.summary_list_control_select.value)))

eventCheckbox()





window.addEventListener("resize", () => {
    const isDesktop = window.innerWidth >= 768;
    function load(canvas) {
        canvas.options.scales.x.ticks.display = isDesktop;
        canvas.options.scales.x.grid.display = isDesktop;
        canvas.options.scales.y.ticks.display = isDesktop;
        canvas.options.scales.y.grid.display = isDesktop;
        canvas.update();
    }

    load(cashflowCanvas)
    load(listCanvas)
});

