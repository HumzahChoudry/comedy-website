-- Comedy Website — initial schema and seed data
-- site_config is stored as a single JSON row for flexibility.

CREATE TABLE IF NOT EXISTS site_config (
  id    INTEGER PRIMARY KEY CHECK (id = 1),
  data  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  id          TEXT PRIMARY KEY,
  src         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  caption     TEXT NOT NULL DEFAULT '',
  uploadedAt  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  youtubeUrl    TEXT NOT NULL,
  thumbnailUrl  TEXT NOT NULL DEFAULT '',
  addedAt       TEXT NOT NULL,
  featured      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tour_dates (
  id         TEXT PRIMARY KEY,
  date       TEXT NOT NULL,
  venue      TEXT NOT NULL,
  city       TEXT NOT NULL,
  ticketUrl  TEXT NOT NULL DEFAULT '',
  soldOut    INTEGER NOT NULL DEFAULT 0,
  notes      TEXT NOT NULL DEFAULT ''
);

-- ----------------------------------------------------------------------------
-- Seed data (mirrors the original JSON files). Safe to edit later via the
-- admin dashboard once deployed.
-- ----------------------------------------------------------------------------

INSERT OR IGNORE INTO site_config (id, data) VALUES (
  1,
  '{"name":"Your Comedian Name","tagline":"Comedian | Person | Entertainer","bio":"Welcome to my comedy world! I''m a stand-up comedian based in Brooklyn, known for my sharp wit, relatable storytelling, and unforgettable live shows. Whether it''s a club gig or a sold-out theater, I bring the laughs every time.","heroHeading":"Laughs Guaranteed.","heroSubheading":"Stand-up comedy that hits different.","heroImage":"","contactEmail":"youremail@example.com","socialLinks":{"instagram":"https://instagram.com/yourhandle","twitter":"https://twitter.com/yourhandle","youtube":"https://youtube.com/@yourchannel","tiktok":"https://tiktok.com/@yourhandle","facebook":"https://facebook.com/yourpage"},"seoDescription":"Official website of Humzah Choudry - Stand-up comedian. Book tickets, watch videos, and get in touch.","footerText":"© 2026 Humzah Choudry Enterprises. All rights reserved."}'
);

INSERT OR IGNORE INTO videos (id, title, description, youtubeUrl, thumbnailUrl, addedAt, featured) VALUES
  ('video-1', 'Live at The Comedy Club', 'Check out this clip from my recent show!', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '', '2026-03-01T00:00:00.000Z', 1),
  ('video-2', 'Late Night Set Highlights', 'Best moments from my late night appearance.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '', '2026-02-10T00:00:00.000Z', 0);

INSERT OR IGNORE INTO tour_dates (id, date, venue, city, ticketUrl, soldOut, notes) VALUES
  ('tour-1', '2026-04-15', 'The Comedy Store', 'Los Angeles, CA', 'https://tickets.example.com/show1', 0, 'Two shows — 7pm & 9pm'),
  ('tour-2', '2026-04-22', 'Laugh Factory', 'Chicago, IL', 'https://tickets.example.com/show2', 0, ''),
  ('tour-3', '2026-05-05', 'Caroline''s on Broadway', 'New York, NY', 'https://tickets.example.com/show3', 1, 'Sold out! Join waitlist.'),
  ('tour-4', '2026-05-20', 'Improv Comedy Club', 'Houston, TX', 'https://tickets.example.com/show4', 0, '');
