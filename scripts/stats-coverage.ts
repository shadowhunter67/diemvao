import { institutionCoverage } from '../src/data/institutionCoverage.ts';

console.log('UniScoreVN coverage stats');
console.log(`  Catalog entries:             ${institutionCoverage.totalCatalogEntries}`);
console.log(`  Institution KPI entries:     ${institutionCoverage.institutionEntries}`);
console.log(`  Internal/non-KPI entries:    ${institutionCoverage.internalUnitEntries}`);
console.log(`  Researched or better:        ${institutionCoverage.researched}`);
console.log(`  Eligibility only:            ${institutionCoverage.eligibilitySupported}`);
console.log(`  Partial calculators:         ${institutionCoverage.partialCalculator}`);
console.log(`  Verified calculators:        ${institutionCoverage.fullyVerified}`);
console.log(`  Any calculator support:      ${institutionCoverage.calculatorSupported}`);
console.log(`  Catalog only:                ${institutionCoverage.catalogOnly}`);
