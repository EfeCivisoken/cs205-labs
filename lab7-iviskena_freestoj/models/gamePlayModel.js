const { connectToDatabase } = require('../database');

class GamePlayModel {
    // The constructor may be called with a database object given, meant for testing purposes.
    constructor(db=undefined) {
        if(db === undefined)
            this.db = connectToDatabase();
        else
            this.db = db;
    }

    // Creates a new record in the database.
    // A "Completed At" datetime is generated upon running this and stored.
    create(game_definition_id, player_id, score, outcome) {
        const completed_at = new Date().toISOString();
        const query = 'INSERT INTO GamePlays (game_definition_id, player_id, score, outcome, completed_at) VALUES (?, ?, ?, ?, ?)';
        const stmt = this.db.prepare(query);
        const info = stmt.run(game_definition_id, player_id, score, outcome, completed_at);
        return { id: info.lastInsertRowid, game_definition_id, player_id, score, outcome, completed_at };
    }

    // Reads a record by id.
    readById(game_play_id) {
        const query = 'SELECT * FROM GamePlays WHERE game_play_id=?';
        const stmt = this.db.prepare(query);
        return stmt.get(game_play_id);
    }

    // Update a record from a modified object
    update(gamePlay) {
        const query = 'UPDATE GamePlays SET score=?, outcome=?, completed_at=? WHERE game_play_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(gamePlay.score, gamePlay.outcome, gamePlay.completed_at, gamePlay.game_play_id);
    }

    // Removes a record from the database with the same id as a given object
    delete(game_play_id) {
        const query = 'DELETE FROM GamePlays WHERE game_play_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(game_play_id);
    }
    // I added a helper method in order for us to easily fetch player, gameplay info etc.
    readPlayerWithGames(player_id) {
        const query = `
            SELECT Players.player_id, Players.username, Players.email, Players.created_at, 
                   GamePlays.game_play_id, GameDefinitions.name AS game_name, 
                   GamePlays.score, GamePlays.outcome, GamePlays.completed_at
            FROM Players
            LEFT JOIN GamePlays ON Players.player_id = GamePlays.player_id
            LEFT JOIN GameDefinitions ON GamePlays.game_definition_id = GameDefinitions.game_definition_id
            WHERE Players.player_id = ?`;
    
        console.log("Executing SQL Query for player:", player_id);  // Debugging log
        const results = this.db.prepare(query).all(player_id);
        console.log("Query Results:", results);  // Debugging log
        return results;
    }
    
    

    
}

module.exports = GamePlayModel;