const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`<h1>Hello, ${name}</h1>`); // Vulnerable! Display user input as html
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

// Navigate to http://localhost:3000/?name=YOUR_NAME to test