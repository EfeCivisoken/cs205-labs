const Database = require('better-sqlite3');

let db = null; // Defined db at the top to prevent any kind of reference errors

// Function to create and return a database connection
function connectToDatabase() {
    if (!db) {
        db = new Database('./db.sqlite', { verbose: console.log });
        db.exec('PRAGMA foreign_keys = ON');
        console.log('Connected to the SQLite database.');
    }
    return db;
}

// Function to close the database connection
function closeDatabase() {
    if (db) {
        db.close();
        console.log('Database connection closed.');
        db = null;
    }
}

module.exports = { connectToDatabase, closeDatabase };
