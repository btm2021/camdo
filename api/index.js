const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(`Hello! Go to item`);
});

module.exports = app;