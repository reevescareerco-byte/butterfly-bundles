const storageKey = "ndr-butterfly-bundle-progress-v1";

function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveProgress(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

const progressItems = [...document.querySelectorAll("[data-progress-item]")];
const savedProgress = getSavedProgress();

progressItems.forEach((item, index) => {
  item.checked = Boolean(savedProgress[index]);
  item.addEventListener("change", () => {
    const nextState = {};
    progressItems.forEach((checkbox, i) => {
      nextState[i] = checkbox.checked;
    });
    saveProgress(nextState);
    updateProgress();
  });
});

function updateProgress() {
  const completed = progressItems.filter(item => item.checked).length;
  const total = progressItems.length || 1;
  const percent = Math.round((completed / total) * 100);
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressFill").style.width = `${percent}%`;
}
updateProgress();

document.querySelectorAll(".accordion-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const article = trigger.closest(".accordion");
    const panel = article.querySelector(".accordion-panel");
    const symbol = article.querySelector(".accordion-symbol");
    const isOpen = article.classList.toggle("open");

    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.hidden = !isOpen;
    symbol.textContent = isOpen ? "−" : "+";
  });
});

document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;

    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.classList.remove("active");
      panel.hidden = true;
    });

    button.classList.add("active");
    const target = document.getElementById(tabId);
    target.hidden = false;
    target.classList.add("active");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-list a")];

const observer = new IntersectionObserver(
  entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] }
);

sections.forEach(section => observer.observe(section));
