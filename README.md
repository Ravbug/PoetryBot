# PoetryBot
A poetry writing bot! It reads websites, learns how to write based on those websites, and then uses that knowledge to generate unique poems! I created this bot for the June 2019 Discord Hack Week. I am no longer hosting this bot, so see below if you wish to run this bot.

![image of a poem](https://i.imgur.com/hZLFafM.png)

## Bot Commands
`poem [url]`

Generate a unique poem based on the text on a webpage. Urban Dictionary pages or websites with lots of text work well for this. Example: `poem https://wikipedia.org/wiki/Discord_(software)`

`poemsearch [space separated keywords]`

Searches Google for keywords, selects a URL, and then generates a poem based on that URL. Example: `poemsearch discord hack week`

`invite`

Get an invite link to invite me to your server

`help`

Show this list of commands in the chat.

`ping`

Get the bot's API latency.

`stats`

Get bot statistics

## How it works
The gist of PoetryBot's algorithm:
1. Load a webpage into a DOM. Then use Mozilla's [Readbility](https://github.com/mozilla/readability) article extraction code to get a plain text representation of the content of the webpage.
2. Create a Markov Chain of the writing on the page. The model is a dictionary, which contains words mapped to a Counted Set representing the words that follow that word, and their frequency. This allows PoetryBot to generate sentences that are more natural than those generated by treating all words equally.
3. Generate lines (strings of words of random length). These lines seed the generation of those that follow, to keep the poem on topic (for the most part)
4. Combine the lines and post to the chat for your enjoyment!

## Ok, but how can I play with it?
You can use this bot two ways:
1. Run the bot locally on your computer (information about how to do that below)
2. ~~[Invite the version I'm hosting, by clicking here.](https://discordapp.com/oauth2/authorize?client_id=592779132233056277&scope=bot&permissions=68672)~~ Hosted version has been shut down.

## How do I host this on my computer locally?
1. Download this repository as a zip (or clone with a shallow depth)
2. Create `env.json` with the following contents:
```json
{
  "TOKEN":"your discord bot token here",
  "CREATOR_ID":"your user ID here"
}
```
3. run `npm install` to install dependencies.
4. run `node server.js` to start the bot and the webserver. In the console the bot will print the webserver's port. In your web browser, navigate to `localhost://PORT_HERE` to see the webpage.

## Wow, this poem sucks!
Run the commands a few times! Not all websites are favorable for the algorithm, and sometimes the bot chooses a bad starting word on good websites. The bot caches where it can so subsequent runs should be faster.

## The ``poemsearch`` command doesn't work!
If the poemsearch command is failing, perform the following:
1. Follow the local hosting instructions
2. Set a breakpoint in the `resolve()` call inside the `urlToDOM()` function in `util.js`
3. Run the bot with a debugger attached. Have it run `poemsearch`. The breakpoint will trigger.
4. Use the debugger to get the contents of `data`. Copy all of it to your clipboard.
5. Paste into [CodeVisualizer](https://ravbug.github.io/codevisualizer). The render view should populate with the google search results page in your clipboard.
6. In CodeVisualizer, use your browser's find and replace to locate a link. Make sure you are clicked inside the code view.
7. Find the CSS class name of the a containing element to the anchor tag. For example, if the find-replace found

```html
...
<div class="kCrYT"><a href="/url?q=https://www.merriam-webster.com/dictionary"></a>
...
```
you would copy `kCrYT` to your clipboard. 

8. Scroll to `getUrls()` in `util.js`. Replace the assignment to `classname` with the value you just copied.
9. Restart the bot in the debugger. 
10. Set a breakpoint under the `getElementsByClassName()` call to ensure that this class query is working. 
11. Run another `poemsearch` query. Make sure that the resulting HTMLCollection on the breakpoint has elements.
12. Using the debugger, step to ensure `url` contains a correct URL.
13. Submit a pull request or open an Issue. Only open an Issue if you have completed the above!
