const { connectToDatabase } = require('../database');

class GameDefinitionModel {
    constructor() {
        this.db = connectToDatabase();
    }
    
    create(name, description, difficulty) {
        const query = 'INSERT INTO GameDefinitions (name, description, difficulty) VALUES (?, ?, ?)';
        const stmt = this.db.prepare(query);
        const info = stmt.run(name, description, difficulty);
        return { id: info.lastInsertRowid, name, description, difficulty };
    }

    readById(game_definition_id) {
        const query = 'SELECT * FROM GameDefinitions WHERE game_definition_id=?';
        const stmt = this.db.prepare(query);
        return stmt.get(game_definition_id);
    }

    update(game) {
        const query = 'UPDATE GameDefinitions SET name=?, description=?, difficulty=? WHERE game_definition_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(game.name, game.description, game.difficulty, game.game_definition_id);
    }

    delete(game_definition_id) {
        const query = 'DELETE FROM GameDefinitions WHERE game_definition_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(game_definition_id);
    }
}


module.exports = GameDefinitionModel;