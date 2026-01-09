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

function expense() {
    let list = data.expense
}

cashFlow(element.cashFlow_log_select.value)
element.cashFlow_log_select.addEventListener("change", () => cashFlow(element.cashFlow_log_select.value))