const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

app.listen(port, () => {
  console.log(`Test server listening at http://localhost:${port}`);
});