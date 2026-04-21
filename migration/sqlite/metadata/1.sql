CREATE TABLE episode
(
    episode_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id      INTEGER NOT NULL,
    episode_number INTEGER NOT NULL,
    german_title   TEXT    NOT NULL,
    english_title  TEXT    NOT NULL,
    description    TEXT    NOT NULL,
    FOREIGN KEY (season_id) REFERENCES season (season_id) ON DELETE RESTRICT
);

CREATE TABLE genre
(
    genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
    key      TEXT UNIQUE NOT NULL
);

CREATE TABLE genre_to_series
(
    genre_to_series_id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_id           INTEGER NOT NULL,
    series_id          INTEGER NOT NULL,
    main_genre         BOOLEAN NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE RESTRICT,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);

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

CREATE TABLE season
(
    season_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id     INTEGER NOT NULL,
    season_number INTEGER NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);

CREATE TABLE series
(
    series_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    guid          TEXT UNIQUE NOT NULL,
    title         TEXT        NOT NULL,
    description   TEXT        NOT NULL,
    preview_image TEXT UNIQUE
);

CREATE TABLE watchlist
(
    watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id    INTEGER UNIQUE NOT NULL,
    tenant_id    TEXT           NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);

CREATE TABLE watchtime
(
    watchtime_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id         INTEGER NOT NULL,
    percentage_watched INTEGER NOT NULL,
    stopped_time       INTEGER NOT NULL,
    tenant_id          TEXT    NOT NULL,
    FOREIGN KEY (episode_id) REFERENCES episode (episode_id) ON DELETE CASCADE
);