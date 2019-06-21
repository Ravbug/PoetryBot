// Import the discord.js module
const Discord = require('discord.js');
// Import the command handler
const commands = require('./commands.js');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  //log: username#NNNN logged in successfully
  console.log(client.user.username + "#" + client.user.discriminator + " logged in successfully.");
  //set playing status 
  client.user.setActivity("with words | Tag me!");
});


// Create an event listener for messages
client.on('message', message => {
  //don't respond to other bots (or self)
  if (message.author.bot){
    return;
  }
  
  // If the message contains the bot's tag (or simple ID)
  if (message.content.includes(client.user.id)) {
    
    //check current channel for send messages permissions, if they are not present, then don't process input
    if (!message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")){
      return;
    }
    
    //remove the bot's tag 
    //process commands
    message.channel.send('pong');
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.TOKEN);
