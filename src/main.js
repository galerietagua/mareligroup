// Mobilní menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});

// Postupné zobrazení bloků při scrollu
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
    io.observe(el);
  });
} else {
  items.forEach((el) => el.classList.add("is-in"));
}

// Kontaktní formulář – Web3Forms; bez klíče otevře e-mailového klienta
const form = document.getElementById("contact-form");
if (form) {
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button[type=submit]");
  const say = (msg, error = false) => {
    status.textContent = msg;
    status.classList.toggle("is-error", error);
  };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll("[required]").forEach((f) => {
      const bad = !f.checkValidity();
      f.setAttribute("aria-invalid", String(bad));
      if (bad && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      say("Vyplňte prosím jméno, platný e-mail a zprávu.", true);
      firstInvalid.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const key = form.dataset.key;
    if (!key) {
      const body = `${data.message}\n\n${data.name}\n${data.email}`;
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent("Poptávka: " + data.topic)}&body=${encodeURIComponent(body)}`;
      return;
    }

    button.disabled = true;
    say("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, access_key: key, botcheck: data.botcheck ? true : "", from_name: "Web MARELI", replyto: data.email }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset();
      say("Děkujeme! Zprávu jsme přijali a brzy se vám ozveme.");
    } catch {
      say(`Zprávu se nepodařilo odeslat. Napište nám prosím přímo na ${form.dataset.email}.`, true);
    } finally {
      button.disabled = false;
    }
  });
}
