CREATE TABLE list
(
    list_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    tenant_id TEXT NOT NULL
);

CREATE TABLE list_to_series
(
    list_id   INTEGER NOT NULL,
    series_id INTEGER NOT NULL,
    PRIMARY KEY (list_id, series_id),
    FOREIGN KEY (list_id) REFERENCES list (list_id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);