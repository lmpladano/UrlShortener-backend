CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original TEXT NOT NULL,
  base62 VARCHAR(64) NOT NULL UNIQUE,
  shortened VARCHAR(2048) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX links_user_id_idx ON links(user_id);
