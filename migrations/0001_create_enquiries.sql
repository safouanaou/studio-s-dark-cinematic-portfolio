CREATE TABLE enquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business TEXT,
  service TEXT NOT NULL,
  budget TEXT NOT NULL,
  launch_window TEXT NOT NULL,
  message TEXT NOT NULL,
  delivery_status TEXT NOT NULL CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  delivered_at TEXT,
  delivery_error TEXT,
  privacy_version TEXT NOT NULL
);

CREATE INDEX enquiries_created_at_idx ON enquiries (created_at);
CREATE INDEX enquiries_delivery_status_idx ON enquiries (delivery_status);

CREATE TABLE submission_attempts (
  ip_hash TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL
);
