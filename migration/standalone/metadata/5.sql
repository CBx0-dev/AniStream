UPDATE genre_to_series
SET main_genre = 1
WHERE main_genre IN ('true', 'True', 't', 'Y');
UPDATE genre_to_series
SET main_genre = 0
WHERE main_genre IN ('false', 'False', 'f', 'N');

UPDATE genre_to_series
SET main_genre = 1
WHERE main_genre IN ('true', 'True', 't', 'Y');
UPDATE genre_to_series
SET main_genre = 0
WHERE main_genre IN ('false', 'False', 'f', 'N');

CREATE TABLE watchtime_new
(
    watchtime_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id         INTEGER          NOT NULL,
    percentage_watched INTEGER          NOT NULL,
    stopped_time       DOUBLE PRECISION NOT NULL,
    tenant_id          TEXT             NOT NULL,
    FOREIGN KEY (episode_id) REFERENCES episode (episode_id) ON DELETE CASCADE
);

INSERT INTO watchtime_new (episode_id, percentage_watched, stopped_time, tenant_id)
SELECT episode_id, percentage_watched, stopped_time, tenant_id
FROM watchtime;

DROP TABLE watchtime;

ALTER TABLE watchtime_new RENAME TO watchtime;
