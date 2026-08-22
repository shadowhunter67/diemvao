import { readFileSync } from 'node:fs';

const generatedFiles = [
  'src/generated/finalCatalog.generated.ts',
  'src/generated/collegeCatalog.generated.ts',
  'src/generated/southernCatalog.generated.ts',
  'src/generated/remainingCatalog.generated.ts',
];

const requiredHeader = `// AUTO-GENERATED.
// DO NOT EDIT MANUALLY.
// Source of truth lives in private UniScoreVN data pipeline.`;

let failures = 0;

for (const file of generatedFiles) {
  const text = readFileSync(file, 'utf8');
  if (!text.startsWith(requiredHeader)) {
    console.error(`[validate:generated] Missing generated header: ${file}`);
    failures += 1;
  }
  if (!text.includes('schemaVersion: "runtime-v1"')) {
    console.error(`[validate:generated] Missing runtime-v1 schema marker: ${file}`);
    failures += 1;
  }
  if (!text.includes('admissionYear: 2026')) {
    console.error(`[validate:generated] Missing admission year marker: ${file}`);
    failures += 1;
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`[validate:generated] OK: ${generatedFiles.length} runtime artifacts validated.`);
}
