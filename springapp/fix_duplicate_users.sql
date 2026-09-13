-- Step 1: Keep only the latest row per username, delete all older duplicates
DELETE FROM user
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id
        FROM user
        GROUP BY username
    ) AS keep
);

-- Step 2: Verify no duplicates remain
SELECT username, COUNT(*) as count
FROM user
GROUP BY username
HAVING count > 1;
