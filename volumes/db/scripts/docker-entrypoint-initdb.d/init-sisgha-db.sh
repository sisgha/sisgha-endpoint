#!/bin/bash
set -e



# psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER:-postgres}" --dbname "${POSTGRESQL_DATABASE:-sisgha}" <<-EOSQL

# -- CREATE USER docker;
#	-- CREATE DATABASE docker;
#	-- GRANT ALL PRIVILEGES ON DATABASE docker TO docker;

# -- CREATE ROLE authenticated;
# -- CREATE ROLE anon;

# EOSQL