#!/usr/bin/env node

/**
 * Import Base44 Exported Data into D1
 * Transforms Base44 entities into D1 schema
 */

const fs = require('fs');
const path = require('path');

const EXPORT_DIR = path.join(__dirname, 'base44-export');

// Load exported JSON files
function loadExportedData() {
  const data = {};
  const files = ['projects', 'tips', 'reviews', 'enquiries', 'users'];

  files.forEach(file => {
    const filePath = path.join(EXPORT_DIR, `${file}.json`);
    if (fs.existsSync(filePath)) {
      data[file] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`✓ Loaded ${file}: ${data[file].length} records`);
    } else {
      data[file] = [];
      console.log(`⚠️  ${file}.json not found - using empty array`);
    }
  });

  return data;
}

// Transform Base44 projects to D1 schema
function transformProjects(projects) {
  return projects.map(p => ({
    id: p.id, // Preserve original Base44 ID
    legacy_id: p.id,
    title: p.title,
    description: p.description || '',
    category: p.category || 'residential',
    location: p.location || '',
    project_date: p.project_date ? new Date(p.project_date).toISOString() : null,
    cover_image_path: p.cover_image_path || null,
    featured: p.featured ? 1 : 0,
    published: p.published ? 1 : 0,
    created_at: new Date(p.created_at || Date.now()).toISOString(),
    updated_at: new Date(p.updated_at || Date.now()).toISOString(),
  }));
}

// Transform Base44 project images to D1 schema
function transformProjectImages(projects) {
  const images = [];
  projects.forEach((p, idx) => {
    if (p.gallery && Array.isArray(p.gallery)) {
      p.gallery.forEach((img, order) => {
        images.push({
          id: `${p.id}-gallery-${order}`,
          project_id: p.id,
          media_path: img.url || img,
          caption: img.caption || '',
          sort_order: order,
          image_type: 'gallery',
          created_at: new Date().toISOString(),
        });
      });
    }

    if (p.before_image_path) {
      images.push({
        id: `${p.id}-before`,
        project_id: p.id,
        media_path: p.before_image_path,
        caption: 'Before',
        sort_order: -2,
        image_type: 'before',
        created_at: new Date().toISOString(),
      });
    }

    if (p.after_image_path) {
      images.push({
        id: `${p.id}-after`,
        project_id: p.id,
        media_path: p.after_image_path,
        caption: 'After',
        sort_order: -1,
        image_type: 'after',
        created_at: new Date().toISOString(),
      });
    }
  });

  return images;
}

// Transform Base44 tips to D1 schema
function transformTips(tips) {
  return tips.map(t => ({
    id: t.id,
    legacy_id: t.id,
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt || '',
    content: t.content || '',
    category: t.category || 'general',
    cover_image_path: t.cover_image_path || null,
    read_time: t.read_time || 5,
    featured: t.featured ? 1 : 0,
    published: t.published ? 1 : 0,
    published_date: t.published_date ? new Date(t.published_date).toISOString() : null,
    created_at: new Date(t.created_at || Date.now()).toISOString(),
    updated_at: new Date(t.updated_at || Date.now()).toISOString(),
  }));
}

// Transform Base44 reviews to D1 schema
function transformReviews(reviews) {
  return reviews.map(r => ({
    id: r.id,
    legacy_id: r.id,
    customer_name: r.customer_name,
    review: r.review,
    rating: r.rating || 5,
    service: r.service || 'general',
    review_date: r.review_date ? new Date(r.review_date).toISOString() : null,
    published: r.published ? 1 : 0,
    created_at: new Date(r.created_at || Date.now()).toISOString(),
    updated_at: new Date(r.updated_at || Date.now()).toISOString(),
  }));
}

