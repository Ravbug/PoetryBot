const XMLHttpRequest = require('xhr2');

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