UPDATE genre_to_series SET main_genre = 1 WHERE main_genre IN ('true', 'True', 't', 'Y');
UPDATE genre_to_series SET main_genre = 0 WHERE main_genre IN ('false', 'False', 'f', 'N');

UPDATE genre_to_series SET main_genre = 1 WHERE main_genre IN ('true', 'True', 't', 'Y');
UPDATE genre_to_series SET main_genre = 0 WHERE main_genre IN ('false', 'False', 'f', 'N');