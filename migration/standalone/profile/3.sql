UPDATE profile SET tos_accepted = 1 WHERE tos_accepted IN ('true', 'True', 't', 'Y');
UPDATE profile SET tos_accepted = 0 WHERE tos_accepted IN ('false', 'False', 'f', 'N');

UPDATE profile SET sync_catalog = 1 WHERE sync_catalog IN ('true', 'True', 't', 'Y');
UPDATE profile SET sync_catalog = 0 WHERE sync_catalog IN ('false', 'False', 'f', 'N');