-- Eseguire tutto da root

-- PER INSTALLARE L'ESTENSIONE
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- SPECIFICARE L'HOST E PORTA PER I VARI AMBIENTI
CREATE SERVER sso_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'host', dbname 'name', port 'port');

CREATE USER MAPPING FOR CURRENT_USER
SERVER sso_server
OPTIONS (user 'user', password 'password');


CREATE FOREIGN TABLE foreign_office (
    name TEXT,
    description TEXT,
    short_description TEXT,
    code text,
    deleted bool,
    deleted_permanent bool
)
SERVER sso_server
OPTIONS (table_name 'office');

-- SCRIPT DI ROLLBACK
DROP FOREIGN TABLE IF EXISTS foreign_office;
DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER sso_server;
DROP SERVER IF EXISTS sso_server CASCADE;
DROP EXTENSION IF EXISTS postgres_fdw CASCADE;