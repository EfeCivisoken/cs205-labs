const { connectToDatabase, closeDatabase } = require('./database');

const readlineSync = require('readline-sync');
const PlayerModel = require('./models/playerModel');
const ReportModel = require('./models/reportModel');
const GameDefinitionModel = require('./models/gameDefinitionModel');
const GamePlayModel = require('./models/gamePlayModel');

const helpText = "help          - displays this help text\n" +
    "quit          - exits\n" +
    "report        - Generates a report\n" +
    "ureport       - Generates a user-specific report\n" +
    "addplayer     - Adds a player\n" +
    "addgame       - Adds a game definition\n" +
    "playgame      - Records a game play\n";

const reportModel = new ReportModel();
const playerModel = new PlayerModel();
const gameDefinitionModel = new GameDefinitionModel();
const gamePlayModel = new GamePlayModel();

console.log('Games Database Explorer');
console.log('By Efe & Joseph');
console.log('=======================\n');

let command = "";
do {
    command = readlineSync.question(">> ");
    if (command == '') continue;

    if (command.indexOf('help') >= 0) {
        console.log(helpText);
        continue;
    }

    if (command.startsWith('report')) {
        console.log("# Games Played:    " + reportModel.getNumGames());
        console.log("# Players:         " + reportModel.getNumGamePlayers());
        console.log("Avg. Games/Player: " + reportModel.getAvgGamesPerPlayer());
        console.log("Top Game Score:    " + reportModel.getTopGameScore());
        console.log("Avg Game Score:    " + reportModel.getAvgGameScore());
    } else if (command.startsWith('ureport')) {
        const username = readlineSync.question("Username? ");
        const user = playerModel.read_by_username(username);
        if (user) {
            console.log(user);
            console.log("Avg Score: " + reportModel.getAvgGameScoreByPlayer(user['player_id']));
        } else {
            console.log("User not found.");
        }
    } else if (command.startsWith('addplayer')) {
        const username = readlineSync.question("Username? ");
        const email = readlineSync.question("Email? ");
        playerModel.create(username, email);
        console.log("Player added successfully.");
    } else if (command.startsWith('addgame')) {
        const name = readlineSync.question("Game Name? ");
        const description = readlineSync.question("Description? ");
        const difficulty = readlineSync.question("Difficulty (1-10)? ");
        gameDefinitionModel.create(name, description, difficulty);
        console.log("Game added successfully.");
    } else if (command.startsWith('playgame')) {
        const playerUsername = readlineSync.question("Player Username? ");
        const gameName = readlineSync.question("Game Name? ");
        const score = readlineSync.questionInt("Score? ");
        const outcome = readlineSync.question("Outcome? ");

        const player = playerModel.read_by_username(playerUsername);
        const game = gameDefinitionModel.readById(gameName);
        
        if (player && game) {
            gamePlayModel.create(game.game_definition_id, player.player_id, score, outcome);
            console.log("Game play recorded successfully.");
        } else {
            console.log("Invalid player or game.");
        }
    } else if (command == 'quit') {
        break;
    } else {
        console.log("Unrecognized Command.");
    }
} while (command != 'quit');

console.log("Exiting Games Database Explorer.");
closeDatabase();
