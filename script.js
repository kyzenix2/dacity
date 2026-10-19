/* =====================================================================
   CONFIG — the ONLY place you need to edit to update the site.
   Everything on the page is rendered from this object.

   Link rules:
     ca:        "" or "TBA" -> shows "TBA". Buy and chart links stay
                placeholders until the address is a real contract.
                real address -> buy + DexScreener URLs are generated
                automatically from the chain rules below.
     twitter /
     telegram:  null -> not provided yet: placeholder button shown.
                ""   -> project has none: all its elements are REMOVED.
                "https://..." -> real link used everywhere.
   ===================================================================== */
const CONFIG = {
  name: "Dacity Coin",
  ticker: "Dacity",                   // without "$" (added automatically)
  chain: "ethereum",                  // ethereum|eth|robinhood|bnb|bsc|solana|sol|hyper|arc
  tagline: "Neon nights. Palm trees. On-chain.\nThe city's favorite meme coin.", // max 2 lines (\n = line break)
  bio: "Dacity Coin showed up in a GTA 6 leak — a new-game backdrop with Lucia, and a logo that's a stylized D over a sunset. It lives on Ethereum now: neon nights, palm-lined water, and a city that runs it together.",
  footerTagline: "Neon nights. Palm trees. On-chain. Welcome to Dacity.",
  disclaimerNote: "Dacity Coin is an independent community meme token and is not affiliated with Rockstar Games, Take-Two Interactive or Grand Theft Auto.",
  logo: "assets/logo.webp",           // path or URL to logo/mascot (logo.jpg = original)
  banner: "assets/banner.webp",       // path or URL to hero banner (banner.jpg = original)
  favicon: "assets/favicon.png",      // falls back to logo if empty
  heroLayout: "below",                // "overlap" = logo overlaps banner bottom; "below" = logo sits under banner (use when banner already shows the logo)
  ca: "0x6597b04D1a24A68051Fc19002354457bea38D316",
  twitter: "https://x.com/dacity_X",  // X/Twitter URL (null = placeholder, "" = remove)
  telegram: "",                       // no Telegram — every Telegram element is removed

  // 3 About feature cards — echo the bio
  features: [
    { icon: "🌴", title: "Straight Outta the Leak", text: "Spotted in a GTA 6 leak with Lucia in the background — now living on Ethereum." },
    { icon: "🌆", title: "The Sunset Mark", text: "A stylized D over a neon sunset, ringed in pink above the Miami skyline." },
    { icon: "🤝", title: "Run by the Streets", text: "No suits, no gatekeepers. A city full of holders running it together." },
  ],

  // Theme — sampled from the logo + banner (neon pink ring, violet sky, night)
  theme: {
    accent: "#ff3d9a",        // neon pink: primary buttons, links, active states, copy button, glow
    accent2: "#a98bff",       // violet sky: gradient partner / secondary glow
    bg: "#0e0716",            // deep purple-black night
    surface: "#1a0f26",       // alternating section background
    accentContrast: "#14040e" // text on accent buttons
  },
};

/* =====================================================================
   CHAIN RULES (from SPEC) — buy + chart URLs only when CA is non-empty.
   DexScreener slugs: ethereum, bsc, solana, robinhood, hyperliquid.
   Arc has no slug. Unknown chains: no auto URLs (no guessing).
   ===================================================================== */
const CHAINS = {
  ethereum: {
    aliases: ["ethereum", "eth"], label: "Ethereum", dex: "Uniswap", native: "ETH", wallet: "MetaMask or Rabby",
    buy: (ca) => `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${ca}`, slug: "ethereum",
  },
  robinhood: {
    aliases: ["robinhood", "robinhood chain"], label: "Robinhood", dex: "Uniswap", native: "ETH", wallet: "MetaMask or Rabby",
    buy: (ca) => `https://app.uniswap.org/swap?chain=robinhood&outputCurrency=${ca}`, slug: "robinhood",
  },
  bsc: {
    aliases: ["bnb", "bsc", "bnb chain", "binance smart chain"], label: "BNB Chain", dex: "PancakeSwap", native: "BNB", wallet: "MetaMask or Trust Wallet",
    buy: (ca) => `https://pancakeswap.finance/swap?outputCurrency=${ca}`, slug: "bsc",
  },
  solana: {
    aliases: ["solana", "sol"], label: "Solana", dex: "Pump.fun", native: "SOL", wallet: "Phantom or Solflare",
    buy: (ca) => `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${ca}`, slug: "solana",
  },
  hyper: {
    aliases: ["hyper", "hyperliquid", "hyperevm"], label: "Hyperliquid", dex: "HyperSwap", native: "HYPE", wallet: "MetaMask or Rabby",
    buy: (ca) => `https://app.hyperswap.exchange/#/swap?outputCurrency=${ca}`, slug: "hyperliquid",
  },
  arc: {
    aliases: ["arc"], label: "Arc", dex: "Argus", native: "USDC", wallet: "MetaMask or Rabby",
    buy: (ca) => `https://argus.world/token/${ca}`, slug: null,
  },
};

