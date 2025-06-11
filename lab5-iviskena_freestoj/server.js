// Import the Express module, which is a framework for building web applications in Node.js.
const express = require('express');
const path = require('path');
const fs = require('fs');

// Function to generate a random name for new users.
function random_name() {
    const names = ['Charlie', 'Lucy', 'Linus', 'Franklin', 'Snoopy', 'Woodstock', 'Schroeder', 'Peppermint Patty', 'Marcy', 'Efe', 'John'];
    return names[Math.floor(Math.random() * names.length)];
}

let users = [];

// Load users from json file:
fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {  // Log error if there is one...
        console.error(err);
        return;
    }
    // Parse the JSON data
    const json = JSON.parse(data);
    // Get the users array from the JSON data
    users = json;
    console.log('Loaded users from file successfully!!');
} );

// Allow saving users back to the file:
function saveUsers() {
    fs.writeFile('users.json', JSON.stringify(users), [], (err)=>{
        if(err) console.log(err);
    })
}

// Predefined users
/* const users = [
    { id: 1, name: 'Alice', email: 'alice@company.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@company.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@company.com', age: 28 },
    { id: 4, name: 'David', email: 'david@company.com', age: 35 }
]; */

// Function to find a user by ID.
function getUserById(id) {
    id = parseInt(id); // Ensure ID is treated as an integer
    for (let i = 0; i < users.length; i++) {  // Linear search could be replaced with filter()
        if (users[i].id === id) return users[i];
    }
    return null;
}

// Create an instance of an Express application. This app object will be used to define routes and middleware.
const app = express();

// Define a constant for the port number on which the server will listen.
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use public folder for static content
app.use(express.static('public'));

// Load static index page:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route handler for GET requests to the URL ('/fruit').
app.get('/fruit', (req, res) => {
    // Render the 'fruit' template and pass an object with dynamic data.
    res.render('fruit', {
        name: 'Student', // A variable named 'name' with the value 'Student'.
        items: ['Apples', 'Bananas', 'Cherries'] // An array named 'items' containing a list of fruits.
    });
});

// Define a route handler for GET requests to the URL ('/users').
app.get('/users', (req, res) => {
    res.render('users', {
        users: users
    });
});

// Define a route handler for generating a new random user.
app.get('/genuser', (req, res) => {
    const new_id = users.length > 0 ? users[users.length - 1].id + 1 : 1; // Ensure ID increments correctly
    const new_name = random_name();
    const random_age = Math.floor(Math.random() * (45 - 20 + 1)) + 20; // Generate random age between 20 and 45

    users.push({ id: new_id, name: new_name, email: `${new_name.toLowerCase()}@company.com`, age: random_age });
    saveUsers();

    res.redirect('/users');
});


// Define a route handler for GET requests to the URL ('/user/:id').
app.get('/user/:id', (req, res) => {
    const user = getUserById(req.params.id);

    if (user) {
        res.render('user', { user: user });
    } else {
        res.sendFile(path.join(__dirname, 'public', 'notfound.html'));
    }
});

// Define a route handler for deleting users
app.get('/deluser/:id', (req, res) => {
    const user_specified = getUserById(req.params.id);

    if (user_specified) {
        // Use filter method to create a new array with all but the specified user
        users = users.filter((user) => user.id != user_specified.id);
        saveUsers();
        res.redirect(301, '/users');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'notfound.html'));
    }
});

// Start the server and make it listen on the specified port.
// Once the server starts, it logs a message to the console indicating where it is running.
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Define a route handler for GET requests to the '/timer' URL. 
app.get('/timer', (req, res) => { 
    // Redirect the client to 'productivity.html' when they visit '/timer'. 
    // The browser will receive an HTTP 302 (Found) response, which tells it to navigate to '/productivity.html'. 
    res.redirect('/productivity.html');
}); 

// Define a route handler for GET requests to the '/cryptid' URL. 
app.get('/cryptid', (req, res) => {
    // Redirect the client to 'cryptid.html' when they visit '/cryptid'. 
    // This means that if someone visits 'http://localhost:3000/cryptid', they will be taken to '/cryptid.html'. 
    res.redirect('/cryptid.html');
});