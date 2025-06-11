/**
 * @file gameplay-model-test.js
 * @description Tests for the gamePlayModel class using an in-memory database.
 */

const assert = require('assert');
const GamePlayModel = require('../models/gamePlayModel');
const { connectTestDatabase } = require('../test-database');

describe('GamePlayModel Tests', function() {
  let db;
  let gameplayModel;

  /**
   * Sets up the in-memory test database and inserts required sample data
   * as the gameplay model requires player and game-definition data first. 
   */
  before(function() {
    db = connectTestDatabase();
    gameplayModel = new GamePlayModel(db);

    // Player model data
    const insertPlayer = db.prepare(
      `INSERT INTO Players (username, email, created_at) VALUES (?, ?, datetime('now'))`
    );
    insertPlayer.run('player1', 'player1@test.com');
    insertPlayer.run('player2', 'player2@test.com');
    // Game definition model data
    const insertGameDef = db.prepare(
      `INSERT INTO GameDefinitions (name, description, difficulty) VALUES (?, ?, ?)`
    );
    insertGameDef.run('Game 1', 'Description of Game 1', 5);
    insertGameDef.run('Game 2', 'Description of Game 2', 8);
  });

  /**
   * Closes the in-memory test database.
   */
  after(function() {
    db.close();
  });

  /**
   * @test that a new gameplay record is created successfully.
   */
  it('should create a new gameplay record', function() {
    const record = gameplayModel.create(1, 1, 100, 'win');
    assert.ok(record.id, 'Record should have an id');
    assert.strictEqual(record.game_definition_id, 1);
    assert.strictEqual(record.player_id, 1);
    assert.strictEqual(record.score, 100);
    assert.strictEqual(record.outcome, 'win');
    assert.ok(record.completed_at, 'Record should include a completed_at timestamp as we have in gameplay');
  });

  /**
   * @test that a gameplay record can be read by its id.
   */
  it('should read a gameplay record by id', function() {
    const record = gameplayModel.create(1, 1, 200, 'lose');
    const fetched = gameplayModel.readById(record.id);
    assert.ok(fetched, 'Record should be fetched');
    assert.strictEqual(fetched.game_play_id, record.id, 'Fetched id and record id should be the same');
    assert.strictEqual(fetched.score, 200);
  });

  /**
   * @test that a gameplay record is updated successfully.
   */
  it('should update a gameplay record', function() {
    const record = gameplayModel.create(2, 2, 300, 'win');
    const newScore = 250, newOutcome = 'loss', newCompletedAt = new Date().toISOString();
    gameplayModel.update({ game_play_id: record.id, score: newScore, outcome: newOutcome, completed_at: newCompletedAt });
    const updated = gameplayModel.readById(record.id);
    assert.strictEqual(updated.score, newScore);
    assert.strictEqual(updated.outcome, newOutcome);
    assert.strictEqual(updated.completed_at, newCompletedAt);
  });

  /**
   * @test that a gameplay record is deleted successfully.
   */
  it('should delete a gameplay record', function() {
    const record = gameplayModel.create(1, 2, 290, 'draw');
    assert.ok(gameplayModel.readById(record.id), 'Record should exist before deletion');
    gameplayModel.delete(record.id);
    assert.strictEqual(gameplayModel.readById(record.id), undefined, 'Record should now be deleted');
  });

  /**
   * @test that all gameplay records can be deleted individually like a clear method.
   */
  it('should delete everything from the in-memory record like a clear method', function() {
    gameplayModel.create(1, 1, 100, 'win');
    gameplayModel.create(1, 2, 200, 'loss');
    const records = db.prepare('SELECT game_play_id FROM GamePlays').all();
    records.forEach(record => {
      gameplayModel.delete(record.game_play_id);
    });
    const remainingRecords = db.prepare('SELECT * FROM GamePlays').all();
    assert.strictEqual(remainingRecords.length, 0, 'All gameplay records should be deleted');
  });

  /**
   * @test that a player's whole gameplay record are read correctly.
   */
  it('should read player with their gameplay records', function() {
    gameplayModel.create(1, 1, 500, 'win');
    gameplayModel.create(2, 1, 200, 'lose');
    gameplayModel.create(1, 1, 350, 'draw');
    const results = gameplayModel.readPlayerWithGames(1);
    assert.ok(Array.isArray(results), 'Result should be an array');
    assert.strictEqual(results.length, 3, 
        'Player1 should have three gameplay records as it is strictly after delete2 test which clears the in-memory database for gameplays');
    results.forEach(record => {
      assert.strictEqual(record.player_id, 1);
      if (record.game_play_id) {
        assert.ok(record.game_name, 'Record should include game name');
      }
    });
  });
});
