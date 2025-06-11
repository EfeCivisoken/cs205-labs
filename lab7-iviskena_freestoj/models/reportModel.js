/* Required report fields:
    1. Number of games played;
    2. Number of players who have played games.
    3. Average games played per player.
    4. Top game score.
    5. Average game score.
    6. Average score for a specific player.
*/

const { connectToDatabase } = require('../database');

class ReportModel {
    // The constructor may be called with a database object given, meant for testing purposes.
    constructor(db=undefined) {
        if(db === undefined)
            this.db = connectToDatabase();
        else
            this.db = db;
    }

    // Returns the total number of gameplays that have occurred globally
    getNumGames() {
        const query = 'select count(game_play_id) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    // Returns the number of players who have been active
    getNumGamePlayers() {
        const query = 'select count(distinct player_id) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    // Returns the average number of game plays per player
    getAvgGamesPerPlayer() {
        const query = 'select avg(numGames) as num from (select count(game_play_id) as numGames from GamePlays group by player_id);';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    // Returns the global high score
    getTopGameScore() {
        const query = 'select max(score) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    // Returns the global average score
    getAvgGameScore() {
        const query = 'select avg(score) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    // Returns the average score from all games played by a particular player
    getAvgGameScoreByPlayer(player_id) {
        const query = 'select avg(score) as num from GamePlays where player_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.get(player_id)['num'];
    }

    // Returns an ordered leaderboard for all games
    getLeaderboardView() {  // Player, number games, lifetime points, high score
        const query = 'select Players.player_id as id, username, count(distinct game_play_id) as num_games, sum(score) as total_points, max(score) as high_score from Players LEFT JOIN GamePlays ON GamePlays.player_id=Players.player_id group by Players.player_id order by high_score DESC;';
        // const query = 'select player_id, username, count(distinct game_play_id) as num_games, sum(score) as total_points, max(score) as high_score from Players LEFT JOIN GamePlays ON GamePlays.player_id=Players.player_id group by Players.player_id where Players.player_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.all();
    }

    // Returns an ordered leaderboard for a particular game
    getLeaderboardViewByGame(game_id) {  // Player, number games, lifetime points, high score
        const query = 'select Players.player_id as id, username, count(distinct game_play_id) as num_games, sum(score) as total_points, max(score) as high_score from Players LEFT JOIN GamePlays ON GamePlays.player_id=Players.player_id  WHERE game_definition_id=? group by Players.player_id order by high_score DESC;';
        // const query = 'select player_id, username, count(distinct game_play_id) as num_games, sum(score) as total_points, max(score) as high_score from Players LEFT JOIN GamePlays ON GamePlays.player_id=Players.player_id group by Players.player_id where Players.player_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.all(game_id);
    }

    // Returns total points accrued by a particular player
    getTotalPointsByPlayer(player_id) {
        const query = 'select sum(score) as num from GamePlays where player_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.get(player_id)['num'];
    }

    // Returns total points accrued by a player playing a particular game  
    getTotalPointsByPlayerGame(player_id, game_def_id) {
        const query = 'select sum(score) as num from GamePlays where player_id=? and game_definition_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.get(player_id, game_def_id)['num'];
    }

    // Returns the total number of games played by a particular player
    getNumGamesByPlayer(player_id) {
        const query = 'select count(distinct game_play_id) as num from GamePlays where player_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.get(player_id)['num'];
    }
}

module.exports = ReportModel;
