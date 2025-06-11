const assert = require('assert');

const ReportModel = require('../models/reportModel');
const { connectTestDatabase } = require('../test-database');

describe('Report Model (Database Tests)', function() {
    let db;
    let playerModel;

    before(
        function() {
            db = connectTestDatabase(true);
            reportModel = new ReportModel(db);
        }
    );

    after(
        function() {
            db.close();
        }
    );

    it('should report num games', function() {
        assert.strictEqual(reportModel.getNumGames(), 6);
    });

    it('should report num players', function() {
        assert.strictEqual(reportModel.getNumGamePlayers(3), 4);
    });

    it('should report avg games per player', function() {
        assert.strictEqual(reportModel.getAvgGamesPerPlayer(), 1.5);
    });

    it('should report top game score', function() {
        assert.strictEqual(reportModel.getTopGameScore(), 31650);
    });

    it('should report avg game score by player', function() {
        assert.strictEqual(reportModel.getAvgGameScoreByPlayer(1), 2345);
        assert.strictEqual(reportModel.getAvgGameScoreByPlayer(2), 31650);
        assert.strictEqual(reportModel.getAvgGameScoreByPlayer(3), 31650);
    });

    it('should report leaderboard view', function() {
        const leaderboard = reportModel.getLeaderboardView();
        assert.strictEqual(leaderboard.length, 5);
        assert.strictEqual(leaderboard[1].high_score, 31650);
        assert.strictEqual(leaderboard[3].num_games, 2);
        assert.strictEqual(leaderboard[4].total_points, null);
    });

    it('should report leaderboard view, per-game', function() {
        const leaderboard = reportModel.getLeaderboardViewByGame(2);
        assert.strictEqual(leaderboard.length, 1);
        assert.strictEqual(leaderboard[0].high_score, 31650);
        assert.strictEqual(leaderboard[0].num_games, 1);
        assert.strictEqual(leaderboard[0].total_points, 31650);
    });


    it('should report total points per player', function() {
        assert.strictEqual(reportModel.getTotalPointsByPlayer(1), 4690);
    });

    it('should report total game points per player', function() {
        assert.strictEqual(reportModel.getTotalPointsByPlayerGame(1, 3), null);
        assert.strictEqual(reportModel.getTotalPointsByPlayerGame(1, 2), null);
        assert.strictEqual(reportModel.getTotalPointsByPlayerGame(1, 1), 4690);
    });

    it('should report num games per player', function() {
        assert.strictEqual(reportModel.getNumGamesByPlayer(1), 2);
    });
});