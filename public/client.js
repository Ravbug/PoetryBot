// client-side js
// run by the browser each time view template loads

function getStatus(){
  httpGetAsync("http://"+window.location.host+"/status",
  function(data){
    data = JSON.parse(data);
    var status = document.getElementById("status");
    var str = "";
    for (var key of Object.keys(data)){
      str += "<b>" + key + "</b> " + data[key] + "<br>";
    }
    status.innerHTML = str;
  },
  function(err){
    console.error(err);
  });
}

getStatus();

/**
* Fetches the result from a server request in the background (Encouraged)
* -- Parameters --
* 	theUrl: the request URL to process
* 	callback: called upon completion of the request (or fail)
*/
function httpGetAsync(theUrl, callback,callbackError)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
		xmlHttp.onerror = callbackError;
    xmlHttp.send(null);
}