CREATE TABLE watchlist_new
(
    watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id    INTEGER UNIQUE NOT NULL,
    tenant_id    TEXT           NOT NULL,
    FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE RESTRICT
);

INSERT INTO watchlist_new (watchlist_id, series_id, tenant_id)
SELECT watchlist_id, series_id, ?
FROM watchlist;

DROP TABLE watchlist;

ALTER TABLE watchlist_new
    RENAME TO watchlist;

CREATE TABLE episode_new
(
    episode_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id      INTEGER NOT NULL,
    episode_number INTEGER NOT NULL,
    german_title   TEXT    NOT NULL,
    english_title  TEXT    NOT NULL,
    description    TEXT    NOT NULL,
    FOREIGN KEY (season_id) REFERENCES season (season_id) ON DELETE RESTRICT
);

INSERT INTO episode_new (episode_id, season_id, episode_number, german_title, english_title, description)
SELECT episode_id, season_id, episode_number, german_title, english_title, description
FROM episode;

ALTER TABLE episode
    RENAME TO episode_old;
ALTER TABLE episode_new
    RENAME TO episode;

CREATE TABLE watchtime
(
    watchtime_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id         INTEGER NOT NULL,
    percentage_watched INTEGER NOT NULL,
    stopped_time       INTEGER NOT NULL,
    tenant_id          TEXT    NOT NULL,
    FOREIGN KEY (episode_id) REFERENCES episode (episode_id) ON DELETE CASCADE
);

INSERT INTO watchtime (episode_id, percentage_watched, stopped_time, tenant_id)
SELECT episode_id, percentage_watched, stopped_time, ?
FROM episode_old;

DROP TABLE episode_old;