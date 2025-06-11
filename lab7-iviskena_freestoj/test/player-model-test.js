const assert = require('assert');

const PlayerModel = require('../models/playerModel');
const { connectTestDatabase } = require('../test-database');

describe('PlayerModel (Database Tests)', function() {
    let db;
    let playerModel;

    before(
        function() {
            db = connectTestDatabase();
            playerModel = new PlayerModel(db);
        }
    );

    after(
        function() {
            db.close();
        }
    );

    it('should create a new player', function() {
        const username = 'john.doe23';
        const email = 'test@example.com';
        const result = playerModel.create(username, email);
        assert.strictEqual(result.username, username);
        assert.ok(result.player_id, 'New player must have an id');
        assert.strictEqual(result.email, email);

        // Verify record in the DB
        const row = db.prepare('SELECT * FROM players WHERE player_id = ?').get(result.player_id);
        assert.ok(row, 'Player row should exist in the database');
        assert.strictEqual(row.username, username);
        assert.strictEqual(row.email, email);
        assert.ok(row.created_at, 'CreatedAt timestamp should exist in the database');

        // Clean Up
        playerModel.delete(result);
    });

    it('should delete players', function() {
        const player = playerModel.create('abc', 'abc@123.org');

        // Verify record in the DB
        row = db.prepare('SELECT * FROM players WHERE player_id = ?').all(player.player_id);
        assert.strictEqual(row.length, 1, 'Player row should exist in the database');

        // Remove from DB
        playerModel.delete(player);

        // Verify record no longer exists in the DB
        row = db.prepare('SELECT * FROM players WHERE player_id = ?').all(player.player_id);
        assert.strictEqual(row.length, 0, 'Player row should no longer exist in the database');
    });

    it('should not allow invalid player creation', function() {
        const result = playerModel.create('username', 'abc@example.org');
        assert.strictEqual(result.username, 'username');

        // Ensure that multiple users cannot be created with the same username
        assert.throws(function() {
            playerModel.create('username');
        }, 'Should not be able to create a user with duplicate username');

        // Ensure that it works with a different user name
        const diffUname = playerModel.create('username1', '123@abc.com');
        assert.ok(diffUname);
        playerModel.delete(diffUname);  // (Clean up)

        // Ensure that multiple users cannot be created with the same email  
        assert.throws(function() {
            playerModel.create('username1', 'abc@example.org');
        }, 'Should not be able to create a user with duplicate email');

        // Clean Up
        playerModel.delete(result);
    });

    it('should read all players', function() {
        const pm1 = playerModel.create('john.smith123', 'a@b.com');
        const pm2 = playerModel.create('user.2', 'c@d.com');

        const all_read = playerModel.read_all();
        assert.ok(all_read.length === 2, 'Two players should be returned.');

        assert.equal(pm1.created_at, all_read[0].created_at, 'Player 1 creation should be in returned results');
        assert.equal(pm1.player_id, all_read[0].player_id, 'Player 1 id should be in returned results');
        assert.equal(pm1.username, all_read[0].username, 'Player 1 username should be in returned results');
        assert.equal(pm2.username, all_read[1].username, 'Player 2 should be in returned results');

        // Clean Up
        playerModel.delete(pm1);
        playerModel.delete(pm2);
    });

    it('should read players by username', function() {
        const pm1 = playerModel.create('john.smith123', 'a@b.com');
        const pm2 = playerModel.create('user.2', 'c@d.com');

        const all_read = [
            playerModel.read_by_username('john.smith123'),
            playerModel.read_by_username('user.2')
        ];

        assert.ok(all_read.length === 2, 'Two players should be found.');

        assert.equal(pm1.created_at, all_read[0].created_at, 'Player 1 created at should be in returned results');
        assert.equal(pm1.player_id, all_read[0].player_id, 'Player 1 id should be in returned results');
        assert.equal(pm1.username, all_read[0].username, 'Player 1 username should be in returned results');
        assert.equal(pm2.username, all_read[1].username, 'Player 2 should be in returned results');

        // Clean Up
        playerModel.delete(pm1);
        playerModel.delete(pm2);
    });

    it('should read players by id', function() {
        const pm1 = playerModel.create('john.smith123', 'a@b.com');
        const pm2 = playerModel.create('user.2', 'c@d.com');

        const all_read = [
            playerModel.read_by_id(pm1.player_id),
            playerModel.read_by_id(pm2.player_id)
        ];

        assert.ok(all_read.length === 2, 'Two players should be found.');

        assert.equal(pm1.created_at, all_read[0].created_at, 'Player 1 created at should be in returned results');
        assert.equal(pm1.player_id, all_read[0].player_id, 'Player 1 id should be in returned results');
        assert.equal(pm1.username, all_read[0].username, 'Player 1 username should be in returned results');
        assert.equal(pm2.username, all_read[1].username, 'Player 2 should be in returned results');

        // Clean Up
        playerModel.delete(pm1);
        playerModel.delete(pm2);
    });

    it('should be able to update players', function() {
        const pm1 = playerModel.create('john.smith123', 'a@b.com');
        const pm2 = playerModel.create('user.2', 'c@d.com');

        // Make a change to the username
        pm1.username = 'different_username123';
        playerModel.update(pm1);
        pm1.username = 'anotherDifferent_username123';
        playerModel.update(pm1);

        const all_read = [
            playerModel.read_by_id(pm1.player_id),
            playerModel.read_by_id(pm2.player_id)
        ];

        assert.ok(all_read.length === 2, 'Two players should be found.');

        assert.equal(pm1.created_at, all_read[0].created_at, 'Player 1 created at should be in returned results');
        assert.equal(pm1.player_id, all_read[0].player_id, 'Player 1 id should be in returned results');
        assert.equal(pm1.username, all_read[0].username, 'Player 1 username should be in returned results');
        assert.equal(pm2.username, all_read[1].username, 'Player 2 should be in returned results');

        pm1.username = "shouldNotBeStored_in_db";
        assert.equal("anotherDifferent_username123", playerModel.read_by_id(pm1.player_id).username, "Should not store to database until calling update()");

        // Clean Up
        playerModel.delete(pm1);
        playerModel.delete(pm2);
    });

});
