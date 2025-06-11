const { connectToDatabase } = require('../database');

class GamePlayModel {
    constructor() {
        this.db = connectToDatabase();
    }

    create(game_definition_id, player_id, score, outcome) {
        const completed_at = new Date().toISOString();
        const query = 'INSERT INTO GamePlays (game_definition_id, player_id, score, outcome, completed_at) VALUES (?, ?, ?, ?, ?)';
        const stmt = this.db.prepare(query);
        const info = stmt.run(game_definition_id, player_id, score, outcome, completed_at);
        return { id: info.lastInsertRowid, game_definition_id, player_id, score, outcome, completed_at };
    }

    readById(game_play_id) {
        const query = 'SELECT * FROM GamePlays WHERE game_play_id=?';
        const stmt = this.db.prepare(query);
        return stmt.get(game_play_id);
    }

    update(gamePlay) {
        const query = 'UPDATE GamePlays SET score=?, outcome=?, completed_at=? WHERE game_play_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(gamePlay.score, gamePlay.outcome, gamePlay.completed_at, gamePlay.game_play_id);
    }

    delete(game_play_id) {
        const query = 'DELETE FROM GamePlays WHERE game_play_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(game_play_id);
    }
}

module.exports = GamePlayModel;