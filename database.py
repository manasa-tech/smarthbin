import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "smartbin.db"


def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS bins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                fill_level INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'Normal',
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                issue TEXT NOT NULL,
                description TEXT DEFAULT '',
                status TEXT NOT NULL DEFAULT 'Pending',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        """)

        count = conn.execute(
            "SELECT COUNT(*) FROM bins"
        ).fetchone()[0]

        if count == 0:
            conn.executemany("""
                INSERT INTO bins
                (name, location, fill_level, status)
                VALUES (?, ?, ?, ?)
            """, [
                ("Bin #101", "Bengaluru", 35, "Normal"),
                ("Bin #102", "Whitefield", 68, "Normal"),
                ("Bin #103", "Electronic City", 92, "Overflowing"),
                ("Bin #104", "HSR Layout", 76, "Nearly Full"),
            ])
