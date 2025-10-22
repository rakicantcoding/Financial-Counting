export function totalExpense(incomeArray, expenseArray) {
    let totalIncome = incomeArray.reduce((curr, arr) => { return curr + arr.amount }, 0)
    let totalExpense = 0

    let expenseGroup = expenseArray.filter(e => e.category === "expense")
    let investGroup = expenseArray.filter(e => e.category === "invest")
    let interestGroup = expenseArray.filter(e => e.category === "interest")
    let savingGroup = expenseArray.filter(e => e.category === "saving")


    // EXPENSE

    expenseGroup.forEach(e => {
        if (e.type === "nominal") {
            totalExpense += e.amount
        }

        if (e.type === "percent") {
            totalExpense += totalIncome * (e.amountPercent / 100)
        }
    });


    // INVEST
    investGroup.forEach(e => {
        totalExpense += totalIncome * (e.depositPercent / 100)
    })

    // INTEREST
    interestGroup.forEach(e => {
        totalExpense += totalIncome * (e.depositPercent / 100)
    })

    // SAVING
    savingGroup.forEach(e => {
        if (e.type === "percent") {
            totalExpense += totalIncome * (e.amountPercent / 100)
        }

        else if (e.type === "nominal") {
            totalExpense += e.amount
        }
    })

    return totalExpense
}





// KONSEP SAVE 
// saveData = {
//     firstData: {income, expense, currennt},
//     firstList: {income: [{}], expense [{}], invest [{}], interest [{}]},
//     Summary: {totalIncome, totalExpense, totalbalance},
//     list: {
//         expense: [{month, name, amountPercent, amount}],
//         invest: [{month, name, depositPercent, deposit, tpPercent, tp, portofolio}],
//         interest: [{month, name, depositPercent, deposit, tpPercent, tp, portofolio}]
//     }
// }

export function save(mainArray, category, data) {
    mainArray.list[category].push(data)
}


