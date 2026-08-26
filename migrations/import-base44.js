#!/usr/bin/env node

console.error([
  "Production import is intentionally disabled.",
  "The live Base44 export, validated media manifest, and deterministic D1 transform are required first.",
  "Do not import the previous generated SQL: its fields and constraints do not match the current schema.",
].join("\n"));
process.exit(1);
