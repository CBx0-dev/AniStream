CREATE TABLE profile_new
(
    profile_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid             TEXT UNIQUE NOT NULL,
    name             TEXT        NOT NULL,
    background_color TEXT        NOT NULL,
    eye              TEXT        NOT NULL,
    mouth            TEXT        NOT NULL,
    theme            TEXT        NOT NULL,
    lang             TEXT        NOT NULL,
    tos_accepted     BOOLEAN     NOT NULL,
    sync_catalog     BOOLEAN     NOT NULL
);

INSERT INTO profile_new (profile_id, uuid, name, background_color, eye, mouth, theme, lang, tos_accepted, sync_catalog)
SELECT profile_id,
       uuid,
       name,
       background_color,
       eye,
       mouth,
       theme,
       lang,
       tos_accepted,
       false
FROM profile;

DROP TABLE profile;

ALTER TABLE profile_new
    RENAME TO profile;