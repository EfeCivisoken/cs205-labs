const { connectToDatabase } = require('../database');

class PlayerModel {
    constructor() {
        this.db = connectToDatabase();
    }

    // Create a new player
    create(username, email) {
        const createdAt = new Date().toISOString(); // Set the current date and time in ISO format
        const query = 'INSERT INTO players (username, email, created_at) VALUES (?, ?, ?)';

        // The `prepare()` method compiles the SQL query, making it ready to execute.
        const stmt = this.db.prepare(query);

        // The `run()` method executes the prepared query, replacing the `?` placeholders with actual values.
        const info = stmt.run(username, email, createdAt);

        // Returning the new player data, including the generated player ID and the creation timestamp.
        return { id: info.lastInsertRowid, username, email, created_at: createdAt };
    }

    read_by_username(username) {
        const query = 'SELECT player_id, username, email, created_at FROM players WHERE username=?';
        const stmt = this.db.prepare(query);
//        stmt.run(username);
        return stmt.get(username);
    }

    read_by_id(id) {
        const query = 'SELECT player_id, username, email, created_at FROM players WHERE player_id=?';
        const stmt = this.db.prepare(query);
//        stmt.run(id);
        return stmt.get(id);
    }

    update(user) {
        const id = user.player_id;
        const query = `UPDATE players SET username=?, email=? WHERE player_id=?`
        ;

        const stmt = this.db.prepare(query);
        stmt.run(user.username, user.email, id);
    }

    delete(user) {
        const id = user.player_id;
        const query = 'DELETE FROM players WHERE player_id=?';

        const stmt = this.db.prepare(query);
        stmt.run(id);
    }
}

module.exports = PlayerModel;
