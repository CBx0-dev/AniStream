CREATE TABLE profile
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
)