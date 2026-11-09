-- Contact form submissions. Written by /api/contact, read in /admin/messages.
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business TEXT NOT NULL DEFAULT '',
  need TEXT NOT NULL,
  budget TEXT NOT NULL DEFAULT '',
  timing TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  -- Salted SHA-256 of the sender's IP, never the raw address.
  ip_hash TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  email_sent INTEGER NOT NULL DEFAULT 0,
  email_error TEXT
);

CREATE INDEX IF NOT EXISTS messages_created_at ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_status_created_at ON messages (status, created_at DESC);
