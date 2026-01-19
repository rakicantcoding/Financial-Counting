let data = JSON.parse(localStorage.getItem("result"));

if (!data) {
    alert('Need input data in "Calculate" before using page "Chart" aaa');
    window.location.href = "../calculate/index.html";
} else {
    let dummyName = Object.keys(data.summary).find(e => data.summary[e].length !== 0)

    const maxMonth = Math.max(...data.summary[dummyName].map(e => e.month))

    if (maxMonth > 36) {
        let DomTimePeriod = document.querySelectorAll(`select[data-select="timePeriod"]`);
        DomTimePeriod.forEach(e=> e.value = "year")
    }

    import("./feature/cashFlow.js");
    import("./feature/expenseFlow.js");
    import("./feature/profitFlow.js");
    import("./feature/listFlow.js");
    import("./feature/logFlow.js");
}