const express = require('express');
const path = require('path');
const app = express();

app.get('/image', (req, res) => {
  const image = req.query.img;
  res.sendFile(path.join(__dirname, 'images', image)); // Vulnerable!
});

app.listen(3000, () => console.log('http://localhost:3000'));

// Usage: 
// http://localhost:3000/image?img=cat.jpg