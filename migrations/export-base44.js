#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const APP_ID = "6a8de72bb83510043a8ec7b0";
const ENTITY_NAMES = ["Project", "Tip", "Review", "Enquiry"];
const SENTINEL = "__TIAANS_BASE44_EXPORT__";
const PAGE_SIZE = 5000;
const MAX_PAGES = 100;
const exportRoot = join(dirname(fileURLToPath(import.meta.url)), "base44-export");

const remoteSource = `
const entityNames = ${JSON.stringify(ENTITY_NAMES)};
const pageSize = ${PAGE_SIZE};
const maxPages = ${MAX_PAGES};
const exported = {};

for (const entityName of entityNames) {
  const records = [];
  const ids = new Set();
  for (let page = 0; page < maxPages; page += 1) {
    const batch = await entities[entityName].list("created_date", pageSize, page * pageSize);
    if (!Array.isArray(batch)) throw new Error(entityName + " did not return an array");
    for (const record of batch) {
      if (!record || typeof record.id !== "string" || !record.id) throw new Error(entityName + " contains a record without an id");
      if (ids.has(record.id)) throw new Error(entityName + " contains duplicate id " + record.id);
      ids.add(record.id);
      records.push(record);
    }
    if (batch.length < pageSize) break;
    if (page === maxPages - 1) throw new Error(entityName + " exceeded the export page bound");
  }
  exported[entityName] = records;
}

console.log(${JSON.stringify(SENTINEL)} + JSON.stringify(exported));
`;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableDigest(records) {
  return sha256(records
    .map((record) => `${record.id}|${record.updated_date || ""}`)
    .sort()
    .join("\n"));
}

function atomicJson(path, value) {
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx", mode: 0o600 });
  renameSync(temporary, path);
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, [
  "base44", "exec",
  "--app-id", APP_ID,
  "--privileged",
  "--data-env", "prod",
], {
  input: remoteSource,
  encoding: "utf8",
  maxBuffer: 100 * 1024 * 1024,
  windowsHide: true,
});

if (result.error) throw result.error;
if (result.status !== 0) {
  process.stderr.write(result.stderr || "Base44 export failed.\n");
  process.exit(result.status || 1);
}

const marker = result.stdout.lastIndexOf(SENTINEL);
if (marker < 0) throw new Error("Base44 export output did not contain the expected marker.");
const payload = JSON.parse(result.stdout.slice(marker + SENTINEL.length).trim());
for (const entityName of ENTITY_NAMES) {
  if (!Array.isArray(payload[entityName])) throw new Error(`Missing ${entityName} export array.`);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = join(exportRoot, timestamp);
mkdirSync(destination, { recursive: true, mode: 0o700 });

const manifest = {
  format_version: 1,
  app_id: APP_ID,
  data_environment: "prod",
  exported_at: new Date().toISOString(),
  entities: {},
};

for (const entityName of ENTITY_NAMES) {
  const records = payload[entityName];
  const fileName = `${entityName.toLowerCase()}s.json`;
  const serialized = `${JSON.stringify(records, null, 2)}\n`;
  atomicJson(join(destination, fileName), records);
  manifest.entities[entityName] = {
    count: records.length,
    id_updated_digest: stableDigest(records),
    file: fileName,
    file_sha256: sha256(serialized),
  };
}

atomicJson(join(destination, "manifest.json"), manifest);
for (const entityName of ENTITY_NAMES) {
  console.log(`${entityName}: ${manifest.entities[entityName].count}`);
}
console.log(`Export saved privately under migrations/base44-export/${timestamp}`);
