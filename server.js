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

app.get("/status", (request, response) =>{
  //calculate uptime
  var diff = bot.client.uptime;
  var s = Math.floor(diff / 1000);
  var  m = Math.floor(s / 60);
  s = s % 60;
  var h = Math.floor(m / 60);
  m = m % 60;
  var d = Math.floor(h / 24);
  h = h % 24;
    
  var status = {
    "status":(!bot.client.ping)? "DOWN":"OK",
    "ping":bot.client.ping + "ms", 
    "servers":bot.client.guilds.size,
    "uptime":d + " days " + h + " hours " + m + " minutes " + s + " seconds",
    "uptime_milis":diff + "ms"
  }
  response.send(status);
});

// listen for requests
const listener = app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + listener.address().port);
});
