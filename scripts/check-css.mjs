const base = process.argv[2] ?? "http://localhost:3000";
const pageRes = await fetch(base + "/");
const html = await pageRes.text();
const cssMatch = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
const cssRes = await fetch(base + cssMatch[1]);
const css = await cssRes.text();
console.log(JSON.stringify({
  page: pageRes.status,
  css: cssRes.status,
  bytes: css.length,
  tailwind: css.includes("text-sky-900"),
}));
