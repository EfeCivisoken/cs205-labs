// Import the Express module, which is a framework for building web applications in Node.js.
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

/********************************
 * Database Models
 */

const PlayerModel = require('./models/playerModel');
const ReportModel = require('./models/reportModel');
const GameDefinitionModel = require('./models/gameDefinitionModel');
const GamePlayModel = require('./models/gamePlayModel');

const playerModel = new PlayerModel();
const gamePlayModel = new GamePlayModel();
const reportModel = new ReportModel();
const gameDefinitionModel = new GameDefinitionModel();

/********************************
 * Express Setup
 */

// Create an instance of an Express application. This app object will be used to define routes and middleware.
const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view_templates'));

// Use public folder for static content
app.use(express.static('public'));


// Use body-parser middleware to parse URL-encoded and JSON data sent via POST requests.
// The { extended: false } option tells body-parser to use the classic encoding.
// !! It's important that these middlewares are defined BEFORE the routes.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgan logging middleware:

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))


/********************************
 * Page Routes
 */

// Load static index page:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/*
Define a POST route for the '/submit' URL.
This route will be triggered when the form in the HTML (located in the public
directory) is submitted.
*/
app.post('/submit', (req, res) => {
    const userData = req.body; // data sent from the frontend
    console.log('Received data:', userData);
    res.send('Data received!');
});

// Define route for player details
app.get('/player/:id', (req, res) => {
    try {
    
    
        const results = gamePlayModel.readPlayerWithGames(req.params.id);
    
        if (!results || results.length === 0) {
            return res.status(404).sendFile(path.join(__dirname, 'view_templates', 'notfound.html'));
        }
    
        // Extract player details from the first row
        const player = {
            player_id: results[0].player_id,
            username: results[0].username,
            email: results[0].email,
            created_at: results[0].created_at
        };
    
        // Extract games (ignore rows where game_play_id is null)
        const games = results.filter(row => row.game_play_id !== null).map(row => ({
            game_play_id: row.game_play_id,
            name: row.game_name,
            score: row.score,
            outcome: row.outcome,
            completed_at: row.completed_at
        }));
    
        res.render('player_detail', { player, games });
    } catch (error) {
        console.error("Error fetching player details:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Fixed the bug of putting no found before these! PLS DO NOT CHANGE.
app.get('/efe_game', (req, res) => {
    res.render('efe_game');  
  });

app.get('/joe_game', (req, res) => {
    res.render('joe_game');  
  });

  app.post('/submitGame', (req, res) => {
    const { game_definition_id, username, email, score, outcome } = req.body;
    try {
      // Check if a player with the given username exists
      let player = playerModel.read_by_username(username);
        if (!player) {
        playerModel.create(username, email);
        player = playerModel.read_by_username(username); // reads again 
        }

      
      // Now insert the gameplay data into the GamePlays table using the create() method.
      const result = gamePlayModel.create(game_definition_id, player.player_id, score, outcome);
      console.log("GamePlay inserted:", result);
      
      res.json({ success: true, player: player, gamePlayId: result.id });
    } catch (error) {
      console.error("Error inserting game play:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

// Serve player list route
app.get('/players', (req, res) => {
    const players = playerModel.read_all();
    players.forEach(player => {
        player['lifetime_games'] = reportModel.getNumGamesByPlayer(player['player_id'])
    });  
    res.render('player_list', {'players': players,});
});

app.get('/leaderboard/:game', (req, res) => {  // Todo: order by performance in game
    const players = reportModel.getLeaderboardViewByGame(req.params.game);
    res.render('leaderboard', {
        'players': players,
        'game':gameDefinitionModel.readById(req.params.game).name
    });
});

app.get('/leaderboard/', (req, res) => {  // Todo: order by overall performance
    const players = reportModel.getLeaderboardView();
    res.render('leaderboard', {
        'players': players,
        'game':false
    });
});

  

// Serve notfound.html for invalid routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'view_templates', 'notfound_general.html'));
});

// Start the server and make it listen on the specified port.
// Once the server starts, it logs a message to the console indicating where it is running.

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }
  // so that it exports the Express app instead of automatically starting the server as it is crucial for tests.
  module.exports = app;
  
