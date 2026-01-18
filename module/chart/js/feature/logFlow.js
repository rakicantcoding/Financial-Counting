import { element } from "../dom/dom.js";
import { domListing } from "../utility/overviewList.js";
import { data } from "../utility/storage.js";

function cashFlow(value) {
    element.cashFlow_log_body.innerHTML = "";
    let list = data.summary;

    let dummyData;

    if (value === "all") dummyData = list;
    else { dummyData = { [value]: list[value] } }

    for (const key in dummyData) {
        if (dummyData[key][0].amount === 0 && value !== "all") {
            let div_alert = document.createElement("div");
            div_alert.textContent = `Empty`;
            div_alert.classList.add("list-note");
            element.cashFlow_log_body.append(div_alert);
            continue;
        };

        if (dummyData[key][0].amount === 0) continue;

        let key_list = domListing(key, element.cashFlow_log_body)

        dummyData[key].forEach(e => {
            let key_item = document.createElement("div");
            key_item.classList.add("key-item");

            let p_month = document.createElement("p")
            p_month.textContent = `Month: ${e.month}`;

            let div_amount = document.createElement("div");
            let p_amount = document.createElement("p");

            div_amount.append(p_amount);

            if (e.month !== 1) {
                let before = dummyData[key].find(m => m.month === e.month - 1);
                let plus = e.amount - before.amount;

                let plus_amount = document.createElement("p");
                plus_amount.classList.add("color-green")
                plus_amount.textContent = `+ Rp. ${Math.floor(plus).toLocaleString("id-ID")}`;

                div_amount.append(plus_amount)
            }

            p_amount.textContent = `Amount: Rp. ${Math.floor(e.amount).toLocaleString("id-ID")}`;

            key_item.append(p_month, div_amount);
            key_list.append(key_item)
        })
    }
}

function expense(value) {
    element.expense_log_body.innerHTML = "";
    let list = data.expense

    let dummyData;

    if (value === "all") dummyData = list;
    else { dummyData = { [value]: list[value] } }

    const mapping = {
        expense: ["amount"],
        invest: ["amount", "takeProfit", "portofolio"],
        interest: ["amount", "interest", "portofolio"],
        saving: ["amount", "portofolio"]
    }

    function capitalizeFirst(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }



    if (!element.expense_log_input.value.trim()) {
        for (const key in dummyData) {
            if (dummyData[key].length === 0 && value !== "all") {
                let div_alert = document.createElement("div");
                div_alert.textContent = `Empty`;
                div_alert.classList.add("list-note");
                element.expense_log_body.append(div_alert);
                continue;
            };

            if (dummyData[key].length === 0) continue;

            let key_list = domListing(key, element.expense_log_body)

            dummyData[key].forEach(e => {
                let key_item = document.createElement("div")
                key_item.classList.add("key-item");
                key_list.append(key_item);

                let p_month = document.createElement("p");
                p_month.textContent = `Month ${e.month}`;

                let p_name = document.createElement("p");
                p_name.textContent = `Name: ${e.name}`;

                key_item.append(p_month, p_name)

                mapping[key].forEach(el => {
                    let p = document.createElement("p");
                    p.textContent = `${capitalizeFirst(el)}: Rp. ${Math.floor(e[el]).toLocaleString("id-ID")}`;

                    let div_amount = document.createElement("div")
                    div_amount.append(p)

                    key_item.append(div_amount)
                    if (e.month !== 1) {
                        let before = dummyData[key].find(m => m.month === e.month - 1 && m.name === e.name);
                        let plus = e[el] - before[el];

                        let plus_amount = document.createElement("p");
                        plus_amount.classList.add("color-green")
                        plus_amount.textContent = `+ Rp. ${Math.floor(plus).toLocaleString("id-ID")}`;

                        div_amount.append(plus_amount)
                    }
                })
            })
        }
    }

    else {
        let dummyUrai = Object.values(dummyData).flat()
        let newDummyData = dummyUrai.filter(name =>
            name.name.toLowerCase().startsWith(element.expense_log_input.value.toLowerCase().trim())
        );

        let dummyCategory = [...new Set(newDummyData.map(e => e.category))]

        let mappingDummy = {}

        dummyCategory.forEach(e => {
            mappingDummy[e] = newDummyData.filter(el => el.category === e)
        })

        if (Object.values(mappingDummy).length === 0) {
            let div_alert = document.createElement("div");
            div_alert.textContent = `Empty`;
            div_alert.classList.add("list-note");
            element.expense_log_body.append(div_alert);
        }

        for (const key in mappingDummy) {
            if (mappingDummy[key].length === 0 && value !== "all") {
                let div_alert = document.createElement("div");
                div_alert.textContent = `Empty`;
                div_alert.classList.add("list-note");
                element.expense_log_body.append(div_alert);
                continue;
            };

            if (mappingDummy[key].length === 0) continue;

            let key_list = domListing(key, element.expense_log_body)

            mappingDummy[key].forEach(e => {
                let key_item = document.createElement("div");
                key_item.classList.add("key-item");
                key_list.append(key_item);

                let p_month = document.createElement("p");
                p_month.textContent = `Month ${e.month}`;

                let p_name = document.createElement("p");
                p_name.textContent = `Name: ${e.name}`;

                key_item.append(p_month, p_name)

                mapping[key].forEach(el => {
                    let p = document.createElement("p");
                    p.textContent = `${capitalizeFirst(el)}: Rp. ${Math.floor(e[el]).toLocaleString("id-ID")}`;

                    let div_amount = document.createElement("div")
                    div_amount.append(p)

                    key_item.append(div_amount)
                    if (e.month !== 1) {
                        let before = dummyData[key].find(m => m.month === e.month - 1 && m.name === e.name);
                        let plus = e[el] - before[el];

                        let plus_amount = document.createElement("p");
                        plus_amount.classList.add("color-green")
                        plus_amount.textContent = `+ Rp. ${Math.floor(plus).toLocaleString("id-ID")}`;

                        div_amount.append(plus_amount)
                    }
                })
            })
        }
    }
}

cashFlow(element.cashFlow_log_select.value)
element.cashFlow_log_select.addEventListener("change", () => cashFlow(element.cashFlow_log_select.value))

expense(element.expense_log_select.value)
element.expense_log_select.addEventListener("change", () => expense(element.expense_log_select.value))

let debounceTimer;

element.expense_log_input.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    const keyword = element.expense_log_input.value.toLowerCase()
        .trim()
    element.expense_log_suggestion.innerHTML = "";

    if (keyword) {
        element.expense_log_suggestion.classList.remove("hide")
        const source =
            element.expense_log_select.value !== "all"
                ? data.expense[element.expense_log_select.value]
                : data.expense;

        const flatData = Object.values(source).flat();
        const uniqueNames = [...new Set(flatData.map(e => e.name))];

        const matches = uniqueNames.filter(name =>
            name.toLowerCase().startsWith(keyword)
        );

        const sliced = matches.slice(0, 5)

        if (sliced.find(e => e === keyword)) {
            debounceTimer = setTimeout(() => {
                return element.expense_log_suggestion.innerHTML = ""
            }, 1000);
        }

        sliced.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;

            li.addEventListener("click", () => {
                element.expense_log_input.value = name;
                element.expense_log_suggestion.innerHTML = "";
                expense(element.expense_log_select.value);
            });

            element.expense_log_suggestion.append(li);
        });

    } else {
        element.expense_log_suggestion.classList.add("hide")
    }

    debounceTimer = setTimeout(() => {
        expense(element.expense_log_select.value);
    }, 500);
});
