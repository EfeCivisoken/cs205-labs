const assert = require('assert');

const GameDefinitionModel = require('../models/gameDefinitionModel');
const { connectTestDatabase } = require('../test-database');

describe('GameDefinition (Database Tests)', function() {
    let db;
    let playerModel;

    before(
        function() {
            db = connectTestDatabase();
            gameDefinitionModel = new GameDefinitionModel(db);
        }
    );

    after(
        function() {
            db.close();
        }
    );

    it('should create a new game definition', function() {
        const name = 'My Awesome Game';
        const desc = 'Lots of inf0rmation & useful stuff here...';
        const diff = 12;
        const result = gameDefinitionModel.create(name, desc, diff);
        assert.strictEqual(result.name, name);
        assert.ok(result.id, 'New game def must have an id');
        assert.strictEqual(result.description, desc);
        assert.strictEqual(result.difficulty, diff);

        // Verify record in the DB
        const row = db.prepare('SELECT * FROM GameDefinitions WHERE game_definition_id = ?').get(result.id);
        assert.ok(row, 'Game def row should exist in the database');
        assert.strictEqual(row.name, name);
        assert.strictEqual(row.description, desc);
        assert.strictEqual(row.difficulty, diff);

        // Clean Up
        gameDefinitionModel.delete(result);
    });

    it('should delete definitions', function() {
        const definition = gameDefinitionModel.create('abc', 'abc123...', 3);

        // Verify record in the DB
        row = db.prepare('SELECT * FROM GameDefinitions WHERE game_definition_id = ?').all(definition.id);
        assert.strictEqual(row.length, 1, 'GameDefinition row should exist in the database');

        // Remove from DB
        gameDefinitionModel.delete(definition);

        // Verify record no longer exists in the DB
        row = db.prepare('SELECT * FROM GameDefinitions WHERE game_definition_id = ?').all(definition.game_definition_id);
        assert.strictEqual(row.length, 0, 'GameDefinition row should no longer exist in the database');
    });

    it('should not allow invalid game def creation', function() {
        const result = gameDefinitionModel.create('abc', 'example', 12);
        assert.strictEqual(result.name, 'abc');

        // Ensure that multiple users cannot be created with the same username
        assert.throws(function() {
            gameDefinitionModel.create('abc', '', 12);
        }, 'Should not be able to create a user with duplicate name');

        // Ensure that difficulty is taken as floating point
        const id = gameDefinitionModel.create('123', 'example', 12.2345654323).id;
        assert.strictEqual(gameDefinitionModel.readById(id).difficulty, 12.2345654323);

        // Clean Up
        gameDefinitionModel.delete(result);
    });

    it('should read game definitions by id', function() {
        const gd1 = gameDefinitionModel.create('abc', 'example', 12);
        const gd2 = gameDefinitionModel.create('abc123', 'example2', 12.1);

        const all_read = [
            gameDefinitionModel.readById(gd1.id),
            gameDefinitionModel.readById(gd2.id)
        ];

        assert.ok(all_read.length === 2, 'Two game definitions should be found.');

        assert.equal(gd1.name, all_read[0].name);
        assert.equal(gd2.name, all_read[1].name);

        assert.equal(gd1.description, all_read[0].description);
        assert.equal(gd2.description, all_read[1].description);

        assert.equal(gd1.difficulty, all_read[0].difficulty);
        assert.equal(gd2.difficulty, all_read[1].difficulty);

        // Clean Up
        gameDefinitionModel.delete(gd1);
        gameDefinitionModel.delete(gd2);
    });

    it('should be able to update game definitions', function() {
        const gd1 = gameDefinitionModel.create('abc', 'example', 12);
        const gd2 = gameDefinitionModel.create('abc123', 'example2', 12.1);

        gd1.name='hello!!';
        gd2.difficulty+=0.75;

        gameDefinitionModel.update(gd1);
        gameDefinitionModel.update(gd2);

        const all_read = [
            gameDefinitionModel.readById(gd1.id),
            gameDefinitionModel.readById(gd2.id)
        ];

        assert.ok(all_read.length === 2, 'Two game definitions should be found.');

        assert.equal(gd1.name, all_read[0].name);
        assert.equal(gd2.name, all_read[1].name);

        assert.equal(gd1.description, all_read[0].description);
        assert.equal(gd2.description, all_read[1].description);

        assert.equal(gd1.difficulty, all_read[0].difficulty);
        assert.equal(gd2.difficulty, all_read[1].difficulty);

        gd1.name = "a different name";
        assert.equal("hello!!", gameDefinitionModel.readById(gd1.id).name, "Should not store to database until calling update()");

        // Clean Up
        gameDefinitionModel.delete(gd1);
        gameDefinitionModel.delete(gd2);
    });
});
