-- Turso / SQLite schema for portfolio AI chat RAG
-- Apply: turso db shell <your-db> < scripts/turso-schema.sql
-- Or paste into Turso SQL console.

CREATE TABLE IF NOT EXISTS portfolio_knowledge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project TEXT,
  type TEXT,
  title TEXT,
  content TEXT,
  participant TEXT,
  tags TEXT
);

-- Optional: about rows (column names can match your CSV; quote identifiers with spaces)
CREATE TABLE IF NOT EXISTS about_me (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  "Title / Role" TEXT,
  Category TEXT,
  "Core Projects & Responsibilities" TEXT,
  "Quantifiable Metrics & Outcomes" TEXT,
  "Org / Location" TEXT,
  Duration TEXT,
  "Org / Location/Duration" TEXT
);

CREATE INDEX IF NOT EXISTS idx_portfolio_knowledge_content ON portfolio_knowledge (content);
CREATE INDEX IF NOT EXISTS idx_portfolio_knowledge_project ON portfolio_knowledge (project);
CREATE INDEX IF NOT EXISTS idx_portfolio_knowledge_tags ON portfolio_knowledge (tags);
