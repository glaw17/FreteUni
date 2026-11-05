(() => {
  const navbarMenuSelectors = document.querySelectorAll(
    '.navbar-nav [data-bs-toggle="dropdown"]',
  );

  navbarMenuSelectors.forEach((button) => {
    const arrow = button.querySelector(".nav-arrow-button");

    button.addEventListener("shown.bs.dropdown", () => {
      arrow.classList.replace("fa-angle-down", "fa-angle-up");
    });

    button.addEventListener("hidden.bs.dropdown", () => {
      arrow.classList.replace("fa-angle-up", "fa-angle-down");
    });
  });
})();
