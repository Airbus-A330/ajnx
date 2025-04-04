function setActive(element) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.classList.remove("active");
    });

    // Add active class to clicked nav item
    element.classList.add("active");
}
