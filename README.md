# PoetryBot
A poetry writing bot! It reads websites, learns how to write based on those websites, and then uses that knowledge to generate unique poems! I created this bot for the June 2019 Discord Hack Week. Visit the bot's website here: [https://poetrybot.glitch.me](https://poetrybot.glitch.me)

## How it works
The gist of PoetryBot's algorithm:
1. Load a webpage into a DOM. Then use Mozilla's [Readbility](https://github.com/mozilla/readability) article extraction code to get a plain text representation of the content of the webpage.
2. Create a model of the writing on the page. The model is a dictionary, which contains words mapped to a Counted Set representing the words that follow that word, and their frequency. This allows PoetryBot to generate sentences that are more natural than those generated by treating all words equally.
3. Generate lines (strings of words of random length). These lines seed the generation of those that follow, to keep the poem on topic (for the most part)
4. Combine the lines and post to the chat for your enjoyment!

## Ok, but how can I play with it?
You can use this bot two ways:
1. Run the bot locally on your computer (information about how to do that below)
2. [Invite the version I'm hosting, by clicking here:](https://discordapp.com/oauth2/authorize?client_id=592779132233056277&scope=bot&permissions=68608)

## How do I host this on my computer locally?
1. Download this repository as a zip (or clone with a shallow depth)
2. Create `env.json` with the following contents:
```json
{
  "TOKEN":"your discord bot token here",
  "CREATOR_ID":"your user ID here"
}
```
3. run `node server.js` to start the bot and the webserver. In the console the bot will print the webserver's port. In your web browser, navigate to `localhost://PORT_HERE` to see the webpage.
