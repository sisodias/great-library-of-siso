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

for (const required of ["index.html", "agents/index.html", "estate/index.html", "estate.json"]) {
  if (!await exists(path.join(root, required))) errors.push(`missing required page: ${required}`);
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
