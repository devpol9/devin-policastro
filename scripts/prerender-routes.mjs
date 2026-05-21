// Post-build: emit per-route static index.html with correct OG/title/description
// so non-JS social crawlers (LinkedIn, Slack, iMessage, Facebook) get accurate previews.
// SPA fallback still hydrates React on these paths.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const SITE_URL = "https://devinpolicastro.com";
const DIST = resolve("dist");
const SRC = resolve(DIST, "index.html");

if (!existsSync(SRC)) {
  console.warn("[prerender] dist/index.html not found, skipping.");
  process.exit(0);
}

const seoPages = {
  "/consulting": {
    title: "Consulting — Brand Strategy & Growth | Devin Policastro",
    description: "Real-world brand strategy and growth advisory from someone who's actually built it. Fitness, CPG, services — no agency markup.",
  },
  "/manufacturing": {
    title: "Manufacturing — Concept to Shelf | Creative Vision",
    description: "Custom apparel, fitness equipment, supplements, and branded products. Idea to delivery, end to end.",
  },
  "/content": {
    title: "Content — Short-Form Video & Storytelling | Devin Policastro",
    description: "Short-form video, social content, and brand storytelling that actually moves the needle. Built by an operator, not an agency.",
  },
  "/automotive": {
    title: "Automotive — Wraps, PPF, Tuning, Builds | Devin Policastro",
    description: "Vinyl wraps, PPF, ceramic coating, tinting, tuning, and full custom builds. Premium work, NJ.",
  },
  "/financing": {
    title: "Financing — Capital & Deal Structure | Devin Policastro",
    description: "Business financing and capital access. Structure your next venture with the right funding, the right terms.",
  },
  "/networking": {
    title: "Networking — The Right Intros, On Purpose | Devin Policastro",
    description: "Relationship-driven growth and strategic introductions. The right room beats a thousand cold emails.",
  },
  "/fitness": {
    title: "Fitness — Training & Coaching | Impact Zone NJ",
    description: "Personal training, group programs, and lifestyle coaching at Impact Zone Fitness in Norwood, NJ. 51,000 sq ft, no contracts.",
  },
};

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const setAttr = (html, selector, attr, value) => {
  const v = escapeHtml(value);
  const re = new RegExp(`(<${selector}[^>]*${attr}=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${v}$2`) : html;
};

const setMetaContent = (html, kind, key, content) => {
  const v = escapeHtml(content);
  const re = new RegExp(`(<meta\\s+[^>]*${kind}="${key}"[^>]*content=")[^"]*(")`, "i");
  if (re.test(html)) return html.replace(re, `$1${v}$2`);
  const re2 = new RegExp(`(<meta\\s+[^>]*content=")[^"]*("[^>]*${kind}="${key}"[^>]*>)`, "i");
  return re2.test(html) ? html.replace(re2, `$1${v}$2`) : html;
};

const setCanonical = (html, href) => {
  const re = /(<link\s+[^>]*rel="canonical"[^>]*href=")[^"]*(")/i;
  return re.test(html) ? html.replace(re, `$1${escapeHtml(href)}$2`) : html;
};

const setTitle = (html, t) =>
  html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(t)}</title>`);

const base = readFileSync(SRC, "utf8");
let count = 0;

for (const [path, { title, description }] of Object.entries(seoPages)) {
  const url = `${SITE_URL}${path}`;
  let html = base;
  html = setTitle(html, title);
  html = setMetaContent(html, "name", "description", description);
  html = setMetaContent(html, "property", "og:title", title);
  html = setMetaContent(html, "property", "og:description", description);
  html = setMetaContent(html, "property", "og:url", url);
  html = setMetaContent(html, "name", "twitter:title", title);
  html = setMetaContent(html, "name", "twitter:description", description);
  html = setCanonical(html, url);

  const out = resolve(DIST, path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  count++;
}

console.log(`[prerender] wrote ${count} per-route HTML files`);