function resolveChain(input) {
  const key = String(input || "").trim().toLowerCase();
  for (const id in CHAINS) if (CHAINS[id].aliases.includes(key)) return { id, ...CHAINS[id] };
  return { id: null, label: String(input || "").trim() || "TBA", dex: "DEX", native: "the native token", wallet: "a compatible wallet", buy: null, slug: null };
}

/* ---------------- helpers ---------------- */
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hexToRgb = (hex) => {
  let h = String(hex).replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};
const isRealUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u.trim());
const isRealCa = (ca) => {
  const v = String(ca || "").trim();
  return v.length > 0 && v.toUpperCase() !== "TBA";
};

function setText(field, value) { $$(`[data-field="${field}"]`).forEach((el) => (el.textContent = value)); }

let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

function setLink(kind, url, placeholderMsg) {
  $$(`[data-link="${kind}"]`).forEach((a) => {
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.removeAttribute("data-placeholder");
      a.removeAttribute("title");
    } else {
      a.href = "#";
      a.removeAttribute("target");
      a.dataset.placeholder = "true";
      a.dataset.placeholderMsg = placeholderMsg;
      a.title = placeholderMsg;
    }
  });
}

/* ---------------- render ---------------- */
function applyTheme(t) {
  const r = document.documentElement.style;
  r.setProperty("--accent", t.accent);
  r.setProperty("--accent-rgb", hexToRgb(t.accent));
  r.setProperty("--accent2", t.accent2);
  r.setProperty("--accent2-rgb", hexToRgb(t.accent2));
  r.setProperty("--bg", t.bg);
  r.setProperty("--surface", t.surface);
  r.setProperty("--accent-contrast", t.accentContrast);
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
  meta.content = t.bg;
}

function render() {
  const c = CONFIG;
  const chain = resolveChain(c.chain);
  const ticker = "$" + String(c.ticker).replace(/^\$/, "");
  const caRaw = String(c.ca || "").trim();
  const caLive = isRealCa(caRaw);
  const ca = caLive ? caRaw : "";

  applyTheme(c.theme);
  document.getElementById("hero").dataset.layout = c.heroLayout || "overlap";

  // Text
  document.title = `${c.name} (${ticker})`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${c.name} (${ticker}) on ${chain.label}. ${c.bio}`.slice(0, 160));
  setText("name", c.name);
  setText("ticker", ticker);
  setText("chain", chain.label);
  setText("dex", chain.dex);
  setText("bio", c.bio);
  setText("footerTagline", c.footerTagline);
  setText("disclaimerNote", c.disclaimerNote || "");
  setText("ca", ca || "TBA");
  $$('[data-field="tagline"]').forEach((el) => {
    el.innerHTML = String(c.tagline).split("\n").slice(0, 2).map(escapeHTML).join("<br />");
  });

  // Images
  $$('[data-img="logo"]').forEach((img) => (img.src = c.logo));
  $$('[data-img="banner"]').forEach((img) => (img.src = c.banner));
  const fav = document.querySelector("[data-favicon]");
  if (fav) { fav.href = c.favicon || c.logo; fav.type = /\.png$/i.test(fav.href) ? "image/png" : ""; }

  // Features
  document.getElementById("featureGrid").innerHTML = c.features.slice(0, 3).map((f) => `
    <div class="card reveal">
      <div class="card-icon">${escapeHTML(f.icon)}</div>
      <h3 class="mt-5 font-display font-bold text-xl">${escapeHTML(f.title)}</h3>
      <p class="mt-2 text-white/65 leading-relaxed">${escapeHTML(f.text)}</p>
    </div>`).join("");

  // Steps
  const steps = [
    { t: "Create a Wallet", d: `Download ${chain.wallet} from the official app store or website and set it up on ${chain.label}.` },
    { t: `Get ${chain.native}`, d: `Buy ${chain.native} on an exchange and send it to your wallet. You'll swap it for ${ticker}.` },
    { t: `Go to ${chain.dex}`, d: `Open ${chain.dex} using the Buy button on this site and connect your wallet.` },
    { t: `Swap for ${ticker}`, d: `Paste the contract address${ca ? "" : " (TBA)"}, enter your amount and confirm the swap. Welcome aboard!` },
  ];
  document.getElementById("stepGrid").innerHTML = steps.map((s, i) => `
    <div class="card reveal">
      <div class="step-num">0${i + 1}</div>
      <h3 class="mt-4 font-display font-bold text-lg">${escapeHTML(s.t)}</h3>
      <p class="mt-2 text-sm text-white/65 leading-relaxed">${escapeHTML(s.d)}</p>
    </div>`).join("");

  // Buy + chart URLs (only when CA is real)
  const buyUrl = ca && chain.buy ? chain.buy(encodeURIComponent(ca)) : null;
  const chartUrl = ca && chain.slug ? `https://dexscreener.com/${chain.slug}/${encodeURIComponent(ca)}` : null;
  setLink("buy", buyUrl, ca ? `No buy link for ${chain.label} yet` : "Buy link goes live once the contract address is out");
  setLink("chart", chartUrl, ca ? `No DexScreener chart for ${chain.label}` : "Chart goes live once the contract address is out");

  const iframe = document.getElementById("chartIframe");
  const ph = document.getElementById("chartPlaceholder");
  if (chartUrl) {
    iframe.src = `${chartUrl}?embed=1&theme=dark&info=0`;
    iframe.classList.remove("hidden");
    ph.classList.add("hidden");
  } else {
    iframe.removeAttribute("src");
    iframe.classList.add("hidden");
    ph.classList.remove("hidden");
    document.getElementById("chartPlaceholderText").textContent = !ca
      ? "The live chart appears here once the contract address is live."
      : `DexScreener doesn't support ${chain.label} yet — chart unavailable.`;
  }

  // Socials
  handleSocial("twitter", c.twitter, "X link coming soon");
  handleSocial("telegram", c.telegram, "Telegram link coming soon");
}

