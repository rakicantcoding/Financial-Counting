const data = JSON.parse(localStorage.getItem("data"))

document.querySelectorAll(".chart-view-type").forEach(e => {
    e.classList.add("hide")
})

if (data.cashFlow.income.length > 12) {
    document.querySelectorAll(".chart-view-type").forEach(e => {
        e.classList.remove("hide")
    })

    document.querySelectorAll(".view-type").forEach(e=>{
        e.value = "year"
    })
}

else {
    document.querySelectorAll(".view-type").forEach(e=>{
        e.value = "month"
    })
}

export function loadCheckboxChart(show, fill) {
    show.forEach(e=>{
        e.checked = true
    })
    fill.forEach(e=>{
        e.checked = false
    })
}