DECLARE @sqlStr VARCHAR(8000);
DECLARE @xmlContent XML;
DECLARE xmlcur CURSOR FOR 
---
-- SELECT statement to retrieve the required records to restore. Display just the XML column:
-- Base Template for SELECT Statement:

-- ==> SELECT Data_Org FROM dbo.AuditLog_Tbl WHERE Operation_Type = 'D'

-- update this statement to narrow down to just the records you want to restore
---
OPEN xmlcur;
FETCH NEXT FROM xmlcur INTO @xmlContent;
WHILE @@FETCH_STATUS = 0
BEGIN
SET @sqlStr = CAST(@xmlContent AS nvarchar(max));
PRINT @sqlStr;
FETCH NEXT FROM xmlcur INTO @xmlContent;
END
CLOSE xmlcur;
DEALLOCATE xmlcur;
