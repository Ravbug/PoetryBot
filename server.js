// server.js
// where your node app starts

//If the bot is hosted locally, use env.json for process environment
//otherwise the env is loaded automatically by the host
if (process.env.TOKEN === undefined){
  process.env = require('./env.json');
}

// init project
const express = require('express');
const app = express();
const bot = require('./bot.js');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests
const listener = app.listen(process.env.PORT, function() {
  console.log('Listening on ' + listener.address().address + listener.address().port);
});
