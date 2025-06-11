#!/usr/bin/env bash

sqlite3 ./db.sqlite < sql/drop_tables.sql
sqlite3 ./db.sqlite < sql/create_tables.sql
sqlite3 ./db.sqlite < sql/create_data.sql
