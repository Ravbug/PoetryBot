const bot = require('./bot.js')
const discord = require("discord.js");

//a table of executable functions and their triggers
// 'help' runs with either the string "help" or with no string
const functions = {
    "ping":{f:ping},"restart":{f:restart,level:2},
    "stats":{f:stats}, "help":{f:help}, "":{f:help},
    "about":{f:about},
    "invite":{f:invite}
}


/**
 * Executes a command with the provided syntax
 * @param {discord.Message} message message object to process
 * @param {string} content string containing only the command text
 * @returns {string} the synchronous result of the command
 */
function run(message,content){
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
                response = cmd.f(message,tokens.slice(1));
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
    return response;
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
    else if (message.channel.permissionsFor(message.member).has("MANAGE_GUILD")){
      return 1;
    }
    else{
      return 0;
    }
  }
