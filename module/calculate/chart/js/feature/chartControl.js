import { element } from "../dom/dom.js";

const data = JSON.parse(localStorage.getItem("data"))

// FUNGSI MENGGANTI TYPE CHART
export function changeChartType(canvas, newType) {
    const ctx = canvas.ctx
    const data = canvas.data

    canvas.destroy()

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {
            x: {
                ticks: {
                    display: window.innerWidth >= 768 // hide X labels
                },
                grid: {
                    display: window.innerWidth >= 768 // hide X gridlines
                }
            },
            y: {
                ticks: {
                    display: window.innerWidth >= 768 // hide Y labels
                },
                grid: {
                    display: window.innerWidth >= 768 // hide Y gridlines
                }
            }
        }
    }

    return new Chart(ctx, {
        type: newType,
        data,
        options
    })
}



// FUNGSI SHOW
export function show(canvas, label, checkBox) {
    let item = canvas.data.datasets.find(e => e.label === label)
    item.hidden = !checkBox
    canvas.update()
}



// FUNGSI FILL
export function fill(canvas, label, checkBox) {
    let item = canvas.data.datasets.find(e => e.label === label)
    item.fill = checkBox
    canvas.update()
}







// ==================
//       LIST
// ==================



// FILTER CATEGORY SELECT UNTUK LIST
for (const key in data.list) {
    if (data.list[key].length > 0 && data.list[key].flat().find(e => e.type === "percent")) {
        let optionList = document.createElement("option")
        optionList.value = key
        optionList.textContent = key

        element.listCanvas_select_category.appendChild(optionList)
    }
}


// LOAD ISI SELECT NAME
export function loadListName_select(category) {
    const mainMapping = {
        expense: ["amount"],
        invest: ["deposit", "portofolio", "tp"],
        interest: ["deposit", "portofolio", "tp"],
        saving: ["amount", "portofolio"]
    }
    element.listCanvas_select_name.innerHTML = ""
    element.summary_list_control_select.innerHTML = ""
    


    const mappingListBox = {
        amount: [element.label_show_amount, element.label_fill_amount],
        deposit: [element.label_show_deposit, element.label_fill_deposit],
        portofolio: [element.label_show_portofolio, element.label_fill_portofolio],
        tp: [element.label_show_tp, element.label_fill_tp]
    }

    // HIDE SEMUA
    for (const key in mappingListBox) {
        mappingListBox[key].forEach(e => {
            e.classList.add("hide")
        })
    }

    // MENAMPILKAN CHECKBOX YANG SESUAI
    mainMapping[category].forEach(e => {
        mappingListBox[e].forEach(item => item.classList.remove("hide"))
    })


    // PENAMMBAHAN NAMA DI SELECT NAMA LIST
    let isi = data.list[category]

    let item = [... new Set(isi.flat().map(e => e.name))]
    item.forEach(e => {
        let optionList = document.createElement("option")
        optionList.value = e
        optionList.textContent = e
        element.listCanvas_select_name.appendChild(optionList)

        let optionSummary = document.createElement("option")
        optionSummary.value = e
        optionSummary.textContent = e
        element.summary_list_control_select.appendChild(optionSummary)
    })
}


