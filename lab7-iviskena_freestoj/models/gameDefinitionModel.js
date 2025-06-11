const { connectToDatabase } = require('../database');

class GameDefinitionModel {
    // The constructor may be called with a database object given, meant for testing purposes.
    constructor(db=undefined) {
        if(db === undefined)
            this.db = connectToDatabase();
        else
            this.db = db;
    }
    
    create(name, description, difficulty) {
        const query = 'INSERT INTO GameDefinitions (name, description, difficulty) VALUES (?, ?, ?)';
        const stmt = this.db.prepare(query);
        const info = stmt.run(name, description, difficulty);
        return { id: info.lastInsertRowid, name, description, difficulty };
    }

    // Obtains a record from the db by id
    readById(game_definition_id) {
        const query = 'SELECT * FROM GameDefinitions WHERE game_definition_id=?';
        const stmt = this.db.prepare(query);
        return stmt.get(game_definition_id);
    }

    // Updates a record based on an object
    update(game) {
        const query = 'UPDATE GameDefinitions SET name=?, description=?, difficulty=? WHERE game_definition_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(game.name, game.description, game.difficulty, game.game_definition_id || game.id);
    }

    // Removes record from database
    delete(game_definition_id) {
        const query = 'DELETE FROM GameDefinitions WHERE game_definition_id=?';
        const stmt = this.db.prepare(query);
        stmt.run(game_definition_id.id);
    }
}


module.exports = GameDefinitionModel;