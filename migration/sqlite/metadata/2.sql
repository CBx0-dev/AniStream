CREATE TABLE watchlist
(
    watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id    INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);