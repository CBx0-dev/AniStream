CREATE TABLE profile
(
    profile_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid             TEXT UNIQUE NOT NULL,
    name             TEXT UNIQUE NOT NULL,
    password         TEXT        NOT NULL,
    password_salt    TEXT        NOT NULL,
    background_color TEXT        NOT NULL,
    eye              TEXT        NOT NULL,
    mouth            TEXT        NOT NULL,
    theme            TEXT        NOT NULL,
    lang             TEXT        NOT NULL,
    tos_accepted     BOOLEAN     NOT NULL,
    dashboard_user   BOOLEAN     NOT NULL,
    client_user      BOOLEAN     NOT NULL
);

INSERT INTO profile (uuid, name, password, password_salt, background_color, eye, mouth, theme, lang, tos_accepted,
                     dashboard_user, client_user)
VALUES ('00000000-0000-0000-0000-000000000000', 'root', 'yqoCfv5UI0lR5Ppk2cSdy3o9CyAAFv4ZpGJNQSt+nPc=',
        'xVD5FfvPFaUoAUIG', '921AEE', 'happy', 'diagram', 'aniworld-dark', 'en', 0, 1, 0);