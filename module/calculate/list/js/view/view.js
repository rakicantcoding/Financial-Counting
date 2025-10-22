export function show(button, text, itemShow) {
      let isOpen = false;
      button.textContent = `${text} ▶`;

      button.addEventListener("click", () => {
        isOpen = !isOpen; // toggle true/false

        if (isOpen) {
          button.textContent = `${text} ▼`;
          itemShow.classList.remove("hide");
        } else {
          button.textContent = `${text} ▶`;
          itemShow.classList.add("hide");
        }
      });
}