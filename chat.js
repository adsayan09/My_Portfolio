/* Portfolio assistant — scripted, no API key, no network calls.
   Every answer is derived from this site's own data (projects.js) plus the
   profile facts already published on the page. Anything not covered returns a
   "not listed" reply rather than a guess.

   Motion follows the reference widget: the trigger pops in on a delay, the
   panel zooms up from the trigger corner, messages and chips stagger in. */

(function () {
  "use strict";

  // NOTE: read the globals without shadowing them - a local `var DATA`
  // would be hoisted and the lookup would resolve to that undefined local.
  var DATA = typeof PROJECTS !== "undefined" ? PROJECTS : {};
  var ORDER = typeof PROJECT_ORDER !== "undefined" ? PROJECT_ORDER : [];

  var REDUCED =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Touch devices: never steal focus. Autofocusing the composer on open made the
     keyboard jump up and left the browser's own focus ring on the typing area. */
  var TOUCH = !!(
    window.matchMedia &&
    (window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 640px)").matches)
  );

  /* ---------- profile facts, all taken from this site ---------- */

  var PROFILE = {
    name: "Adsayan",
    role: "Software Engineering student working across code, UI/UX and visual design",
    location: "Sri Lanka",
    availability: "Available for internships and remote work",
    email: "pathmasuthanadsayan@gmail.com",
    education: "Higher Diploma (HD) in Computing and Software Engineering at ICBT Campus",
    objective: "Securing a Software Engineering or Creative Tech internship",
    design: "22 works: 6 packaging labels, 7 promotional posters and 9 apparel prints"
  };

  var FALLBACK =
    "I don't have that listed on this site. I can tell you about my projects, " +
    "skills, education, design work, or how to contact me — try one of the suggestions.";

  /* ---------- helpers ---------- */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripEntities(value) {
    return String(value == null ? "" : value)
      .replace(/&mdash;/g, " - ")
      .replace(/&middot;/g, " - ")
      .replace(/&amp;/g, "&")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function project(slug) {
    return DATA[slug] || null;
  }

  function projectLink(slug) {
    return 'project.html?p=' + encodeURIComponent(slug);
  }

  function metaValue(p, label) {
    var list = p.meta || [];
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].label).toUpperCase() === label) return stripEntities(list[i].value);
    }
    return "";
  }

  function trim(text, max) {
    var clean = stripEntities(text);
    if (clean.length <= max) return clean;
    return clean.slice(0, max).replace(/\s+\S*$/, "") + "...";
  }

  /* ---------- answer builders ---------- */

  function answerAbout() {
    var count = ORDER.length || Object.keys(DATA).length;
    return (
      "Hi, I'm " + PROFILE.name + ". " + PROFILE.role + ".\n\n" +
      "I'm based in " + PROFILE.location + " and " + PROFILE.availability.toLowerCase() + ". " +
      "I did my " + PROFILE.education + " and I'm working toward " +
      PROFILE.objective.toLowerCase() + ".\n\n" +
      "This site documents " + count + " projects, plus a self-directed design archive of " +
      PROFILE.design + ".\n\nWhat would you like to know?"
    );
  }

  function answerProjects() {
    var lines = ["I have " + ORDER.length + " projects on this site:"];
    ORDER.forEach(function (slug) {
      var p = project(slug);
      if (!p) return;
      lines.push("<strong>" + esc(p.title) + "</strong> — " + esc(trim(p.category, 70)));
    });
    lines.push("\nAsk me about any one of them and I'll explain it in more detail.");
    return lines.join("\n\n");
  }

  function answerProject(p) {
    var out = [
      "<strong>" + esc(p.title) + "</strong>\n" + esc(stripEntities(p.category)),
      trim(p.summary, 420)
    ];
    var stack = metaValue(p, "STACK");
    if (stack) out.push("<strong>Stack:</strong> " + esc(stack));
    var status = metaValue(p, "STATUS");
    if (status) out.push("<strong>Status:</strong> " + esc(status));
    if (p.stats && p.stats.length) {
      out.push(
        "<strong>At a glance:</strong> " +
          esc(
            p.stats
              .map(function (s) {
                return s.value + " " + stripEntities(s.label);
              })
              .join(" / ")
          )
      );
    }
    out.push("<a href='" + projectLink(p.slug) + "'>Read the full case study</a>");
    return out.join("\n\n");
  }

  function answerSkills() {
    var seen = [];
    ORDER.forEach(function (slug) {
      var p = project(slug);
      if (!p || !p.tags) return;
      p.tags.forEach(function (t) {
        var clean = stripEntities(t);
        if (clean && seen.indexOf(clean) === -1) seen.push(clean);
      });
    });
    return (
      "Across my projects I work with:\n\n" +
      seen.map(function (t) {
        return "• " + esc(t);
      }).join("\n") +
      "\n\nOn the design side I also do packaging labels, posters and apparel prints."
    );
  }

  function answerDesign() {
    return (
      "My self-directed design archive holds " + PROFILE.design + ".\n\n" +
      "It's split into three case studies on this site:\n" +
      "• <a href='" + projectLink("packaging-labels") + "'>Product Labels</a> — container and jar label artwork\n" +
      "• <a href='" + projectLink("promotional-posters") + "'>Promotional Posters</a> — product, event and institutional campaigns\n" +
      "• <a href='" + projectLink("apparel-prints") + "'>Apparel Prints</a> — streetwear and institutional prints"
    );
  }

  function answerEducation() {
    return (
      PROFILE.education + ".\n\n" +
      "That covers computational logic, object-oriented programming, algorithms and core web markup, " +
      "followed by full-stack and mobile practicum work. I'm currently focused on " +
      PROFILE.objective.toLowerCase() + "."
    );
  }

  function answerJourney() {
    return (
      "Roughly where I've been:\n\n" +
      "• <strong>2024</strong> — started the Higher Diploma in Computing and Software Engineering\n" +
      "• <strong>2025</strong> — full-stack and mobile practicum: client-server platforms, relational schema design, REST APIs\n" +
      "• <strong>2026</strong> — design systems and UI work alongside engineering\n" +
      "• <strong>Now</strong> — " + PROFILE.objective.toLowerCase()
    );
  }

  function answerContact() {
    return (
      "You can reach me at <a href='mailto:" + PROFILE.email + "'>" + PROFILE.email + "</a>.\n\n" +
      "I'm based in " + PROFILE.location + " and " + PROFILE.availability.toLowerCase() + ", " +
      "so remote collaboration works. I can send a CV over email whenever you like."
    );
  }

  function answerLocation() {
    return (
      "I'm based in " + PROFILE.location + " and open to remote work.\n\n" +
      "I'm " + PROFILE.availability.toLowerCase() + "."
    );
  }

  function answerWhy() {
    return (
      "Two things stand out:\n\n" +
      "1. <strong>I work both sides of the line.</strong> " + PROFILE.role + ", so I can design an interface and build it without handing off.\n" +
      "2. <strong>I document decisions, not just output.</strong> Each project explains the reasoning behind the architecture and the security model, not just the screenshots."
    );
  }

  function answerAvailability() {
    return (
      PROFILE.availability + ".\n\n" +
      "My focus right now is " + PROFILE.objective.toLowerCase() + ". " +
      "The quickest route is email: <a href='mailto:" + PROFILE.email + "'>" + PROFILE.email + "</a>."
    );
  }

  /* ---------- intent matching ---------- */

  var INTENTS = [
    { id: "greeting", re: /^(hi|hey|hello|yo|hola|good (morning|afternoon|evening))\b/i, run: answerAbout },
    { id: "about", re: /\b(who are you|who is adsayan|about (you|yourself|me|myself)|tell me about (you|yourself|me|myself)|introduce yourself|introduce|your name|what do you do)\b/i, run: answerAbout },
    { id: "projects", re: /\b(projects?|portfolio|your work|case stud(y|ies)|what have you built|what did you build)\b/i, run: answerProjects },
    { id: "skills", re: /\b(skills?|stack|technolog\w+|tools?|what can you do|tech( stack)?|languages?|frameworks?)\b/i, run: answerSkills },
    { id: "design", re: /\b(graphic design|design work|poster|posters|labels?|packaging|apparel|prints?|tshirt|t-?shirt|typograph\w+|illustrat\w+)\b/i, run: answerDesign },
    { id: "education", re: /\b(education|stud(y|ied|ying)|school|college|university|icbt|qualification|course|degree|diploma)\b/i, run: answerEducation },
    { id: "journey", re: /\b(journey|timeline|experience|background|how did you start|how long)\b/i, run: answerJourney },
    { id: "why", re: /\b(why (should i |i |we )?(hire|choose|pick) you|what makes you different|your strength)\b/i, run: answerWhy },
    { id: "contact", re: /\b(contact|email|reach out|get in touch|hire|message you|resume|cv)\b/i, run: answerContact },
    { id: "location", re: /\b(location|based|where are you|sri lanka|timezone|time zone|remote)\b/i, run: answerLocation },
    { id: "availability", re: /\b(available|availability|internship|opportunity|looking for|freelance)\b/i, run: answerAvailability },
  ];

  var CHIPS = {
    projects: { t: "My projects", l: "See what I built", s: "What projects have you built?" },
    about: { t: "About me", l: "Who I am", s: "tell me about yourself" },
    skills: { t: "My skills", l: "My stack and tools", s: "What are your skills?" },
    design: { t: "My design work", l: "Graphics and prints", s: "What is your graphic design work?" },
    education: { t: "My education", l: "Where I studied", s: "Where did you study?" },
    contact: { t: "Contact me", l: "How to reach me", s: "How can I contact you?" },
    location: { t: "Where I'm based", l: "My location", s: "Where are you based?" },
    availability: { t: "My availability", l: "Internships and remote", s: "Are you available for internships?" },
    journey: { t: "My journey", l: "How I got here", s: "What is your journey so far?" },
    shima: { t: "My SHIMA RMS project", l: "Recruitment system", s: "Tell me about Shima RMS" },
    apparel: { t: "My apparel prints", l: "Nine garment prints", s: "Tell me about apparel prints" }
  };

  var FOLLOWUPS = {
    greeting: [CHIPS.projects, CHIPS.about, CHIPS.contact],
    about: [CHIPS.projects, CHIPS.skills, CHIPS.location],
    projects: [CHIPS.shima, CHIPS.design, CHIPS.skills],
    skills: [CHIPS.projects, CHIPS.design, CHIPS.education],
    design: [CHIPS.apparel, CHIPS.projects, CHIPS.skills],
    education: [CHIPS.journey, CHIPS.skills, CHIPS.projects],
    journey: [CHIPS.projects, CHIPS.education, CHIPS.skills],
    contact: [CHIPS.availability, CHIPS.location, CHIPS.skills],
    location: [CHIPS.availability, CHIPS.contact, CHIPS.projects],
    availability: [CHIPS.contact, CHIPS.skills, CHIPS.projects],
    why: [CHIPS.projects, CHIPS.skills, CHIPS.contact],
    project: [CHIPS.design, CHIPS.skills, CHIPS.contact],
    fallback: [CHIPS.about, CHIPS.projects, CHIPS.skills]
  };

  function matchProject(text) {
    var q = text.toLowerCase();
    var best = null;
    ORDER.forEach(function (slug) {
      var p = project(slug);
      if (!p) return;
      var words = String(p.title).toLowerCase().split(/[^a-z0-9]+/);
      var hits = words.filter(function (word) {
        return word.length > 2 && q.indexOf(word) !== -1;
      }).length;
      if (hits && (!best || hits > best.hits)) best = { slug: slug, hits: hits };
    });
    return best ? project(best.slug) : null;
  }

  function reply(text) {
    var q = String(text || "").trim();
    if (!q) return { html: "Ask me anything about my work.", id: "greeting" };

    var named = matchProject(q);
    var generic = /\b(tell me about|what is|what's|describe|explain|walk me through)\b/i.test(q);

    if (named && (generic || named.hits >= 2 || q.length < 40)) {
      return { html: answerProject(named), id: "project" };
    }

    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].re.test(q)) return { html: INTENTS[i].run(), id: INTENTS[i].id };
    }

    if (named) return { html: answerProject(named), id: "project" };

    return { html: FALLBACK, id: "fallback" };
  }

  /* ---------- markup ---------- */

  var ICONS = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/></svg>',
    collapse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>'
  };

  function build() {
    var root = document.createElement("div");
    root.className = "chat-root";

    var fab = document.createElement("button");
    fab.type = "button";
    fab.id = "chat-fab";
    fab.className = "chat-fab";
    fab.setAttribute("aria-haspopup", "dialog");
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "chat-panel");
    fab.setAttribute("aria-label", "Open Assistant");
    fab.dataset.state = "closed";
    fab.innerHTML =
      '<span class="chat-robot" aria-hidden="true">' +
      '<span class="chat-robot-head">' +
      '<span class="chat-eye"><span class="chat-pupil"><i class="chat-glint"></i></span></span>' +
      '<span class="chat-eye"><span class="chat-pupil"><i class="chat-glint"></i></span></span>' +
      "</span></span>";

    var panel = document.createElement("div");
    panel.id = "chat-panel";
    panel.className = "chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Assistant");
    panel.dataset.state = "closed";

    panel.innerHTML =
      '<header class="chat-header">' +
      '<div class="chat-header-title">' + ICONS.spark +
      '<h5>Assistant <span class="chat-status" data-role="status">answers about ' + esc(PROFILE.name) + "</span></h5>" +
      "</div>" +
      '<div class="chat-header-actions">' +
      '<button type="button" class="chat-icon-btn" data-act="reset" aria-label="Reset chatbot">' + ICONS.reset + "</button>" +
      '<button type="button" class="chat-icon-btn chat-expand-btn" data-act="expand" aria-label="Expand chatbot">' + ICONS.expand + "</button>" +
      '<button type="button" class="chat-icon-btn" data-act="close" aria-label="Close chatbot">' + ICONS.close + "</button>" +
      "</div>" +
      "</header>" +
      '<div class="chat-thread" data-role="thread" tabindex="-1"></div>' +
      '<div class="chat-composer">' +
      '<div class="chat-chips" data-role="chips"></div>' +
      '<form class="chat-form" data-role="form">' +
      '<label class="chat-sr-only" for="chat-input">Message input</label>' +
      '<textarea class="chat-input" id="chat-input" rows="1" maxlength="400" ' +
      'placeholder="Ask me about my work..." spellcheck="false"></textarea>' +
      '<button type="submit" class="chat-send" aria-label="Send message">' + ICONS.send + "</button>" +
      "</form>" +
      "</div>";

    root.appendChild(fab);
    root.appendChild(panel);
    document.body.appendChild(root);

    return { root: root, fab: fab, panel: panel };
  }

  /* ---------- behaviour ---------- */

  /* Each chip: t = topic (what you read), l = one-line description,
     s = the question actually sent to reply(). */
  var WELCOME_CHIPS = [
    { t: "About me", l: "Who I am", s: "tell me about yourself" },
    { t: "My projects", l: "See what I built", s: "What projects have you built?" },
    { t: "My skills", l: "My stack and tools", s: "What are your skills?" },
    { t: "My design work", l: "Graphics and prints", s: "What is your graphic design work?" },
    { t: "Contact me", l: "How to reach me", s: "How can I contact you?" }
  ];

  function init() {
    var els = build();
    var fab = els.fab;
    var panel = els.panel;
    var thread = panel.querySelector('[data-role="thread"]');
    var chips = panel.querySelector('[data-role="chips"]');
    var form = panel.querySelector('[data-role="form"]');
    var input = panel.querySelector('[data-role="input"], .chat-input');
    var sendBtn = form.querySelector(".chat-send");
    var status = panel.querySelector('[data-role="status"]');
    var expandBtn = panel.querySelector('[data-act="expand"]');
    var pupils = fab.querySelectorAll(".chat-pupil");
    var eyes = fab.querySelectorAll(".chat-eye");
    var busy = false;
    var lastId = "greeting";

    function scrollDown() {
      thread.scrollTop = thread.scrollHeight;
    }

    function setStatus(text, thinking) {
      status.textContent = text;
      status.classList.toggle("is-thinking", !!thinking);
    }

    function renderChips(list) {
      chips.innerHTML = "";
      list.forEach(function (c, i) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chat-chip";
        chip.style.setProperty("--i", String(i));
        chip.dataset.send = c.s;
        var title = document.createElement("span");
        title.className = "chat-chip-title";
        title.textContent = c.t;
        var label = document.createElement("span");
        label.className = "chat-chip-label";
        label.textContent = c.l;
        chip.appendChild(title);
        chip.appendChild(label);
        chips.appendChild(chip);
      });
    }

    function renderWelcome() {
      thread.innerHTML =
        '<div class="chat-welcome">' +
        "<h1>Hello there! <span class='chat-wave'>&#128075;</span></h1>" +
        "<p>How can I help you today?</p>" +
        "</div>";
      renderChips(WELCOME_CHIPS);
      scrollDown();
    }

    function addMessage(role, html) {
      var wrap = document.createElement("div");
      wrap.className = "chat-msg";
      wrap.dataset.role = role;
      var bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = html;
      wrap.appendChild(bubble);
      thread.appendChild(wrap);
      scrollDown();
      return wrap;
    }

    function focusComposer() {
      if (!TOUCH) input.focus({ preventScroll: true });
    }

    function ask(text) {
      if (busy) return;
      var clean = String(text || "").trim();
      if (!clean) return;

      addMessage("user", esc(clean));
      input.value = "";
      input.style.height = "auto";
      sendBtn.disabled = true;
      busy = true;
      chips.innerHTML = "";
      setStatus("is thinking...", true);

      var result;
      try {
        result = reply(clean);
      } catch (err) {
        result = { html: FALLBACK, id: "fallback" };
      }

      var delay = REDUCED ? 0 : 420 + Math.random() * 260;
      window.setTimeout(function () {
        addMessage("assistant", result.html);
        lastId = result.id;
        setStatus("answers about " + PROFILE.name, false);
        renderChips(FOLLOWUPS[result.id] || WELCOME_CHIPS.slice(0, 3));
        sendBtn.disabled = false;
        busy = false;
        focusComposer();
      }, delay);
    }

    function open() {
      if (panel.dataset.state === "open") return;
      panel.dataset.state = "open";
      fab.dataset.state = "open";
      fab.setAttribute("aria-expanded", "true");
      fab.setAttribute("aria-label", "Close Assistant");
      document.body.classList.add("chat-locked");
      if (!thread.childElementCount) renderWelcome();
      window.setTimeout(function () {
        scrollDown();
        focusComposer();
      }, REDUCED ? 0 : 60);
    }

    function close() {
      if (panel.dataset.state !== "open") return;
      panel.dataset.state = "closed";
      fab.dataset.state = "closed";
      fab.setAttribute("aria-expanded", "false");
      fab.setAttribute("aria-label", "Open Assistant");
      document.body.classList.remove("chat-locked");
      fab.focus({ preventScroll: true });
    }

    fab.addEventListener("click", function () {
      if (panel.dataset.state === "open") close();
      else open();
    });

    panel.addEventListener("click", function (event) {
      var act = event.target.closest("[data-act]");
      if (act) {
        var what = act.dataset.act;
        if (what === "close") close();
        if (what === "reset") {
          thread.innerHTML = "";
          renderWelcome();
          focusComposer();
        }
        if (what === "expand") {
          var on = panel.getAttribute("data-expanded") !== "true";
          panel.setAttribute("data-expanded", String(on));
          expandBtn.setAttribute(
            "aria-label",
            on ? "Collapse chatbot" : "Expand chatbot"
          );
          expandBtn.innerHTML = on ? ICONS.collapse : ICONS.expand;
        }
        return;
      }
      var chip = event.target.closest(".chat-chip");
      if (chip) ask(chip.dataset.send || chip.textContent);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      ask(input.value);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        ask(input.value);
      }
    });

    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 112) + "px";
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.dataset.state === "open") {
        event.preventDefault();
        close();
      }
    });

    /* the full-screen mobile nav drawer sits below this widget in z-order, so
       step aside while it is open */
    var drawer = document.getElementById("mobile-drawer");
    if (drawer && window.MutationObserver) {
      var drawerOpen = drawer.getAttribute("aria-hidden") === "false";
      var applyDrawer = function () {
        var open = drawer.getAttribute("aria-hidden") === "false";
        if (open === drawerOpen) return;
        drawerOpen = open;
        els.root.classList.toggle("is-drawer-open", open);
        if (open && panel.dataset.state === "open") close();
      };
      new MutationObserver(applyDrawer).observe(drawer, {
        attributes: true,
        attributeFilter: ["aria-hidden"]
      });
    }

    /* robot blinks on its own, pupils follow the pointer */
    (function blink() {
      var wait = 2500 + Math.random() * 2500;
      window.setTimeout(function () {
        eyes.forEach(function (eye) {
          eye.classList.add("is-blinking");
        });
        window.setTimeout(function () {
          eyes.forEach(function (eye) {
            eye.classList.remove("is-blinking");
          });
          blink();
        }, REDUCED ? 0 : 120);
      }, wait);
    })();

    document.addEventListener(
      "pointermove",
      function (event) {
        var box = fab.getBoundingClientRect();
        var cx = box.left + box.width / 2;
        var cy = box.top + box.height / 2;
        var dx = event.clientX - cx;
        var dy = event.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var cap = Math.min(dist, Math.min(4, box.width * 0.2));
        if (dist > 0) {
          var nx = (dx / dist) * cap;
          var ny = (dy / dist) * cap;
          pupils.forEach(function (p) {
            p.style.transform = "translate(" + nx.toFixed(2) + "px," + ny.toFixed(2) + "px)";
          });
        }
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
