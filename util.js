const XMLHttpRequest = require('xhr2');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//utility function to replace all instances of toReplace with replaceWith in the orig string.
function replaceAll(orig,toReplace,replaceWith){
  return orig.replace(new RegExp(toReplace, 'g'), replaceWith);
}
exports.replaceAll = replaceAll; 

/**
  * Removes the bot tag from the message
  * @param {string} str: string to process
  * @param {string} id: id to remove
  */
 function eraseBotTag(str,id){
    str = replaceAll(str,"<@" + id + ">","");
    str = replaceAll(str,"<@!" + id + ">","");
    return str.trim();
  }
exports.eraseBotTag=eraseBotTag;

/**
 * Loads a URL and returns the raw data
 * @param {string} theUrl: URL to load
 * @returns {Promise:resolve}: raw data from the request
 * @returns {Promise:reject}: error in the request
 */
function httpGetAsync(theUrl)
{
    return new Promise(function(resolve,reject){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        //time out after 5 seconds
        xmlHttp.timeout = 5000;
        xmlHttp.onerror = reject;
        xmlHttp.ontimeout = reject;
        xmlHttp.send(null);
    });
}
exports.httpGetAsync = httpGetAsync;


/**
 * Loads a URL and returns a JSDOM object
 * @param {string} url: URL to fetch
 */
function urlToDOM(url){
  return new Promise(async function(resolve,reject){
      try{
      var data = await httpGetAsync(url);
      }
      catch(e){reject()}
      //convert to a DOM
      resolve(new JSDOM(data));
  });
}
exports.urlToDOM = urlToDOM;

/**
 * Replaces tabs, newlines, or repeated spaces with a single space
 * @param {string} text Text to process
 * @returns {string} Text with all whitespace characters converted to a single space
 */
function removeRecurrentWhitespace(text){
  return text.replace(/  +|\t|\n/g,' ').replace(/  +/g, ' ').trim();
}
exports.removeRecurrentWhitespace = removeRecurrentWhitespace;


/**
 * Replaces tabs and repeated spaces with a single space
 * Replaces repeated newlines with a single newline
 * @param {string} text Text to process
 * @returns {string} 
 */
function fixDuplicatedWhitespace(text){
  return text.replace(/  +|\t+/g,' ').replace(/\n+/g,'\n').replace(/  +/g, ' ').trim();
}
exports.fixDuplicatedWhitespace = fixDuplicatedWhitespace;

/**
 * Returns a random element of an array
 * @param {array} arr: array to get element
 */
function randomElement(arr,start=0){
  let i = getRandom(start,arr.length);
  return arr[i];
}
exports.randomElement = randomElement;

/**
  * Returns a random number between min and max
  * @param {number} min the low bound for random
  * @param {number} max the high bound for random
  */
function getRandom(min, max){
	return parseInt(Math.random() * (max-min) + min);
}
exports.getRandom = getRandom;

/** 
 * @param {string} str string to process
 * @returns {string} `str` without punctuation symbols
 */
function removePunctuation(str){
  //remove punctuation
   return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\"']/g,"");
}
exports.removePunctuation=removePunctuation;


function toCapitalCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
exports.toCapitalCase = toCapitalCase;