// Transform Base44 enquiries to D1 schema
function transformEnquiries(enquiries) {
  return enquiries.map(e => ({
    id: e.id,
    legacy_id: e.id,
    name: e.name,
    phone: e.phone || '',
    email: e.email,
    service: e.service || 'general',
    customer_type: e.customer_type || 'residential',
    message: e.message || '',
    attachment_path: e.attachment_path || null,
    status: e.status || 'new',
    private_notes: e.private_notes || '',
    created_at: new Date(e.created_at || Date.now()).toISOString(),
    updated_at: new Date(e.updated_at || Date.now()).toISOString(),
  }));
}

// Generate SQL INSERT statements for verification
function generateInsertStatements(data) {
  const statements = [];

  // Projects
  console.log('\n📝 Generating SQL for projects...');
  data.projects.forEach(p => {
    const values = [
      `'${p.id}'`,
      `'${p.title.replace(/'/g, "''")}'`,
      `'${p.description.replace(/'/g, "''")}'`,
      `'${p.category}'`,
      `'${p.location.replace(/'/g, "''")}'`,
      p.project_date ? `'${p.project_date}'` : 'NULL',
      p.cover_image_path ? `'${p.cover_image_path}'` : 'NULL',
      p.featured,
      p.published,
      `'${p.created_at}'`,
      `'${p.updated_at}'`,
    ];
    statements.push(`INSERT INTO projects (id, title, description, category, location, project_date, cover_image_path, featured, published, created_at, updated_at) VALUES (${values.join(', ')});`);
  });

  // Tips
  console.log('📝 Generating SQL for tips...');
  data.tips.forEach(t => {
    const values = [
      `'${t.id}'`,
      `'${t.title.replace(/'/g, "''")}'`,
      `'${t.slug.replace(/'/g, "''")}'`,
      `'${t.excerpt.replace(/'/g, "''")}'`,
      `'${t.content.replace(/'/g, "''")}'`,
      `'${t.category}'`,
      t.cover_image_path ? `'${t.cover_image_path}'` : 'NULL',
      t.read_time,
      t.featured,
      t.published,
      t.published_date ? `'${t.published_date}'` : 'NULL',
      `'${t.created_at}'`,
      `'${t.updated_at}'`,
    ];
    statements.push(`INSERT INTO tips (id, title, slug, excerpt, content, category, cover_image_path, read_time, featured, published, published_date, created_at, updated_at) VALUES (${values.join(', ')});`);
  });

  return statements;
}

async function importBase44Data() {
  console.log('Starting Base44 data import...\n');

  try {
    const exportedData = loadExportedData();

    console.log('\n🔄 Transforming Base44 data to D1 schema...\n');

    const transformed = {
      projects: transformProjects(exportedData.projects),
      project_images: transformProjectImages(exportedData.projects),
      tips: transformTips(exportedData.tips),
      reviews: transformReviews(exportedData.reviews),
      enquiries: transformEnquiries(exportedData.enquiries),
    };

    // Display summary
    console.log('📊 Transformation Summary:');
    console.log(`  Projects: ${transformed.projects.length}`);
    console.log(`  Project Images: ${transformed.project_images.length}`);
    console.log(`  Tips: ${transformed.tips.length}`);
    console.log(`  Reviews: ${transformed.reviews.length}`);
    console.log(`  Enquiries: ${transformed.enquiries.length}`);

    // Save transformed data
    const outputPath = path.join(EXPORT_DIR, 'transformed.json');
    fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2), 'utf-8');
    console.log(`\n✓ Saved transformed data to: ${outputPath}`);

    // Generate SQL statements for verification
    const statements = generateInsertStatements(transformed);
    const sqlPath = path.join(EXPORT_DIR, 'import-statements.sql');
    fs.writeFileSync(sqlPath, statements.join('\n'), 'utf-8');
    console.log(`✓ Generated SQL statements: ${sqlPath}`);

    console.log('\n✅ Import preparation complete!');
    console.log('\nNext steps:');
    console.log('1. Review migrations/base44-export/transformed.json');
    console.log('2. Review migrations/base44-export/import-statements.sql');
    console.log('3. Run: wrangler d1 execute tiaans-aircon --file ./migrations/base44-export/import-statements.sql --local');

  } catch (error) {
    console.error('❌ Error during import:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

importBase44Data().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
