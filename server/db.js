const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'poop-calendar.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Failed to connect to SQLite database:', error.message);
    throw error;
  }

  console.log(`Connected to SQLite database at ${dbPath}`);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'diary',
      date TEXT NOT NULL,
      time TEXT,
      location TEXT,
      note TEXT,
      stool_type TEXT,
      rating_json TEXT,
      latitude REAL,
      longitude REAL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  const columns = await all('PRAGMA table_info(entries)');
  const existingColumns = new Set(columns.map((column) => column.name));

  if (!existingColumns.has('type')) {
    await run('ALTER TABLE entries ADD COLUMN type TEXT NOT NULL DEFAULT "diary"');
  }

  if (!existingColumns.has('time')) {
    await run('ALTER TABLE entries ADD COLUMN time TEXT');
  }

  if (!existingColumns.has('stool_type')) {
    await run('ALTER TABLE entries ADD COLUMN stool_type TEXT');
  }

  if (!existingColumns.has('location')) {
    await run('ALTER TABLE entries ADD COLUMN location TEXT');
  }

  if (!existingColumns.has('latitude')) {
    await run('ALTER TABLE entries ADD COLUMN latitude REAL');
  }

  if (!existingColumns.has('longitude')) {
    await run('ALTER TABLE entries ADD COLUMN longitude REAL');
  }

  const locationColumn = columns.find((column) => column.name === 'location');
  if (locationColumn && locationColumn.notnull === 1) {
    await run('ALTER TABLE entries RENAME TO entries_legacy');
    await run(`
      CREATE TABLE entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL DEFAULT 'diary',
        date TEXT NOT NULL,
        time TEXT,
        location TEXT,
        note TEXT,
        stool_type TEXT,
        rating_json TEXT,
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await run(`
      INSERT INTO entries (id, user_id, type, date, time, location, note, stool_type, rating_json, latitude, longitude, created_at)
      SELECT id, user_id, type, date, time, location, note, stool_type, rating_json, latitude, longitude, created_at
      FROM entries_legacy
    `);
    await run('DROP TABLE entries_legacy');
  }
}

module.exports = { db, run, get, all, initializeDatabase };
