PRAGMA foreign_keys = ON;

CREATE TABLE media_objects (
  id TEXT PRIMARY KEY NOT NULL,
  legacy_id TEXT UNIQUE,
  bucket_kind TEXT NOT NULL CHECK (bucket_kind IN ('public_content', 'private_enquiry')),
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  sha256 TEXT,
  legacy_url TEXT,
  state TEXT NOT NULL DEFAULT 'ready' CHECK (state IN ('ready', 'deleting', 'delete_failed')),
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY NOT NULL,
  legacy_id TEXT UNIQUE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
  description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 10000),
  category TEXT NOT NULL CHECK (category IN ('Installation','Repair','Service','Car Aircon','Other')),
  location TEXT NOT NULL DEFAULT 'Bellville' CHECK (length(location) <= 120),
  project_date TEXT,
  cover_media_id TEXT REFERENCES media_objects(id) ON DELETE SET NULL,
  before_media_id TEXT REFERENCES media_objects(id) ON DELETE SET NULL,
  after_media_id TEXT REFERENCES media_objects(id) ON DELETE SET NULL,
  show_before_after INTEGER NOT NULL DEFAULT 0 CHECK (show_before_after IN (0,1)),
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0,1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE project_images (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES media_objects(id) ON DELETE RESTRICT,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
  PRIMARY KEY (project_id, media_id),
  UNIQUE (project_id, sort_order)
);

CREATE TABLE tips (
  id TEXT PRIMARY KEY NOT NULL,
  legacy_id TEXT UNIQUE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
  slug TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(slug) BETWEEN 1 AND 80),
  excerpt TEXT NOT NULL DEFAULT '' CHECK (length(excerpt) <= 500),
  content TEXT NOT NULL DEFAULT '' CHECK (length(content) <= 50000),
  category TEXT NOT NULL CHECK (category IN ('Home Aircon','Car Aircon','Maintenance','Troubleshooting','Energy Saving')),
  cover_media_id TEXT REFERENCES media_objects(id) ON DELETE SET NULL,
  read_time TEXT NOT NULL DEFAULT '3 min read' CHECK (length(read_time) <= 40),
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0,1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0,1)),
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY NOT NULL,
  legacy_id TEXT UNIQUE,
  customer_name TEXT NOT NULL CHECK (length(customer_name) BETWEEN 1 AND 120),
  review TEXT NOT NULL CHECK (length(review) BETWEEN 1 AND 3000),
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  service TEXT NOT NULL DEFAULT '' CHECK (length(service) <= 160),
  review_date TEXT,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE enquiries (
  id TEXT PRIMARY KEY NOT NULL,
  legacy_id TEXT UNIQUE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  phone TEXT NOT NULL CHECK (length(phone) BETWEEN 5 AND 30),
  email TEXT NOT NULL DEFAULT '' CHECK (length(email) <= 254),
  service TEXT NOT NULL CHECK (length(service) BETWEEN 1 AND 160),
  customer_type TEXT NOT NULL DEFAULT 'Home' CHECK (customer_type IN ('Home','Business','Vehicle')),
  message TEXT NOT NULL DEFAULT '' CHECK (length(message) <= 4000),
  attachment_media_id TEXT REFERENCES media_objects(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Quote Sent','Booked','Completed','Closed')),
  private_notes TEXT NOT NULL DEFAULT '' CHECK (length(private_notes) <= 10000),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE admin_audit_log (
  id TEXT PRIMARY KEY NOT NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  request_id TEXT NOT NULL,
  summary_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_projects_public ON projects (published, featured, project_date DESC);
CREATE INDEX idx_tips_public ON tips (published, featured, published_at DESC);
CREATE INDEX idx_reviews_public ON reviews (published, review_date DESC);
CREATE INDEX idx_enquiries_admin ON enquiries (status, created_at DESC);
CREATE INDEX idx_audit_created ON admin_audit_log (created_at DESC);
