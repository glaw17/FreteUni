(() => {
  const navbar = document.querySelector(".navbar");
  if (!navbar || navbar.classList.contains("navbar-simple")) {
    return;
  }

  const toggle = navbar.querySelector(".navbar-toggle");
  const profile = navbar.querySelector(".profile-area");
  const logout = navbar.querySelector("#logout-btn");
  const logoutError = navbar.querySelector("#logout-error");
  const tracking = navbar.querySelector("#navbar-search");
  const search = navbar.querySelector("#search-input");
  const mobile = window.matchMedia("(max-width: 1030px)");

  function setMenuOpen(open) {
    navbar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (!open && profile) {
      profile.open = false;
    }
  }

  toggle.addEventListener("click", () => {
    setMenuOpen(!navbar.classList.contains("is-open"));
  });

  mobile.addEventListener("change", () => setMenuOpen(false));

  document.addEventListener("click", event => {
    if (profile && profile.open && !profile.contains(event.target)) {
      profile.open = false;
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") {
      return;
    }
    if (profile?.open) {
      profile.open = false;
      profile.querySelector("summary").focus();
    } else if (navbar.classList.contains("is-open")) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  function mostrarIndisponibilidade(elemento, event) {
    // Remover data-unavailable quando a respectiva rota estiver implementada.
    const message = elemento.dataset.unavailable;
    const modal = document.getElementById("navbar-unavailable");
    if (!message || !modal || !window.bootstrap?.Modal) {
      return;
    }
    event.preventDefault();
    document.getElementById("navbar-unavailable-description").textContent = message;
    window.bootstrap.Modal.getOrCreateInstance(modal).show(elemento);
  }

  navbar.querySelectorAll("a[data-unavailable]").forEach(link => {
    link.addEventListener("click", event => {
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        mostrarIndisponibilidade(link, event);
      }
    });
  });

  tracking.addEventListener("submit", event => {
    search.value = search.value.trim();
    if (!search.value) {
      event.preventDefault();
      search.reportValidity();
      search.focus();
      return;
    }
    mostrarIndisponibilidade(tracking, event);
  });

  if (logout) {
    logout.addEventListener("click", async () => {
      if (logout.disabled) {
        return;
      }
      logout.disabled = true;
      logoutError.textContent = "";
      const original = logout.innerHTML;
      logout.textContent = "Saindo...";
      try {
        const response = await fetch("/auth/logout", {
          method: "POST",
          headers: { Accept: "application/json" },
          credentials: "same-origin",
          signal: AbortSignal.timeout(10000)
        });
        const data = await response.json();
        if (!response.ok || data.status !== "success") {
          throw new Error("Falha no logout");
        }
        window.location.replace("/");
      } catch (error) {
        profile.open = true;
        logoutError.textContent = "Não foi possível sair. Tente novamente.";
        logout.disabled = false;
        logout.innerHTML = original;
      }
    });
  }
})();
