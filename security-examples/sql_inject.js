const Database = require('better-sqlite3');
const readlineSync = require('readline-sync');

// Initialize database and seed with users
const db = new Database(':memory:');

db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);
  INSERT INTO users (username, password) VALUES ('admin', 'secret'), ('alice', '1234');
`);

// Vulnerable login function (returns true if user exists)
function login(username, password) {
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  const user = db.prepare(query).get();
  return Boolean(user); // Return true if a matching username and password are found?
}

console.log("Please log in:");

while (true) {
  const username = readlineSync.question('Username: ');
  const password = readlineSync.question('Password: ', { hideEchoBack: true });

  if (login(username, password)) {
    console.log(`Login successful! Welcome, ${username}.`);
    break; // Exit loop upon successful login
  } else {
    console.log('Login failed! Try again.\n');
  }
}