function handleSocial(kind, value, msg) {
  if (kind === "telegram" && value === "") {
    // No Telegram → delete every telegram element
    $$("[data-telegram]").forEach((el) => el.remove());
    $$(`[data-link="telegram"]`).forEach((el) => el.remove());
    const grid = document.getElementById("communityGrid");
    grid?.classList.remove("md:grid-cols-2");
    grid?.classList.add("max-w-xl", "mx-auto");
    return;
  }
  if (kind === "twitter" && value === "") {
    $$(`[data-link="twitter"]`).forEach((el) => (el.closest(".community-card") || el).remove());
    return;
  }
  setLink(kind, isRealUrl(value) ? value.trim() : null, msg);
}

/* ---------------- interactions ---------------- */
async function copyText(text) {
  try { window.focus(); } catch { /* some embedded browsers block this */ }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to a selection-based copy */ }

  const span = document.createElement("span");
  span.textContent = text;
  span.style.cssText = "position:fixed;top:0;left:0;white-space:pre;font-size:16px;";
  document.body.appendChild(span);
  const range = document.createRange();
  range.selectNodeContents(span);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  sel.removeAllRanges();
  span.remove();
  return ok;
}

function initCopy() {
  $$("[data-copy-ca]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ca = String(CONFIG.ca || "").trim();
      const original = "Copy";
      if (!ca) {
        btn.textContent = "TBA";
        btn.classList.add("muted");
        toast("Contract address not live yet — coming soon!");
      } else if (await copyText(ca)) {
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        toast("Contract address copied!");
      } else {
        btn.textContent = "Failed";
        toast("Couldn't copy — please copy manually.");
      }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.textContent = original; btn.classList.remove("copied", "muted"); }, 1600);
    });
  });
}

function initPlaceholderLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[data-placeholder="true"]');
    if (!a) return;
    e.preventDefault();
    toast(a.dataset.placeholderMsg || "Link coming soon");
  });
}

function initNav() {
  const nav = document.getElementById("navbar");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  const setOpen = (open) => {
    menu.classList.toggle("hidden", !open);
    btn.setAttribute("aria-expanded", String(open));
    document.getElementById("menuIconOpen").classList.toggle("hidden", open);
    document.getElementById("menuIconClose").classList.toggle("hidden", !open);
  };
  btn.addEventListener("click", () => setOpen(menu.classList.contains("hidden")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a:not([data-placeholder='true'])")) setOpen(false); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 768) setOpen(false); });

  // Active section highlighting
  const links = $$(".nav-link, .mobile-link");
  const sections = ["hero", "about", "how-to-buy", "community", "chart"].map((id) => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${en.target.id}`));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
}

function initReveal() {
  const els = $$(".reveal, .section .section-title, .highlight-box, .community-card, .chart-frame");
  els.forEach((el) => el.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  document.getElementById("year").textContent = new Date().getFullYear();
  initCopy();
  initPlaceholderLinks();
  initNav();
  initReveal();
});
