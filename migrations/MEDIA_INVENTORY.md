# Media Inventory for Cloudflare Migration

## Static Website Images (in src/lib/images.js)

These 10 images are currently hosted on media.base44.com and must be migrated to R2.

| ID | Usage | Current URL | R2 Destination |
|----|-------|------------|-----------------|
| 1 | Hero banner | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/c036afc6a_generated_f16582d7.png | PUBLIC_MEDIA/static/hero.png |
| 2 | Home section | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/f69a99c32_generated_5e9f8392.png | PUBLIC_MEDIA/static/home.png |
| 3 | Car AC | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/292f6b716_generated_39d77dd5.png | PUBLIC_MEDIA/static/car.png |
| 4 | Tip: Vent | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/8efc9687b_generated_22eb4a23.png | PUBLIC_MEDIA/static/tip-vent.png |
| 5 | Tip: Filter | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/c0da645f6_generated_340bf2e3.png | PUBLIC_MEDIA/static/tip-filter.png |
| 6 | Tip: Car Vent | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/690d5b586_generated_acc03c80.png | PUBLIC_MEDIA/static/tip-car-vent.png |
| 7 | Condenser | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/6329fa8fe_generated_8c6af356.png | PUBLIC_MEDIA/static/condenser.png |
| 8 | Installation | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/fd2b4322f_generated_1785ef16.png | PUBLIC_MEDIA/static/install.png |
| 9 | Tools | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/44e109c29_generated_8bb0743a.png | PUBLIC_MEDIA/static/tools.png |
| 10 | Portrait (Tiaan?) | https://media.base44.com/images/public/6a8de72bb83510043a8ec7b0/c60805cf1_generated_e5c0b333.png | PUBLIC_MEDIA/static/portrait.png |

## Dynamic Content Media

Project portfolio, tips, and review images are stored in Base44 database entities and will be:
1. Referenced in D1 as media_path values pointing to Base44 URLs
2. Downloaded during migration
3. Uploaded to R2 with randomized keys
4. D1 media_path fields updated with R2 URLs

## Private Media

Enquiry attachments are stored in the PRIVATE_ATTACHMENTS bucket with:
- Customer attachment uploads
- Private enquiry data
- Access-restricted (authenticated admin only)

## Migration Tasks

### Phase 1: Static Images
1. Download the 10 static images from media.base44.com
2. Validate file integrity (JPEG/PNG/WebP)
3. Upload to PUBLIC_MEDIA R2 bucket with predictable names
4. Update src/lib/images.js IMG object to use R2 URLs
5. Test on local dev

### Phase 2: Project Portfolio Images
1. Export all project records from Base44 (cover, gallery, before, after images)
2. Download media files from Base44 URLs
3. Generate randomized R2 object keys
4. Upload to PUBLIC_MEDIA bucket
5. Update D1 project_images.media_path with R2 URLs

### Phase 3: Tips and Reviews
1. Export tip cover images from Base44
2. Download and validate files
3. Upload to PUBLIC_MEDIA bucket
4. Update D1 tips.cover_image_path with R2 URLs

### Phase 4: Enquiry Attachments
1. Export enquiry attachment metadata from Base44
2. Download private attachments
3. Validate file types (restrictive list - PDF, images only)
4. Upload to PRIVATE_ATTACHMENTS bucket with randomized keys
5. Update D1 enquiries.attachment_path with R2 URLs and metadata

## R2 URL Structure

**Public Media (logo-based access):**
```
https://PUBLIC_MEDIA_R2_DOMAIN/static/hero.png
https://PUBLIC_MEDIA_R2_DOMAIN/projects/{project_id}/{randomized_key}
https://PUBLIC_MEDIA_R2_DOMAIN/tips/{tip_id}/{randomized_key}
```

**Private Attachments (authenticated access only):**
```
/api/private/attachments/{enquiry_id}/{randomized_key}
(served by Cloudflare Function with auth checks)
```

## Validation Checklist

- [ ] All 10 static images downloaded
- [ ] File checksums recorded
- [ ] R2 buckets created
- [ ] All static images uploaded to R2
- [ ] IMG object in src/lib/images.js updated
- [ ] Local test: All images load from R2
- [ ] All project images inventoried
- [ ] All project images uploaded
- [ ] D1 media_path fields populated
- [ ] All tip images uploaded
- [ ] All enquiry attachments uploaded
- [ ] Private access restrictions verified
- [ ] No Base44 media URLs remain in runtime
- [ ] All images display correctly on live site

## Known Issues

- Base44 generated file names (e.g., `c036afc6a_generated_f16582d7.png`) are opaque
- Some images may be resized/transformed by Base44 CDN
- No checksum metadata available from Base44 metadata (file size/type must be validated on download)
