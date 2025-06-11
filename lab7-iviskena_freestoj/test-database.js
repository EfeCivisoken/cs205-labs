// In-Memory Test Database

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function connectTestDatabase(createData=false) {
    // Create an in-memory database
    const db = new Database(':memory:');
    db.exec('PRAGMA foreign_keys = ON;');

    const sqlFilePath = path.join(__dirname, '.', 'sql', 'create_tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    db.exec(sql);

    if(createData) {  // Allow for populating the in-memory database with sample data
        const sqlFile2Path = path.join(__dirname, '.', 'sql', 'create_data.sql');
        const sql2 = fs.readFileSync(sqlFile2Path, 'utf8');
        db.exec(sql2);
    }

    console.log('In-memory test database initialized.');
    return db;
}

module.exports = { connectTestDatabase };
