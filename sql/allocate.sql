START TRANSACTION;
SELECT * FROM gs_block_sequence WHERE name = ? FOR UPDATE;
UPDATE gs_block_sequence SET value = value + ? WHERE name = ?;
SELECT * FROM gs_block_sequence WHERE name = ?;
COMMIT;
