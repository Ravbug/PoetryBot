const bot = require('./bot.js')
const discord = require("discord.js");
const poetry = require('./poetry.js');
const util = require('./util.js');

//a table of executable functions and their triggers
// 'help' runs with either the string "help" or with no string
const functions = {
    "ping":{f:ping},"restart":{f:restart,level:2},
    "stats":{f:stats}, "help":{f:help}, "":{f:help},
    "about":{f:about},
    "invite":{f:invite},
    "poem":{f:poem},"purgecaches":{f:purgecaches,level:2}
}


/**
 * Executes a command with the provided syntax
 * @param {discord.Message} message message object to process
 * @param {string} content string containing only the command text
 * @returns {string} the synchronous result of the command
 */
function run(message,content){
    return new Promise(async function(resolve,reject){
      let response;
      let tokens = content.split(' ');
      //does the command exist?
      let cmd = functions[tokens[0]];
      if (cmd != undefined){
          //is the user authorized to run this command?
          let uAuthLevel = userAuthLevel(message);
          let cAuthLevel = (cmd.level == undefined) ? 0 : cmd.level;
          if (uAuthLevel >= cAuthLevel){
              //attempt to execute
              try{
                  response = await cmd.f(message,tokens.slice(1));
              }
              catch(e){
                  response = ":warning: Error executing command:\n```js\n" + e.toString()+ "\nExecuting: '" + content + "'```";
              }
          }
          //reject: unauthorized
          else{
              response = ":x: You do not have permission to run this command.";
          }
      }
      else{
          //reject: not found
          response = ":x: `" + tokens[0] + "` is not a recognized command. Say ``@" + bot.client.user.username + "#" + bot.client.user.discriminator + " help`` for a list of commands."
      }
      resolve(response);
  });
}
exports.run = run;

/**
 * Returns the authorization level of the caller.
 * @param {discord.Message} message caller message 
 * @returns {number} int indicating the permission level of the caller
 */
function userAuthLevel(message){
    if (message.author.id == process.env.CREATOR_ID){
      return 2;
    }
    else if (!message.channel.type === 'dm' && message.channel.permissionsFor(message.member).has("MANAGE_GUILD")){
      return 1;
    }
    return 0;
  }

/**
 * Returns the bot's ping and the sender's ping
 * @param {discord.Message} message Message object
 * @returns {string} string containing the two pings
 */
function ping(message){
    return "API response time: " + bot.client.ping + "ms\n`" + message.author.username + "`'s response time: " + message.author.client.ping + "ms";
}

/**
 * Returns an embed with bot statistics
 * @returns {object} embed with stats
 */
function stats(){
    //calculate uptime
    var diff = bot.client.uptime;
    var s = Math.floor(diff / 1000);
    var  m = Math.floor(s / 60);
    s = s % 60;
    var h = Math.floor(m / 60);
    m = m % 60;
    var d = Math.floor(h / 24);
    h = h % 24;
    return {embed: {
      color: 0x00AE86,
      author: {
        name: bot.client.user.username,
        icon_url: (bot.client.user.avatarURL !=undefined)? bot.client.user.avatarURL : bot.client.user.defaultAvatarURL
      },
      title: "**" + bot.client.user.username + "** Statistics",
      fields: [
        {
          name: "Ping",
          value: "API response time: " + bot.client.ping + " ms"
        },
        {
          name: "Total Servers:",
          value: "Servers: " + bot.client.guilds.size
        },
        {
          name: "Uptime",
          value: "Uptime: " + d + " days " + h + " hours " + m + " minutes " + s + " seconds\nTotal Miliseconds: " + diff
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: bot.client.user.avatarURL,
        text: "© RavbugAnimations"
      }
    }
  };
}


/**
 * Shuts down the bot
 * @param {discord.Message} message Message object (not used)
 */
function restart(message){
    console.error("//restart issued, stopping");
    message.channel.send(":repeat: Restarting...").then(function(){ process.exit(0);});
    return ":repeat: Restarting...";
}

/**
 * @returns A string and a URL to the bot's webpage
 */
function about(){
  return "Visit this URL to get information about the bot: https://poetrybot.glitch.me/";
}

/**
 * Update the &permissions query flag to add or remove permissions
 * @returns A URL to the bot, with suggested permissions
 */
function invite(){
  return "Invite link: https://discordapp.com/oauth2/authorize?client_id=" + bot.client.user.id + "&scope=bot&permissions=68608"
}

function help(){
  const embed = new discord.RichEmbed()
    .setTitle(bot.client.user.username + " Commands")
    .setColor(0x00AEFF)
    .setDescription(" Exclude [ or ] from your message.")
    .setThumbnail((bot.client.user.avatarURL !=undefined)? bot.client.user.avatarURL : bot.client.user.defaultAvatarURL)
    .setTimestamp()
    .addField("poem [url]","Generate a unique poem based on the text on a webpage.\nUrban Dictionary pages or websites with lots of text work well for this.",true)
    .addField("invite","Get an invite link for the bot.",true)
    .addField("help","Display this information",true)
    .addField("about","Get info about the bot",true)
    .addField("ping","Get the bot's API ping.",true)
    .addField("stats","Get bot statistics",true)
    return embed;
}

let poemQueue = new Set();

/**
 * Generates a poem with a given url
 * @param {discord.Message} message Caller's message object
 * @param {string[]} content [0] = webpage url 
 */
async function poem(message,content){
  //has this user already requested a poem?
  if (poemQueue.has(message.author.id)){
    return ["<@",message.author.id,"> You must wait for your previous request to complete."].join('');
  }
  poemQueue.add(message.author.id);

  //attempt to load the webpage, but abort if it takes longer than 5 seconds
  try{
    let poem = await util.asyncTimeout(10000,poetry.poem(content[0]));
    poemQueue.delete(message.author.id);
    return [poem,"\n\nRequested by <@",message.author.id,">, using <",content[0],">"].join('');
  }catch(e){
    poemQueue.delete(message.author.id);
    return [":x: <@",message.author.id,"> Unable to generate poem using url <", content[0],">. Check your spelling or try another URL. `http://` or `https://` is required for urls."].join('');
  }
}

/**
 * Purges cached data in poemQueue and the poetry model cache 
 */
function purgecaches(){
  poetry.cache = {};
  poemQueue = new Set();
  return ":white_check_mark: Reset poem model cache and poem queue";
}