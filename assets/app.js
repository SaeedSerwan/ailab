(function () {
  "use strict";
  const { github: gh, labs } = window.AILAB;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- small storage helpers (storage can be unavailable) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };

  // ---------- links ----------
  const nbPath = (f) => `notebooks/${f}`;
  const blob = (f) => `https://github.com/${gh.user}/${gh.repo}/blob/${gh.branch}/${nbPath(f)}`;
  const PLATFORMS = {
    kaggle: { name: "Kaggle", url: (l) => l.kaggleUrl || `https://www.kaggle.com/kernels/welcome?src=${blob(l.file)}` },
    colab: { name: "Colab", url: (l) => `https://colab.research.google.com/github/${gh.user}/${gh.repo}/blob/${gh.branch}/${nbPath(l.file)}` },
  };
  document.getElementById("repo-link").href = `https://github.com/${gh.user}/${gh.repo}`;

  // ---------- platform switch ----------
  let platform = store.get("ailab-platform", "kaggle");
  if (!PLATFORMS[platform]) platform = "kaggle";
  const switchBtns = [...document.querySelectorAll(".switch button")];

  function setPlatform(p) {
    platform = p;
    store.set("ailab-platform", p);
    switchBtns.forEach((b) => {
      const on = b.dataset.platform === p;
      b.setAttribute("aria-checked", on);
      b.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll(".setup").forEach((el) => { el.hidden = el.dataset.for !== p; });
    const other = p === "kaggle" ? "colab" : "kaggle";
    labs.forEach((l, i) => {
      const open = document.getElementById(`open-${i}`);
      open.href = PLATFORMS[p].url(l);
      open.textContent = `Open in ${PLATFORMS[p].name}`;
      const alt = document.getElementById(`alt-${i}`);
      alt.href = PLATFORMS[other].url(l);
      alt.textContent = `Open in ${PLATFORMS[other].name} instead`;
    });
  }
  switchBtns.forEach((b, i) => {
    b.addEventListener("click", () => setPlatform(b.dataset.platform));
    b.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const next = switchBtns[(i + 1) % switchBtns.length];
      setPlatform(next.dataset.platform); next.focus(); e.preventDefault();
    });
  });

  // ---------- lab list ----------
  const list = document.getElementById("lab-list");
  const done = new Set(store.get("ailab-done", []));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  list.innerHTML = labs.map((l, i) => `
    <li class="lab${done.has(l.file) ? " done" : ""}" id="lab-${i}">
      <div class="lab-row">
        <button type="button" class="lab-toggle" aria-expanded="false" aria-controls="detail-${i}">
          <span class="t">${esc(l.title)}</span>
          <span class="s">${esc(l.summary)}</span>
          <span class="m">${esc(l.data)}, about ${l.minutes} minutes, ${l.gpu ? '<span class="gpu">needs a GPU</span>' : "runs on a CPU"}</span>
        </button>
        <a class="open" id="open-${i}" target="_blank" rel="noopener"></a>
      </div>
      <div class="lab-detail" id="detail-${i}" hidden>
        <h3>What you'll learn</h3>
        <ul class="learn">${l.learn.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="actions">
          <a id="alt-${i}" target="_blank" rel="noopener"></a>
          <a href="${nbPath(l.file)}" download="${esc(l.file)}">Download the notebook</a>
          <a href="${blob(l.file)}" target="_blank" rel="noopener">View on GitHub</a>
          <label><input type="checkbox" data-file="${esc(l.file)}"${done.has(l.file) ? " checked" : ""}> I've finished this lab</label>
        </div>
        <div class="nb" tabindex="0" aria-label="Notebook preview"><p class="nb-loading">Loading the notebook preview…</p></div>
      </div>
    </li>`).join("");

  function updateProgress() {
    document.getElementById("progress").textContent = `${done.size} of ${labs.length} finished`;
  }
  updateProgress();

  list.addEventListener("change", (e) => {
    const box = e.target.closest("input[data-file]");
    if (!box) return;
    box.checked ? done.add(box.dataset.file) : done.delete(box.dataset.file);
    box.closest(".lab").classList.toggle("done", box.checked);
    store.set("ailab-done", [...done]);
    updateProgress();
  });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".lab-toggle");
    if (!btn) return;
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", open);
    const detail = document.getElementById(btn.getAttribute("aria-controls"));
    detail.hidden = !open;
    if (open && !detail.dataset.loaded) {
      detail.dataset.loaded = "1";
      loadPreview(labs[+detail.id.split("-")[1]], detail.querySelector(".nb"));
    }
  });

  setPlatform(platform);

  // ---------- notebook preview ----------
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function markdown(src) {
    const out = []; let para = [], listType = null;
    const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
    const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
    for (let line of src.split("\n")) {
      line = line.replace(/^>\s?/, "");
      let m;
      if (!line.trim()) { flushPara(); closeList(); continue; }
      if ((m = line.match(/^(#{1,6})\s+(.*)/))) {
        flushPara(); closeList();
        const lv = Math.min(m[1].length, 3);
        out.push(`<h${lv}>${inline(m[2])}</h${lv}>`); continue;
      }
      if ((m = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(?:\[[ x]\]\s*)?(.*)/))) {
        flushPara();
        const t = m[1] ? "ol" : "ul";
        if (listType !== t) { closeList(); out.push(`<${t}>`); listType = t; }
        out.push(`<li>${inline(m[2])}</li>`); continue;
      }
      closeList(); para.push(line.trim());
    }
    flushPara(); closeList();
    return out.join("");
  }

  const PY = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|\b[rfbu]{0,2}"(?:\\.|[^"\\\n])*"|\b[rfbu]{0,2}'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d+\.?\d*(?:e-?\d+)?)\b|\b(def|class|return|import|from|as|for|in|if|elif|else|try|except|with|while|lambda|and|or|not|is|None|True|False|raise|pass|break|continue|yield)\b|\b([A-Za-z_]\w*)(?=\()/g;
  function python(src) {
    let html = "", last = 0, m;
    PY.lastIndex = 0;
    while ((m = PY.exec(src))) {
      html += esc(src.slice(last, m.index));
      const cls = m[1] ? "c" : m[2] ? "str" : m[3] ? "n" : m[4] ? "k" : "f";
      html += `<span class="${cls}">${esc(m[0])}</span>`;
      last = PY.lastIndex;
    }
    return html + esc(src.slice(last));
  }

  async function loadPreview(lab, box) {
    try {
      const res = await fetch(nbPath(lab.file));
      if (!res.ok) throw new Error(res.status);
      const nb = await res.json();
      box.innerHTML = nb.cells.map((c) => {
        const src = Array.isArray(c.source) ? c.source.join("") : c.source;
        return c.cell_type === "code"
          ? `<pre class="code"><code>${python(src)}</code></pre>`
          : `<div class="md">${markdown(src)}</div>`;
      }).join("");
    } catch (err) {
      box.innerHTML = `<p class="nb-loading">The preview couldn't load here. <a href="${blob(lab.file)}" target="_blank" rel="noopener">Read the notebook on GitHub</a> instead.</p>`;
    }
  }

  // ---------- drawing pad ----------
  const N = 28;
  const px = new Float32Array(N * N);
  const pad = document.getElementById("pad");
  const strip = document.getElementById("strip");
  const vec = document.getElementById("vec");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  pad.width = pad.height = 280 * dpr;
  const ctx = pad.getContext("2d");
  const sctx = strip.getContext("2d");
  const INK = [29, 39, 51];

  function render() {
    const W = pad.width, c = W / N;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, W);
    for (let i = 0; i < N * N; i++) {
      if (px[i] > 0) {
        ctx.fillStyle = `rgba(${INK.join(",")},${px[i]})`;
        ctx.fillRect((i % N) * c, Math.floor(i / N) * c, c, c);
      }
    }
    ctx.strokeStyle = "rgba(95,107,120,.18)"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 1; k < N; k++) {
      const p = Math.round(k * c) + 0.5;
      ctx.moveTo(p, 0); ctx.lineTo(p, W); ctx.moveTo(0, p); ctx.lineTo(W, p);
    }
    ctx.stroke();

    const img = sctx.createImageData(N * N, 1);
    for (let i = 0; i < N * N; i++) {
      const v = px[i];
      for (let ch = 0; ch < 3; ch++) img.data[i * 4 + ch] = Math.round(255 + (INK[ch] - 255) * v);
      img.data[i * 4 + 3] = 255;
    }
    sctx.putImageData(img, 0, 0);

    // compact text view: runs of zeros are collapsed
    const parts = []; let zeros = 0, shown = 0, nonzero = 0;
    for (let i = 0; i < N * N; i++) {
      if (px[i] < 0.005) { zeros++; continue; }
      nonzero++;
      if (shown >= 18) continue;
      if (zeros) { parts.push(zeros > 1 ? `0 ×${zeros}` : "0"); zeros = 0; }
      parts.push(`<b>${px[i].toFixed(2)}</b>`); shown++;
    }
    if (shown >= 18 && nonzero > shown) parts.push("…");
    else if (zeros) parts.push(zeros > 1 ? `0 ×${zeros}` : "0");
    vec.innerHTML = `x.shape = (784,)    ${nonzero} of 784 pixels are inked\nx = [${parts.join(", ")}]`;
  }

  function stamp(x, y) {           // x, y in cell units
    for (let r = Math.floor(y - 2); r <= Math.ceil(y + 2); r++) {
      for (let col = Math.floor(x - 2); col <= Math.ceil(x + 2); col++) {
        if (r < 0 || r >= N || col < 0 || col >= N) continue;
        const d = Math.hypot(col + 0.5 - x, r + 0.5 - y);
        const add = Math.max(0, 1 - d / 1.55) * 0.85;
        const i = r * N + col;
        px[i] = Math.min(1, px[i] + add);
      }
    }
  }
  function strokeTo(a, b) {
    const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.35));
    for (let s = 1; s <= steps; s++) stamp(a[0] + (b[0] - a[0]) * s / steps, a[1] + (b[1] - a[1]) * s / steps);
  }

  let drawing = false, last = null, demo = null;
  const cellAt = (e) => {
    const r = pad.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * N, (e.clientY - r.top) / r.height * N];
  };
  pad.addEventListener("pointerdown", (e) => {
    if (demo) { cancelAnimationFrame(demo); demo = null; px.fill(0); }
    drawing = true; last = cellAt(e); stamp(...last); render();
    pad.setPointerCapture(e.pointerId);
  });
  pad.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = cellAt(e); strokeTo(last, p); last = p; render();
  });
  ["pointerup", "pointercancel"].forEach((t) => pad.addEventListener(t, () => { drawing = false; }));
  document.getElementById("pad-clear").addEventListener("click", () => {
    if (demo) { cancelAnimationFrame(demo); demo = null; }
    px.fill(0); render();
  });

  // One orchestrated moment: the page writes a "2" when it loads.
  const TWO = [[8.6, 10.2], [9.8, 7.6], [12.4, 6.3], [15.6, 6.4], [18.1, 8.2], [18.6, 11], [17, 13.9], [14.2, 16.6], [11.2, 19.1], [8.8, 21.2], [12.5, 21.1], [16.5, 21], [19.8, 21]];
  function drawTwo() {
    const segs = TWO.slice(1).map((p, i) => [TWO[i], p]);
    if (reduceMotion) { segs.forEach(([a, b]) => strokeTo(a, b)); render(); return; }
    let k = 0, t0 = null;
    const per = 70;
    const tick = (t) => {
      if (t0 === null) t0 = t;
      while (k < segs.length && t - t0 >= (k + 1) * per) { strokeTo(...segs[k]); k++; }
      render();
      if (k < segs.length) demo = requestAnimationFrame(tick); else demo = null;
    };
    stamp(...TWO[0]);
    demo = requestAnimationFrame(tick);
  }
  render();
  drawTwo();
})();
