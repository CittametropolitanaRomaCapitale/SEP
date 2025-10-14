
-- Rollback
DROP PROCEDURE public.sync_ufficio_from_office();


-- Create
CREATE OR REPLACE PROCEDURE public.sync_ufficio_from_office()
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    -- Inserisci nuovi record
    INSERT INTO public.ufficio (id, cdr, cdr_code)
    SELECT 
        nextval('hibernate_sequence_pi'),
        name || ' - ' || short_description,
        code
    FROM foreign_office
    WHERE NOT EXISTS (
        SELECT 1 FROM public.ufficio u
        WHERE u.cdr_code = foreign_office.code
    )
	AND (foreign_office.deleted = false and foreign_office.deleted_permanent = false);

    -- Aggiorna i record esistenti
    UPDATE public.ufficio u
    SET 
        cdr = f.name || ' - ' || f.short_description,
        cdr_code = f.code
    FROM foreign_office f
    WHERE u.cdr_code = f.code
      AND u.cdr != f.name || ' - ' || f.short_description;

    -- Cancellazione degli uffici che sono stati eliminati (deleted o deleted_permanent)
	DELETE from public.ufficio u 
	WHERE u.cdr_code in (
		SELECT code 
		from foreign_office f
		where f.deleted = true or f.deleted_permanent = true
		);
END;
$procedure$
;
