#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const inventory = JSON.parse(await readFile(join(root, "registry/source-inventories/laptop-estate-2026-08-09.json"), "utf8"));
const expectedUnits = [
  "accepted-library-works",
  "siso-ui-base-candidate",
  "retired-agent-base-warehouse",
  "agency-import-candidates",
  "knowledge-data-planes",
  "private-personal-plane",
  "transcript-session-plane",
  "runtime-configuration-plane"
];
if (inventory.id !== "gls:source-inventory:7c9e2a41-5d68-4f03-b8a7-1e6c9d2f405b") throw new Error("unexpected laptop estate inventory ID");
for (const unitId of expectedUnits) if (!inventory.units.some((unit) => unit.unit_id === unitId)) throw new Error(`missing unit ${unitId}`);
const raw = await readFile(join(root, "docs/laptop-estate.html"), "utf8");
if (!raw.includes("sole identity and lineage registry")) throw new Error("public guide must state sole-registry rule");
if (!raw.includes("several databases")) throw new Error("public guide must preserve physical database plurality");
console.log(`PASS laptop estate contract: ${expectedUnits.length} units and public guide`);
