document.querySelectorAll(".cta").forEach(btn =>
  btn.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  })
);

const form = document.getElementById("contactForm");
const msgEl = document.getElementById("formMsg");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgEl.textContent = "Отправка...";
  const formData = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      msgEl.textContent = "Спасибо! Мы свяжемся с вами.";
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    msgEl.textContent = "Ошибка отправки, попробуйте позже.";
  }
});