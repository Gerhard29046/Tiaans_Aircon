#!/usr/bin/env node

/**
 * Base44 Data Export Script
 * Exports all entities from the Tiaan's Aircon Base44 app
 * App ID: 6a8de72bb83510043a8ec7b0
 */

const fs = require('fs');
const path = require('path');

// This script would use the Base44 SDK to export data
// For now, we'll provide a template and use the API directly

const APP_ID = '6a8de72bb83510043a8ec7b0';
const EXPORT_DIR = path.join(__dirname, 'base44-export');

async function exportBase44Data() {
  console.log('Starting Base44 data export...');
  console.log(`App ID: ${APP_ID}`);
  console.log(`Export directory: ${EXPORT_DIR}`);

  try {
    // Create export directory if it doesn't exist
    if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    console.log('\n⚠️  MANUAL STEP REQUIRED:');
    console.log('');
    console.log('To export your Base44 data, please:');
    console.log('');
    console.log('1. Go to: https://app.base44.com/apps/' + APP_ID + '/editor/data');
    console.log('2. For each entity type (Project, Tip, Review, Enquiry):');
    console.log('   - Select all records');
    console.log('   - Export as JSON');
    console.log('   - Save to migrations/base44-export/[entity].json');
    console.log('');
    console.log('3. Document record counts in migrations/base44-export/EXPORT_MANIFEST.md');
    console.log('');
    console.log('Expected files:');
    console.log('  - migrations/base44-export/projects.json');
    console.log('  - migrations/base44-export/tips.json');
    console.log('  - migrations/base44-export/reviews.json');
    console.log('  - migrations/base44-export/enquiries.json');
    console.log('  - migrations/base44-export/users.json (if applicable)');
    console.log('  - migrations/base44-export/EXPORT_MANIFEST.md');
    console.log('');
    console.log('Once exported, run: node migrations/import-base44.js');

    // Create a manifest template
    const manifestTemplate = `# Base44 Export Manifest
Generated: ${new Date().toISOString()}
App ID: ${APP_ID}

## Export Summary

| Entity | Count | Published | Draft | Notes |
|--------|-------|-----------|-------|-------|
| Projects | ? | ? | ? | |
| Tips | ? | ? | ? | |
| Reviews | ? | ? | ? | |
| Enquiries | ? | ? | ? | |
| Users | ? | ? | ? | |

## Media Inventory

List all media URLs found in entities:
- Source entity type
- Entity ID
- Media field
- URL
- Content-type
- Size
- Public/Private

## Known Issues

Document any:
- Duplicate slugs in Tips
- Missing required fields
- Null values
- Custom fields not in schema
`;

    const manifestPath = path.join(EXPORT_DIR, 'EXPORT_MANIFEST.md');
    if (!fs.existsSync(manifestPath)) {
      fs.writeFileSync(manifestPath, manifestTemplate, 'utf-8');
      console.log(`\n✓ Created manifest template: ${manifestPath}`);
    }

  } catch (error) {
    console.error('Error during export:', error.message);
    process.exit(1);
  }
}

exportBase44Data().then(() => {
  console.log('\nExport process complete.');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
