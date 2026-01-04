// NOTE:
// KEY LIST APPEND KEY ITEM
// KEY ITEM APPEND P ITEM

export function domListing(category, motherElement) {
    let key_container = document.createElement("div");
    key_container.classList.add("key-container");
    motherElement.append(key_container);

    let key_p = document.createElement("p");
    key_p.textContent = `Category: ${category}`;

    let key_list = document.createElement("div");
    key_list.classList.add("key-list");
    key_container.append(key_p, key_list);
    return key_list
}