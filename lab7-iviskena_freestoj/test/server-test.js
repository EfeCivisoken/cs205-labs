/**
 * @file server-test.js
 * @description Integration tests for Express server routes defined in server.js.
 * This file uses Supertest to ensure all key routes return the expected responses.
 */

const request = require('supertest');
const assert = require('assert');
const app = require('../server');  // This is the exported app from server.js 

describe('Express Server Routes', function() {

  /**
   * @test GET /
   * Verifies that the index page is served with status 200 and HTML content.
   */
  describe('GET /', function() {
    it('should return the index page with status 200', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  /**
   * @test POST /submit
   * Checks that form data is accepted and the confirmation message defined in server.js is returned.
   */
  describe('POST /submit', function() {
    it('should accept form data and return a confirmation message', function(done) {
      request(app)
        .post('/submit')
        .send({ name: 'Test User', email: 'test@example.com' })
        .expect(200)
        .expect('Data received!')
        .end(done);
    });
  });

  /**
   * @test GET /players
   * Checks that the players list view is rendered with HTML content.
   */
  describe('GET /players', function() {
    it('should render the players list view', function(done) {
      request(app)
        .get('/players')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  /**
   * @test GET /player/:id
   * Ensures that requesting a non-existent player returns a 404 error.
   */
  describe('GET /player/:id', function() {
    it('should return 404 when the specified player is not found', function(done) {
      request(app)
        .get('/player/9999')
        .expect(404)
        .end(done);
    });
  });

  /**
   * @test GET /player/:id (existing player)
   * Inserts a gameplay record to ensure the player exists, then retrieves the player's detail page.
   */
  describe('GET /player/:id (existing player)', function() {
    it('should render the player detail page when the player exists', function(done) {
      const dataInsert = {
        game_definition_id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        score: 100,
        outcome: 'win'
      };
      request(app)
        .post('/submitGame')
        .send(dataInsert)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          const playerId = res.body.player.player_id;
          request(app)
            .get('/player/' + playerId)
            .expect(200)
            .expect('Content-Type', /html/)
            .end(done);
        });
    });
  });


  /**
   * @test GET /efe_game
   * Confirms that the efe_game view is rendered with HTML content.
   */
  describe('GET /efe_game', function() {
    it('should render the efe_game view', function(done) {
      request(app)
        .get('/efe_game')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  /**
   * @test GET /joe_game
   * Confirms that the joe_game view is rendered with HTML content.
   */
  describe('GET /joe_game', function() {
    it('should render the joe_game view', function(done) {
      request(app)
        .get('/joe_game')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  /**
   * @test POST /submitGame
   * Validates that gameplay data is inserted and returns a success JSON response.
   */
  describe('POST /submitGame', function() {
    it('should insert gameplay data and return success JSON', function(done) {
      const dataInsert2 = {
        game_definition_id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        score: 100,
        outcome: 'win'
      };
      request(app)
        .post('/submitGame')
        .send(dataInsert2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          assert.strictEqual(res.body.success, true);
          assert.ok(res.body.player, 'Response should include player data');
          assert.ok(res.body.gamePlayId, 'Response should include gamePlayId');
          done();
        });
    });
  });

  /**
   * @test GET /leaderboard/:game
   * Ensures that the leaderboard view for a specific game is rendered with HTML content.
   */
  describe('GET /leaderboard/:game', function() {
    it('should render the leaderboard view for a specific game', function(done) {
      request(app)
        .get('/leaderboard/1')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  /**
   * @test GET /leaderboard/
   * Verifies that the overall leaderboard view is rendered with HTML content.
   */
  describe('GET /leaderboard/', function() {
    it('should render the overall leaderboard view', function(done) {
      request(app)
        .get('/leaderboard/')
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    });
  });

  /**
   * @test Unknown Route
   * Confirms that an unknown route returns a 404 error.
   */
  describe('Unknown Route', function() {
    it('should return 404 for an unknown route', function(done) {
      request(app)
        .get('/nonexistent')
        .expect(404)
        .end(done);
    });
  });
});
