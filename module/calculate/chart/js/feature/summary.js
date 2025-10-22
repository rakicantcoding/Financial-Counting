import { element } from "../dom/dom.js";

export function loadSummary(data) {
    if (!data[0].category) {
        const percent = ((data.at(-1).amount - data[0].amount) / data[0].amount) * 100;

        cekPercent(percent, element.summary_cashflow_percent)

        element.cashflow_summary_p_label.textContent = element.summary_cashFlow_select.value
        element.summary_cashflow_percent.textContent = data.at(-1).amount >= data[0].amount ? `▲ ${percent.toFixed(2)}%` : `▼ ${percent.toFixed(2)}%`;

        element.summary_cashFlow_before_item.textContent = `Rp. ${parseInt(data[0].amount).toLocaleString("id-ID")}`;
        element.summary_cashFlow_after_item.textContent = `Rp. ${parseInt(data.at(-1).amount).toLocaleString("id-ID")}`;

        element.summary_cashFlow_before_item_month.textContent = `${data[0].month} Month `
        element.summary_cashFlow_after_item_month.textContent = `${data.at(-1).month} Month`
    }

    else {
        element.summary_list_item.innerHTML = ""

        const mapping = {
            expense: ["amount"],
            invest: ["deposit", "portofolio", "tp"],
            interest: ["deposit", "portofolio", "tp"],
            saving: ["amount", "portofolio"]
        }

        mapping[data[0].category].forEach(e => {
            let div_container = element.summary_list_item

            let div_main_wrapper = document.createElement("div")
            div_main_wrapper.classList.add("summary-item-wrapper", e)

            let div_label = document.createElement("div")
            div_label.classList.add("summary_label")

            let p_label = document.createElement("div")
            p_label.classList.add("p_label")
            p_label.textContent = e
            div_label.appendChild(p_label)

            let div_percent = document.createElement("div")
            div_percent.classList.add("summary_percent", e)

            let p_percent = document.createElement("p")
            const percent = ((data.at(-1)[e] - data[0][e]) / data[0][e]) * 100;
            cekPercent(percent, p_percent)
            p_percent.textContent = data.at(-1)[e] >= data[0][e] ? `▲ ${percent.toFixed(2)}%` : `▼ ${percent.toFixed(2)}%`

            div_percent.appendChild(p_percent)

            let div_item = document.createElement("div")
            div_item.classList.add("summary-flow-container", e)

            let div_before = document.createElement("div")
            div_before.classList.add("summary-before")

            let div_after = document.createElement("div")
            div_after.classList.add("summary-after")

            let p_before = document.createElement("p")
            p_before.textContent = `Rp. ${parseInt(data[0][e]).toLocaleString("id-ID")}`

            let p_month_before = document.createElement("p")
            p_month_before.textContent = `${data[0].month} Month`
            p_month_before.classList.add("summary-item-month")

            div_before.append(p_before, p_month_before)



            let p_after = document.createElement("p")
            p_after.textContent = ` Rp. ${parseInt(data.at(-1)[e]).toLocaleString("id-ID")}`

            let p_month_after = document.createElement("p")
            p_month_after.textContent = `${data.at(-1).month} Month`
            p_month_after.classList.add("summary-item-month")

            div_after.append(p_after, p_month_after)

            div_item.append(div_before, div_after)

            div_main_wrapper.append(div_label, div_percent, div_item)

            div_container.appendChild(div_main_wrapper)
        })

        document.querySelectorAll(".summary-checkbox").forEach(e => e.checked = true)
    }


}



// KHUSUS SUMMARY LIST

// MEMBUAT CHECKBOX UNTUK SETIAP CATEGORY YANG DIPILIH
export function loadCheckbox(category) {
    element.summary_list_checkbox.innerHTML = "";

    const mapping = {
        expense: ["amount"],
        invest: ["deposit", "portofolio", "tp"],
        interest: ["deposit", "portofolio", "tp"],
        saving: ["amount", "portofolio"]
    }

    // MEMBUAT CHECKBOX
    mapping[category].forEach(e => {
        let label = document.createElement("label")
        let checkBox = document.createElement("input")
        checkBox.type = "checkbox"
        checkBox.value = e
        checkBox.classList.add("checkbox", `summary-checkbox`)
        checkBox.checked = true

        label.appendChild(checkBox)
        label.appendChild(document.createTextNode(" " + e))

        element.summary_list_checkbox.appendChild(label)
    })
}

// FUNCTION EVENT UNTUK CHECKBOX
export function eventCheckbox() {
    document.querySelectorAll(".summary-checkbox").forEach(e => {
        e.addEventListener("change", () => {
            document.querySelectorAll(".summary-item-wrapper").forEach(item => {
                if (item.classList.contains(e.value)) {
                    e.checked === true ? item.classList.remove("hide") : item.classList.add("hide");
                };
            });

        })
    })

}


function cekPercent(percent, p) {
    if (percent < 0) {
        p.classList.add("minus")
    } else {
        p.classList.add("positive")
    }
}