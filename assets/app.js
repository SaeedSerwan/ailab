(function () {
  const { github: gh, labs } = window.AILAB;
  const path = (f) => `notebooks/${f}`;
  const blob = (f) => `https://github.com/${gh.user}/${gh.repo}/blob/${gh.branch}/${path(f)}`;
  const kaggleImport = (f) => `https://www.kaggle.com/kernels/welcome?src=${blob(f)}`;
  const colab = (f) => `https://colab.research.google.com/github/${gh.user}/${gh.repo}/blob/${gh.branch}/${path(f)}`;
  const raw = (f) => `https://raw.githubusercontent.com/${gh.user}/${gh.repo}/${gh.branch}/${path(f)}`;

  const grid = document.getElementById("lab-grid");
  const filters = document.getElementById("filters");
  let active = "All";

  const levels = ["All", ...new Set(labs.map((l) => l.level))];
  levels.forEach((lv) => {
    const b = document.createElement("button");
    b.textContent = lv;
    b.className = "chip" + (lv === active ? " on" : "");
    b.onclick = () => { active = lv; [...filters.children].forEach((c) => c.classList.toggle("on", c === b)); render(); };
    filters.appendChild(b);
  });

  function card(l) {
    const primary = l.kaggleUrl
      ? `<a class="btn primary" href="${l.kaggleUrl}" target="_blank" rel="noopener">Copy &amp; Edit on Kaggle</a>`
      : `<a class="btn primary" href="${kaggleImport(l.file)}" target="_blank" rel="noopener">Open in Kaggle</a>`;
    return `
      <article class="lab">
        <header>
          <span class="num">${l.id}</span>
          <span class="tag accel-${l.accel.toLowerCase()}">${l.accel}</span>
        </header>
        <h3>${l.title}</h3>
        <p>${l.blurb}</p>
        <dl>
          <div><dt>Level</dt><dd>${l.level}</dd></div>
          <div><dt>Time</dt><dd>~${l.minutes} min</dd></div>
          <div><dt>Data</dt><dd>${l.dataset}</dd></div>
        </dl>
        <ul class="topics">${l.topics.map((t) => `<li>${t}</li>`).join("")}</ul>
        <div class="actions">
          ${primary}
          <a class="btn" href="${blob(l.file)}" target="_blank" rel="noopener">View code</a>
          <a class="btn ghost" href="${raw(l.file)}" download="${l.file}">.ipynb</a>
          <a class="btn ghost" href="${colab(l.file)}" target="_blank" rel="noopener" title="Backup option">Colab</a>
        </div>
      </article>`;
  }

  function render() {
    grid.innerHTML = labs.filter((l) => active === "All" || l.level === active).map(card).join("");
  }
  render();

  document.getElementById("repo-link").href = `https://github.com/${gh.user}/${gh.repo}`;
  document.getElementById("lab-count").textContent = labs.length;
})();
