CREATE PROCEDURE gs_block_sequence_inc (
   IN name_in VARCHAR(32),
   IN size_in INT
)
BEGIN
    UPDATE gs_block_sequence SET value = value + size_in WHERE name = name_in;
    SELECT * FROM gs_block_sequence WHERE name = name;
END
