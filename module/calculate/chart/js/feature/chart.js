import { element } from "../dom/dom.js";
const data = JSON.parse(localStorage.getItem("data"))

// FUNGSI MEMBUAT CHART
export function getChart(ctx, type, visual) {
    let month = data.cashFlow.income.map(e => e.month);

    let result = []

    if (visual !== "year") {
        result = month
    }

    else if (visual === "year") {
        let convert = [];
        // DESIMAL DARI TAHUN
        let dummy = parseInt(month.length / 12);
        // SISA DARI TAHUN
        let sisa = month.length % 12;

        // LAKUKAN PUSH BULAN SESUAI TAHUN
        for (let index = 1; index <= dummy; index++) {
            convert.push(index * 12)
        }

        result.push(month[0], ...convert)

        // KALAU SISA ENGGA KOSONG MAKA TAMBAHKAN SISA BULAN
        if (sisa > 0) {
            const start = month.length - sisa;
            // LAKUKAN PUSH SISA BULAN
            for (let index = start; index < month.length; index++) {
                result.push(month[index])
            }
        }
    }




    return new Chart(ctx, {
        type: type !== undefined ? type : "line",
        data: {
            labels: result,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
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
    })
}


export function mappingCashflow(canvas, statusVisual) {
    let def = {
        label: "",
        data: [],
        borderWidth: 1,
        fill: false,
        tension: 0.2
    }

    let cashFlow = {
        income: {
            ...def,
            backgroundColor: "rgba(75, 192, 92, 0.3)",
            borderColor: "rgba(75, 192, 92, 1)"
        },

        expense: {
            ...def,
            backgroundColor: "rgba(255, 99, 132, 0.3)",
            borderColor: "rgba(255, 99, 132, 1)"
        },

        balance: {
            ...def,
            backgroundColor: "rgba(54, 162, 235, 0.3)",
            borderColor: "rgba(54, 162, 235, 1)"
        }
    }



    for (const key in cashFlow) {
        if (statusVisual === "year") {
            cashFlow[key].data = []
            canvas.data.labels.forEach(item => {
                cashFlow[key].data.push(data.cashFlow[key].map(e => e.amount)[item - 1])
            })
        }

        else {
            cashFlow[key].data = data.cashFlow[key].map(e => e.amount)
        }
        cashFlow[key].label = key
    }

    return cashFlow
}



// LIST
const mainMapping = {
    expense: ["amount"],
    invest: ["deposit", "portofolio", "tp"],
    interest: ["deposit", "portofolio", "tp"],
    saving: ["amount", "portofolio"]
}


export function loadChart_list(canvas, label, statusVisual) {
    const month = canvas.data.labels;

    const def = {
        labels: "",
        data: [],
        borderWidth: 1,
        fill: false,
        tension: 0.2
    }

    let mapping = {
        amount: {
            backgroundColor: "rgba(255, 99, 132, 0.3)",
            borderColor: "rgba(255, 99, 132, 1)"
        },

        deposit: {
            backgroundColor: "rgba(255, 99, 132, 0.3)",
            borderColor: "rgba(255, 99, 132, 1)"
        },

        portofolio: {
            backgroundColor: "rgba(54, 162, 235, 0.3)",
            borderColor: "rgba(54, 162, 235, 1)"
        },

        tp: {
            backgroundColor: "rgba(75, 192, 92, 0.3)",
            borderColor: "rgba(75, 192, 92, 1)"
        }

    }

    let datasets = []


    // MENGAMBIL DATA SESUAI DENGAN LABEL
    let item = data.list[element.listCanvas_select_category.value].flat().filter(item => item.name === label)

    if (statusVisual === "year") {
        mainMapping[element.listCanvas_select_category.value].forEach(e => {
            let convertMonth = item.filter(i => month.includes(i.month))
            let dummyData = {
                ...def,
                label: e,
                data: convertMonth.map(p=> p[e]),
                ...mapping[e]
            }
            datasets.push(dummyData)
        })
    }

    else if (statusVisual !== "year") {
        mainMapping[element.listCanvas_select_category.value].forEach(e => {
            let dummyData = {
                ...def,
                label: e,
                data: item.map(x => x[e]),
                ...mapping[e]
            }
            datasets.push(dummyData)
        })
    }


    return datasets
}