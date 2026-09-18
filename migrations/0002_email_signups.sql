-- Email list signups
CREATE TABLE IF NOT EXISTS email_signups (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  city       TEXT NOT NULL DEFAULT '',
  state      TEXT NOT NULL DEFAULT '',
  createdAt  TEXT NOT NULL
);
