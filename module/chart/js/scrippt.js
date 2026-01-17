let data = JSON.parse(localStorage.getItem("result"));

if (!data) {
    alert('Need input data in "Calculate" before using page "Chart"');
    window.location.href = "../../calculate/index.html";
} else {
    import("./feature/cashFlow.js");
    import("./feature/expenseFlow.js");
    import("./feature/listFlow.js");
    import("./feature/logFlow.js");
}