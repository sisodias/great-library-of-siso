import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("site");
const basePath = normalizeBase(process.env.LIBRARY_BASE_PATH || "/");
const errors = [];

function normalizeBase(value) {
  const clean = `/${String(value).replace(/^\/+|\/+$/g, "")}/`;
  return clean === "//" ? "/" : clean;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

function localTarget(raw, sourceFile) {
  if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) return null;
  const clean = decodeURIComponent(raw.split("#", 1)[0].split("?", 1)[0]);
  if (!clean) return null;

  let relative;
  if (clean.startsWith("/")) {
    if (!clean.startsWith(basePath)) {
      errors.push(`${path.relative(root, sourceFile)}: root-relative URL is outside ${basePath}: ${raw}`);
      return null;
    }
    relative = clean.slice(basePath.length);
  } else {
    relative = path.relative(root, path.resolve(path.dirname(sourceFile), clean));
  }

  if (relative.endsWith("/")) relative += "index.html";
  if (!path.extname(relative)) relative = path.join(relative, "index.html");
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    errors.push(`${path.relative(root, sourceFile)}: URL escapes the publication root: ${raw}`);
    return null;
  }
  return resolved;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

for (const required of ["index.html", "agents/index.html", "promotion/index.html", "promotion.json", "intelligence/index.html", "intelligence.json", "research/index.html", "docs/research-question-model.html", "docs/siso-mission.html", "docs/question-driven-research.html", "docs/frontier-question-template.html", "docs/ecosystem-intelligence.html", "docs/100-million-token-program.html", "estate/index.html", "estate.json"]) {
  if (!await exists(path.join(root, required))) errors.push(`missing required page: ${required}`);
}

const intelligence = JSON.parse(await readFile(path.join(root, "intelligence.json"), "utf8"));
if (intelligence.counts?.decisions < 4) errors.push("intelligence.json: expected the four foundational ADRs");
if (intelligence.counts?.events < 5) errors.push("intelligence.json: expected the seeded ecosystem events");
if (!intelligence.decisions?.some((decision) => decision.decision_key === "ADR-0004")) errors.push("intelligence.json: missing ADR-0004");
if (!intelligence.events?.some((event) => event.scope?.snapshot_ids?.includes("gls:snapshot:73ee0c53-7e65-4c1c-9fe8-c990607ebf89"))) errors.push("intelligence.json: Whole Library V24 is not connected to an authored event");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "24.0.0")) errors.push("intelligence.json: automatic registry changelog is missing V24");

const frontierQuestions = [
  ["GQ-001", "frontier-question-agent-workspace"],
  ["GQ-002", "frontier-question-agent-layer-efficiency"],
  ["GQ-004", "frontier-question-best-software-primitive"],
  ["GQ-005", "frontier-question-field-momentum"],
  ["GQ-006", "frontier-question-information-organ"],
  ["GQ-008", "frontier-question-model-routing"],
];
const researchIndex = await readFile(path.join(root, "research/index.html"), "utf8");
if (!researchIndex.includes("Frontier Questions · God Questions")) errors.push("research/index.html: missing Frontier Questions section");
for (const [document, marker] of [
  ["docs/siso-mission.html", "The Great Library of SISO</td><td>Provides durable public identities"],
  ["docs/question-driven-research.html", "The ten-pass first-principles loop"],
  ["docs/frontier-question-template.html", "Worked example · composable CRM"],
]) {
  const documentHtml = await readFile(path.join(root, document), "utf8");
  if (!documentHtml.includes(marker)) errors.push(`${document}: missing contract marker: ${marker}`);
  if (!researchIndex.includes(`/${document}`)) errors.push(`research/index.html: missing ${document} link`);
}
const programHtml = await readFile(path.join(root, "docs/100-million-token-program.html"), "utf8");
for (const marker of ["The 100 Million Token Program", "No. They should run as a dependency-aware portfolio.", "awaiting operator approval", "question-driven research architecture"]) {
  if (!programHtml.includes(marker)) errors.push(`docs/100-million-token-program.html: missing contract marker: ${marker}`);
}
for (const [questionId, slug] of frontierQuestions) {
  const questionPath = path.join(root, "works", slug, "index.html");
  if (!await exists(questionPath)) {
    errors.push(`missing Frontier Question page: works/${slug}/index.html`);
    continue;
  }
  if (!researchIndex.includes(`/works/${slug}/`)) errors.push(`research/index.html: missing ${questionId} link`);
  const questionPage = await readFile(questionPath, "utf8");
  if (!questionPage.includes(`Research contract · ${questionId}`)) errors.push(`works/${slug}/index.html: missing ${questionId} research contract`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  if (!html.includes("Built by the SISO Open Source Foundation") || !html.includes("Funded by SISO Agency")) {
    errors.push(`${relative}: missing exact public attribution`);
  }
  if (/A SISO Open project/i.test(html)) errors.push(`${relative}: contains retired project wording`);
  if (/(?:google-analytics\.com|googletagmanager\.com|plausible\.io|vercel-insights)/i.test(html)) {
    errors.push(`${relative}: contains an unapproved analytics endpoint`);
  }

  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const target = localTarget(match[1], file);
    if (target && !await exists(target)) errors.push(`${relative}: broken local reference ${match[1]}`);
  }
}

if (errors.length) {
  console.error(`Site check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site check passed: ${htmlFiles.length} HTML pages, ${files.length} published files, base ${basePath}`);
