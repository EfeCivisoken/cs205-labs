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
    constructor() {
        this.db = connectToDatabase();
    }

    getNumGames() {
        const query = 'select count(game_play_id) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    getNumGamePlayers() {
        const query = 'select count(distinct player_id) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    getAvgGamesPerPlayer() {
        const query = 'select avg(numGames) as num from (select count(game_play_id) as numGames from GamePlays group by player_id);';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    getTopGameScore() {
        const query = 'select max(score) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    getAvgGameScore() {
        const query = 'select avg(score) as num from GamePlays;';
        const stmt = this.db.prepare(query);
        return stmt.get()['num'];
    }

    getAvgGameScoreByPlayer(player_id) {
        const query = 'select avg(score) as num from GamePlays where player_id=?;';
        const stmt = this.db.prepare(query);
        return stmt.get(player_id)['num'];
    }
}

module.exports = ReportModel;
