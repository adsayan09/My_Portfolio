const esc = (s) =>
  String(s)
    .replace(/&(?!(?:[a-zA-Z]+|#\d+);)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const TAG_PILL =
  'px-3 py-1.5 rounded-full bg-white dark:bg-[#18191E] border border-[#E5E5E5] dark:border-[#24252B] text-xs font-mono text-[#111111] dark:text-white/90';
const META_LABEL =
  'font-mono text-[11px] uppercase tracking-[0.18em] text-[#77736C] dark:text-[#8E919A]';
const META_VALUE =
  'font-headline-sm text-sm font-semibold text-[#111111] dark:text-white mt-1 block';
const CARD =
  'rounded-2xl border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#121317] p-6';
const PROSE =
  'text-[#77736C] dark:text-[#8E919A] font-body-md text-base leading-relaxed prose';

function sectionHeading(p, s) {
  return `
    <div class="lg:col-span-4">
      <div class="flex items-center gap-3 font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-3">
        <span>${s.num}</span><span class="text-[#77736C] dark:text-[#8E919A]">//</span><span>${p.eyebrow[0]}</span>
      </div>
      <h2 id="${s.id}" class="font-headline-sm text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-white">${s.heading}</h2>
    </div>`;
}

function buildSection(p, s) {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      ${sectionHeading(p, s)}
      <div class="lg:col-span-8 flex flex-col gap-6 ${PROSE}">
        ${s.body.map((para) => `<p>${para}</p>`).join("")}
      </div>
    </div>`;
}

function buildComparison(p) {
  const c = p.comparison;
  const head = c.head
    .map((h, i) => `<th class="text-left font-mono text-[11px] uppercase tracking-[0.14em] text-[#77736C] dark:text-[#8E919A] font-normal ${i ? "text-center" : ""}">${h}</th>`)
    .join("");
  const body = c.rows
    .map(
      (r) =>
        `<tr class="border-t border-[#E5E5E5] dark:border-[#24252B]">
          <td class="py-3 pr-4 font-headline-sm text-sm font-semibold text-[#111111] dark:text-white">${r[0]}</td>
          ${r
            .slice(1)
            .map((c2) => `<td class="py-3 px-2 text-center text-sm">${c2}</td>`)
            .join("")}
        </tr>`
    )
    .join("");
  return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
        <h3 class="font-headline-sm text-xl font-bold uppercase text-[#111111] dark:text-white">${c.heading || `${p.eyebrow[0]} Benchmark`}</h3>
        <p class="font-mono text-xs text-[#77736C] dark:text-[#8E919A]">${c.caption}</p>
      </div>
      <div class="overflow-x-auto rounded-2xl border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#121317]">
        <table class="w-full min-w-[560px]">
          <thead><tr class="bg-[#F5F5F0] dark:bg-[#18191E]">${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
}

function buildRoles(p) {
  const g = p.featureGrid;
  return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <h3 class="font-headline-sm text-xl font-bold uppercase text-[#111111] dark:text-white mb-8">${g.heading}</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${g.groups
          .map(
            (grp) => `
          <div class="${CARD}">
            <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[#E5E5E5] dark:border-[#24252B]">
              <span class="w-1.5 h-1.5 rounded-full bg-accent-glow"></span>
              <h4 class="font-headline-sm text-sm uppercase tracking-wider font-bold text-[#111111] dark:text-white">${grp.role}</h4>
            </div>
            <ul class="flex flex-col gap-3">
              ${grp.points
                .map(
                  (pt) => `<li class="flex gap-2.5 text-sm ${PROSE}">
                <span class="text-[#2E7D32] dark:text-[#B5FF6D] shrink-0 font-mono">›</span>
                <span>${pt}</span>
              </li>`
                )
                .join("")}
            </ul>
          </div>`
          )
          .join("")}
      </div>
    </div>`;
}

function buildSecurity(p) {
  return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div class="lg:col-span-4">
          <h3 class="font-headline-sm text-xl font-bold uppercase text-[#111111] dark:text-white">Security</h3>
          <p class="${PROSE} text-sm mt-3">${p.securityNote || "These controls were treated as baseline requirements, not enhancement."}</p>
        </div>
        <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${p.security
            .map(
              (s) => `<div class="${CARD} !p-4 flex items-center gap-3">
            <span class="font-mono text-[#2E7D32] dark:text-[#B5FF6D] text-xs">✓</span>
            <span class="text-sm ${PROSE}">${s}</span>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </div>`;
}

function buildTests(p) {
  const t = p.tests;
  const head = t.head
    .map(
      (h, i) =>
        `<th class="text-left font-mono text-[11px] uppercase tracking-[0.14em] text-[#77736C] dark:text-[#8E919A] font-normal ${i === t.head.length - 1 ? "text-center" : ""}">${h}</th>`
    )
    .join("");
  const body = t.rows
    .map(
      (r) => `<tr class="border-t border-[#E5E5E5] dark:border-[#24252B]">
        <td class="py-3 pr-4 font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D]">${r[0]}</td>
        <td class="py-3 pr-4 font-headline-sm text-sm font-semibold text-[#111111] dark:text-white">${r[1]}</td>
        <td class="py-3 pr-4 text-sm ${PROSE}">${r[2]}</td>
        <td class="py-3 text-center"><span class="px-2.5 py-1 rounded-full bg-accent-glow/15 text-[#2E7D32] dark:text-[#B5FF6D] font-mono text-[11px] uppercase tracking-wider">${r[3]}</span></td>
      </tr>`
    )
    .join("");
  return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-10">
        <div class="lg:col-span-4">
          <h3 class="font-headline-sm text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-white">${t.heading}</h3>
        </div>
        <div class="lg:col-span-8 ${PROSE}"><p>${t.body}</p></div>
      </div>
      <div class="overflow-x-auto rounded-2xl border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#121317]">
        <table class="w-full min-w-[620px]">
          <thead><tr class="bg-[#F5F5F0] dark:bg-[#18191E]">${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
}

function buildRoadmap(p) {
  return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <h3 class="font-headline-sm text-xl font-bold uppercase text-[#111111] dark:text-white mb-8">What&rsquo;s Next</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${p.roadmap
          .map(
            (r) => `<div class="${CARD}">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-accent-glow animate-pulse"></span>
            <h4 class="font-headline-sm text-sm uppercase tracking-wider font-bold text-[#111111] dark:text-white">${r.label}</h4>
          </div>
          <p class="text-sm ${PROSE}">${r.note}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>`;
}

function buildGallery(p) {
  if (!p.gallery || !p.gallery.length) return "";

  const shots = p.gallery;
  const open = Boolean(p.galleryOpen);

  if (open) {
    // Design archives read as a sequence, not as a set of build screenshots:
    // every work is visible on load, one after another, with no toggle.
    return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="flex items-center gap-3 font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-3">
        <span>05</span><span class="text-[#77736C] dark:text-[#8E919A]">//</span><span>${p.galleryKicker || "Archive"}</span>
      </div>

      <div class="max-w-lg">
        <h3 class="font-headline-sm text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-white mb-3">${p.galleryTitle || "Works"}</h3>
        <p class="${PROSE} text-sm">${p.galleryNote || `${shots.length} ${p.galleryNoun || "works"}.`}</p>
      </div>

      <div id="works-panel" class="mt-12 grid grid-cols-1 gap-12">
        ${shots
          .map(
            (s, i) => `<figure class="work-item">
          <div class="rounded-xl overflow-hidden border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#18191E] p-3 sm:p-5">
            <img decoding="async" alt="${s.alt}" class="w-full h-auto max-h-[80vh] object-contain mx-auto" loading="lazy" src="${s.src}">
          </div>
          <div class="mt-4 flex items-baseline gap-3">
            <span class="font-mono text-[11px] text-[#2E7D32] dark:text-[#B5FF6D]">${String(i + 1).padStart(2, "0")}</span>
            <figcaption class="font-mono text-xs text-[#77736C] dark:text-[#8E919A]">${s.caption}</figcaption>
          </div>
        </figure>`
          )
          .join("")}
      </div>
    </div>`;
  }

  return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="flex items-center gap-3 font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-3">
        <span>05</span><span class="text-[#77736C] dark:text-[#8E919A]">//</span><span>Interface</span>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h3 class="font-headline-sm text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-white mb-3">Screens</h3>
          <p class="${PROSE} text-sm max-w-lg">
            ${shots.length} visuals from the delivered build. Images load only when expanded, so they cost nothing on first paint.
          </p>
        </div>
        <button type="button" id="gallery-toggle" aria-expanded="false" aria-controls="gallery-panel"
          class="inline-flex items-center gap-3 self-start sm:self-auto px-6 py-3.5 rounded-full border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#121317] text-[#111111] dark:text-white font-headline-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#EAEAEA] dark:hover:bg-[#18191E] transition-all">
          <span id="gallery-toggle-label">Show ${shots.length} visuals</span>
          <span id="gallery-toggle-icon" class="material-symbols-outlined text-base transition-transform duration-300">keyboard_arrow_down</span>
        </button>
      </div>

      <div id="gallery-panel" aria-hidden="true" inert class="mt-10">
        <div class="gallery-collapser">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${shots
            .map(
              (s, i) => `<figure class="gallery-item" style="transition-delay:${(i * 70 + 90)}ms">
            <div class="rounded-xl overflow-hidden border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#18191E]" style="aspect-ratio:16/10">
              <img decoding="async" alt="${s.alt}" class="w-full h-full object-contain" data-src="${s.src}">
            </div>
            <figcaption class="mt-3 font-mono text-xs text-[#77736C] dark:text-[#8E919A]">${s.caption}</figcaption>
          </figure>`
            )
            .join("")}
          </div>
        </div>
      </div>
    </div>`;
}

function bindGallery() {
  const btn = document.getElementById("gallery-toggle");
  const panel = document.getElementById("gallery-panel");
  if (!btn || !panel) return;

  const label = document.getElementById("gallery-toggle-label");
  const icon = document.getElementById("gallery-toggle-icon");
  const items = Array.from(panel.querySelectorAll(".gallery-item"));
  const total = items.length;
  let loaded = false;
  let collapseTimer = null;

  const markLoaded = (img) => {
    if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
    else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  };

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    clearTimeout(collapseTimer);

    if (!open) {
      if (!loaded) {
        panel.querySelectorAll("img[data-src]").forEach((img) => {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          markLoaded(img);
        });
        loaded = true;
      } else {
        panel.querySelectorAll("img").forEach(markLoaded);
      }

      panel.removeAttribute("inert");
      panel.setAttribute("aria-hidden", "false");
      panel.classList.add("is-open");
      panel.classList.add("is-opening");

      if (window.AOS) window.AOS.refreshHard();
    } else {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      // only block focus once the height has finished collapsing, otherwise
      // the exit animation is cut off
      collapseTimer = setTimeout(() => {
        if (!panel.classList.contains("is-open")) {
          panel.setAttribute("inert", "");
          panel.classList.remove("is-opening");
        }
      }, 660);
    }

    btn.setAttribute("aria-expanded", String(!open));
    if (label) label.textContent = open ? `Show ${total} visuals` : "Hide visuals";
    if (icon) icon.style.transform = open ? "" : "rotate(180deg)";
  });
}

function buildNext(p) {
  const i = PROJECT_ORDER.indexOf(p.slug);
  const nxt = PROJECT_ORDER[(i + 1) % PROJECT_ORDER.length];
  if (!nxt || nxt === p.slug) {
    return `
    <div class="py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p class="font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-2">End of archive</p>
          <h3 class="font-display-xl text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-white">More cases soon</h3>
        </div>
        <a href="index.html#selected-work" class="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-headline-sm text-xs uppercase tracking-wider font-bold hover:bg-accent-glow hover:text-white dark:hover:bg-accent-lime dark:hover:text-black transition-all self-start sm:self-auto">
          <span>Back to Archive</span><span>→</span>
        </a>
      </div>
    </div>`;
  }
  const np = PROJECTS[nxt];
  return `
    <a href="project.html?p=${np.slug}" class="group block py-16 sm:py-20 border-t border-[#E5E5E5] dark:border-[#23252C]" data-aos="fade-up">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p class="font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-2">Next project</p>
          <h3 class="font-display-xl text-3xl sm:text-5xl font-bold uppercase tracking-[-0.03em] text-[#111111] dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-accent-lime dark:hover:text-accent-lime transition-colors">${np.title}</h3>
          <p class="${PROSE} text-sm mt-2">${np.category}</p>
        </div>
        <span class="w-14 h-14 shrink-0 rounded-full border border-[#E5E5E5] dark:border-[#24252B] flex items-center justify-center text-xl group-hover:bg-accent-glow group-hover:border-accent-glow dark:hover:border-accent-lime group-hover:text-white dark:group-hover:bg-accent-lime dark:group-hover:border-accent-lime dark:group-hover:text-black transition-all">→</span>
      </div>
    </a>`;
}

function render(slug) {
  const root = document.getElementById("project-root");
  if (!root) return;

  const p = PROJECTS[slug];
  if (!p) {
    root.innerHTML = `
      <section class="w-full py-32 bg-[#F5F5F0] dark:bg-[#0D0E11]">
        <div class="max-w-[1360px] mx-auto px-6 sm:px-10 text-center">
          <p class="font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-4">404 // Not in archive</p>
          <h1 class="font-display-xl text-5xl sm:text-7xl font-extrabold uppercase tracking-[-0.04em] text-[#111111] dark:text-white mb-8">No such project</h1>
          <a href="index.html" class="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-headline-sm text-xs uppercase tracking-wider font-bold hover:bg-accent-glow hover:text-white dark:hover:bg-accent-lime dark:hover:text-black transition-all">
            <span>←</span><span>Back to Archive</span>
          </a>
        </div>
      </section>`;
    return;
  }

  document.title = `${p.title.replace(/&amp;/g, "&")} — ADSAYAN`;
  const md = document.querySelector('meta[name="description"]');
  const ogd = document.querySelector('meta[property="og:description"]');
  const plain = p.summary.replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
  if (md) md.setAttribute("content", plain);
  if (ogd) ogd.setAttribute("content", plain);

  root.innerHTML = `
    <section class="w-full py-24 sm:py-32 bg-[#F5F5F0] dark:bg-[#0D0E11]">
      <div class="max-w-[1360px] mx-auto px-6 sm:px-10">

        <a href="index.html#selected-work" class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#121317] text-[#111111] dark:text-white font-headline-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#EAEAEA] dark:hover:bg-[#18191E] transition-all mb-14" data-aos="fade-up">
          <span>&larr;</span><span>Back to Archive</span>
        </a>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-14">
          <div class="lg:col-span-7" data-aos="fade-right">
            <div class="flex items-center gap-2 font-mono text-xs text-[#2E7D32] dark:text-[#B5FF6D] mb-4">
              <span>[${p.eyebrow[0]}]</span><span>&bull;</span><span>[${p.eyebrow[1]}]</span>
            </div>
            <h1 class="font-display-xl text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] text-[#111111] dark:text-white leading-[0.92] uppercase mb-6">
              ${p.title}
            </h1>
            <p class="font-headline-sm text-lg sm:text-xl text-[#111111] dark:text-white mb-6">${p.category}</p>
            <p class="font-body-md text-base sm:text-lg text-[#77736C] dark:text-[#8E919A] max-w-2xl leading-relaxed">
              ${p.summary}
            </p>
            <div class="flex flex-wrap gap-2 mt-8">
              ${p.tags.map((t) => `<span class="${TAG_PILL}">${t}</span>`).join("")}
            </div>
          </div>

          <div class="lg:col-span-5" data-aos="fade-left" data-aos-delay="200">
            <dl class="${CARD} !p-0 divide-y divide-[#E5E5E5] dark:divide-[#24252B]">
              ${p.meta
                .map(
                  (m) => `<div class="p-5">
                <dt class="${META_LABEL}">${m.label}</dt>
                <dd class="${META_VALUE}">${m.value}</dd>
              </div>`
                )
                .join("")}
            </dl>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[#E5E5E5] dark:border-[#24252B] bg-[#E5E5E5] dark:bg-[#24252B] mb-20" data-aos="fade-up">
          ${p.stats
            .map(
              (s) => `<div class="bg-white dark:bg-[#121317] p-6 text-center">
            <div class="font-display-xl text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2E7D32] dark:text-[#B5FF6D]">${s.value}</div>
            <div class="font-mono text-[11px] uppercase tracking-[0.16em] text-[#77736C] dark:text-[#8E919A] mt-2">${s.label}</div>
          </div>`
            )
            .join("")}
        </div>

        <figure class="rounded-2xl overflow-hidden border border-[#E5E5E5] dark:border-[#24252B] bg-white dark:bg-[#18191E] w-full mb-4 shadow-xl ${p.hero.constrained ? "flex items-center justify-center p-4 sm:p-6" : ""}" data-aos="fade-up">
          <img alt="${p.hero.alt}" class="object-contain ${p.hero.constrained ? "" : "w-full h-auto"}" style="${p.hero.constrained ? "max-width:100%;max-height:70vh;width:auto;height:auto" : ""}" src="${p.hero.src}">
        </figure>
        <p class="font-mono text-xs text-[#77736C] dark:text-[#8E919A] mb-20">${p.hero.caption || `${p.category} &mdash; primary view`}</p>

        ${p.sections.map((s) => buildSection(p, s)).join("")}
        ${buildComparison(p)}
        ${buildRoles(p)}
        ${buildSecurity(p)}
        ${buildTests(p)}
        ${buildGallery(p)}
        ${buildRoadmap(p)}
        ${buildNext(p)}

      </div>
    </section>`;

  bindGallery();
  markScrollableTables();
  if (window.AOS) window.AOS.refreshHard();
}

// Wide spec tables stay horizontally scrollable inside their wrapper. Without a
// hint, a clipped column on a phone just looks like missing data, so reveal a
// nudge only for the tables that actually overflow.
function markScrollableTables() {
  const HINT = 'scrollable-table';
  document.querySelectorAll("div.overflow-x-auto").forEach((wrap) => {
    const table = wrap.querySelector("table");
    if (!table) return;
    const hint = document.createElement("p");
    hint.className =
      "font-mono text-[11px] uppercase tracking-[0.16em] text-[#77736C] dark:text-[#8E919A] mt-2 md:hidden";
    hint.dataset.tableHint = "true";
    hint.textContent = "Scroll horizontally to see all columns \u2192";
    const sync = () => {
      const overflows = wrap.scrollWidth - wrap.clientWidth > 4;
      hint.style.display = overflows ? "" : "none";
      wrap.dataset.scrollable = String(overflows);
    };
    sync();
    wrap.parentNode.insertBefore(hint, wrap.nextSibling);
    wrap.addEventListener("scroll", sync, { passive: true });
    if (window.ResizeObserver) {
      new ResizeObserver(sync).observe(wrap);
      new ResizeObserver(sync).observe(table);
    }
  });
}

render(new URLSearchParams(location.search).get("p") || PROJECT_ORDER[0]);
