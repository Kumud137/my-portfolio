// js available hai -> CSS ko batao (reveal animation isi se chalti hai)
document.documentElement.classList.add("js");
const $ = (s, all) =>
  all ? document.querySelectorAll(s) : document.querySelector(s);

/* 1. DARK MODE: button dabane par theme badalta hai aur yaad rakhta hai */
const root = document.documentElement;
try {
  root.dataset.theme =
    localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch (e) {}
$("#themeBtn").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch (e) {}
});

/* 2. MOBILE MENU */
const toggle = $("#navToggle"),
  menu = $("#navMenu"),
  links = $("#navMenu a", true);
function setMenu(open) {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
}
toggle.addEventListener("click", () =>
  setMenu(!menu.classList.contains("open")),
);
links.forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* 3. SCROLL: progress bar + navbar shadow + back-to-top button */
const bar = $("#progress"),
  navbar = $("#navbar"),
  toTop = $("#toTop");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / max) * 100 + "%";
  navbar.classList.toggle("scrolled", scrollY > 10);
  toTop.classList.toggle("show", scrollY > 600);
}
addEventListener("scroll", onScroll, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
onScroll();

/* 4. SCROLLSPY: jo section dikh raha hai uska link highlight */
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting)
        links.forEach((a) =>
          a.classList.toggle("active", a.hash === "#" + e.target.id),
        );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
$("main section[id]", true).forEach((s) => spy.observe(s));

/* 5. SCROLL REVEAL: elements screen par aate hi fade-in (ek ek karke delay ke saath) */
const io = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      obs.unobserve(e.target);
    });
  },
  { threshold: 0.12 },
);
$(".reveal", true).forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + "s";
  io.observe(el);
});

/* 6. TYPING EFFECT: alag-alag words type aur delete hote hain */
const words = [
  "responsive websites",
  "clean user interfaces",
  "practical projects",
];
const typed = $("#typed");
let w = 0,
  c = 0,
  deleting = false;
function type() {
  const word = words[w];
  c += deleting ? -1 : 1;
  typed.textContent = word.slice(0, c);
  let delay = deleting ? 40 : 90;
  if (!deleting && c === word.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && c === 0) {
    deleting = false;
    w = (w + 1) % words.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

/* 7. COUNTERS: About ke numbers 0 se upar count hote hain */
const counterIO = new IntersectionObserver((entries, obs) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target,
      to = +el.dataset.to;
    let n = 0;
    const timer = setInterval(() => {
      el.textContent = ++n;
      if (n >= to) clearInterval(timer);
    }, 350);
    obs.unobserve(el);
  });
});
$(".count", true).forEach((el) => counterIO.observe(el));

/* 8. SKILLS FILTER: button ke hisaab se cards dikhao/chhupao */
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  $(".filter", true).forEach((b) => b.classList.toggle("active", b === btn));
  $(".skill", true).forEach((card) => {
    card.classList.toggle(
      "hide",
      btn.dataset.filter !== "all" && card.dataset.cat !== btn.dataset.filter,
    );
  });
});

/* 9. 3D TILT: mouse ke saath project card halka ghoomta hai */
$(".tilt", true).forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => (card.style.transform = ""));
});

/* 10. AVATAR PARALLAX: mouse hilane par hero visual thoda move karta hai */
const visual = $("#heroVisual");
$("#home").addEventListener("mousemove", (e) => {
  const x = (e.clientX / innerWidth - 0.5) * 16,
    y = (e.clientY / innerHeight - 0.5) * 16;
  visual.style.transform = `translate(${x}px, ${y}px)`;
});

/* 11. COPY EMAIL + TOAST message */
const toast = $("#toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
$("#copyBtn").addEventListener("click", () => {
  const email = $("#emailText").textContent;
  if (navigator.clipboard)
    navigator.clipboard.writeText(email).then(
      () => showToast("Email copied!"),
      () => showToast("Copy not allowed here"),
    );
  else showToast("Copy not supported");
});

/* 12. Footer year */
$("#year").textContent = new Date().getFullYear();
