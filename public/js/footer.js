(() => {
  const form = document.getElementById("footer-review");
  if (!form) {
    return;
  }

  const rating = document.getElementById("footer-rating");
  const ratingValue = document.getElementById("footer-rating-value");
  const status = document.getElementById("footer-review-status");
  const submitButton = form.querySelector('button[type="submit"]');

  rating.addEventListener("input", () => {
    ratingValue.value = rating.value;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled) {
      return;
    }

    submitButton.disabled = true;
    rating.disabled = true;
    status.classList.remove("text-danger");
    status.textContent = "Enviando sua avaliação…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(rating.value) }),
        signal: AbortSignal.timeout(10000),
      });
      const result = await response.json();
      if (!response.ok || result?.status !== "success") {
        throw new Error("Não foi possível enviar a avaliação.");
      }
      status.textContent = "Obrigado pela sua avaliação!";
    } catch {
      status.classList.add("text-danger");
      status.textContent = "Não foi possível enviar sua avaliação. Tente novamente.";
    } finally {
      rating.disabled = false;
      submitButton.disabled = false;
    }
  });
})();
