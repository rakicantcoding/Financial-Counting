const menuBtn = document.querySelector(".nav-btn")

const sidebar = document.querySelector(".sidebar")

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    sidebar.classList.add("active")
})

document.addEventListener("click", (e) => {
    const clickInsideSidebar = sidebar.contains(e.target)

    if (!clickInsideSidebar) {
        sidebar.classList.remove("active")
    }
})