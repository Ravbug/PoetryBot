// Import the discord.js module
const Discord = require('discord.js');
// Import the command handler
const commands = require('./commands.js');
const util = require('./util.js');

// Create an instance of a Discord client
const client = new Discord.Client();
exports.client = client;
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
client.on('message', async function(message){
  //don't respond to other bots (or self)
  if (message.author.bot){
    return;
  }
  
  // if channel is a DM, or If the message contains the bot's tag (or simple ID), and current channel has send messages permissions
  if (message.channel.type === 'dm' || (message.content.includes(client.user.id && message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")))) {
    
    //remove the bot's tag
    let content = util.eraseBotTag(message.content,client.user.id);
    //process commands
    let response = await commands.run(message,content);
    message.channel.send(response);
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.TOKEN);
