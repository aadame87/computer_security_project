var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-73159092-1']);
_gaq.push(['_trackPageview']);


(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var user_id = "kevin";
var tot_elements = 0;
var clickbaits = 0;
var cb_clicks = 0; 
var non_cb_clicks = 0; //If they click on link on no cb, it brings them to a knew page
var myID = user_id;
var pluginType = "clickthrough";

document.addEventListener('contextmenu', function(e){
  e.preventDefault();
  e.stopPropagation();
});

const facebook_clickbait = function(node) {

  const images = [...node.getElementsByClassName('fbUserContent')];
  
  images.forEach(function(el) {
    tot_elements++;
    var links = el.getElementsByClassName('mbs _6m6 _2cnj _5s6c');
    for (var i = 0; i < links.length; i++) {
    var link = (links[i].innerText);
	var hyperlink = links[i].firstChild.href;
  }
  
  const send_to_db_loads = function(clicked_url, clickbait, clickbaitiness, plugintype, hyperlink){

			var url = "https://1sclbvvtkj.execute-api.us-west-2.amazonaws.com/beta/linksloaded"
			var method = "POST";
			var postData = JSON.stringify({ "UserID": myID, "Title": clicked_url, "ClickBait": clickbait, "ClickBaitiness": clickbaitiness, "PluginType": plugintype, "Hyperlink": hyperlink});
			var async = true;
			var request = new XMLHttpRequest();
	
			request.onload = function () {
			   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
			   var data = request.responseText; // Returned data, e.g., an HTML document.
			}

			request.open(method, url, async);
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			request.send(postData);
	}
	
	const send_to_db_clicks = function(clicked_url, clickbait, numclicks, clickbaitiness, plugintype, isurl, hyperlink){
			var url = "https://1sclbvvtkj.execute-api.us-west-2.amazonaws.com/beta/linksclicked"
			var method = "POST";
			var postData = JSON.stringify({ "UserID": myID, "Title": clicked_url, "ClickBait": clickbait, "NumClicks": numclicks, "ClickBaitiness": clickbaitiness, "PluginType": plugintype, "URLClicked": isurl, "Hyperlink": hyperlink});
			var async = true;
			var request = new XMLHttpRequest();
			
			request.onload = function () {
			   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
			   var data = request.responseText; // Returned data, e.g., an HTML document.
			}

			request.open(method, url, async);
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			request.send(postData);
	}
var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (request.readyState === 4) {
          if (request.status === 200) {
              var data = JSON.parse(request.responseText);
              var clickbait = data.clickbaitiness;
			  
			  //adds loaded request
			  if (link != null){
				send_to_db_loads(link, "" + (clickbait >= 60), clickbait, pluginType, hyperlink);
              }
			  
              if(clickbait<60){
                if (el.getElementsByClassName('mbs _6m6 _2cnj _5s6c').length > 0) {
                  let html = "<ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#2ecc71;color:#fff;border-radius:5px'>👍 Not Clickbait</ul>";
                  el.insertAdjacentHTML('afterend', html);
                  el.addEventListener("click", function(){ non_cb_clicks++;console.log("non_cb_clicks = " + non_cb_clicks);});
                  var clickable_links = el.getElementsByTagName('div');
				  var clicks = 0;
                  for (var i = 0; i < clickable_links.length; i++) {
                    if (clickable_links[i].className == '_3x-2') {
                      console.log(clickable_links[i]);
                      clickable_links[i].addEventListener("click", function(){console.log("yatzee1");clicks++;send_to_db_clicks(link, "false", clicks, clickbait, pluginType, "true", hyperlink);});
                    }
                  }
                }
              }   
              else if(clickbait > 90){
                clickbaits++;
                let html = "<ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#F27935;color:#fff;border-radius:5px'>💁 This is Clickbait</ul>";
                el.insertAdjacentHTML('beforeend', html);
                var wrapper = document.createElement('div');
                wrapper.id = 'cb';
                el.insertBefore(wrapper, el.firstChild);
                wrapper.appendChild(el.firstChild.nextSibling);
                el.addEventListener("click", function(){ cb_clicks++;console.log("cb_clicks = " + cb_clicks);});
                var clickable_links = el.getElementsByTagName('div');
                for (var i = 0; i < clickable_links.length; i++) {
                    if (clickable_links[i].className == '_3x-2') {
                      console.log(clickable_links[i]);
                      clickable_links[i].addEventListener("click", function(){console.log("yatzee2"); send_to_db_clicks(link, "true", clicks+1, clickbait, pluginType, "true", hyperlink);});
                    }
                }
                var warning = el.getElementsByTagName('ul');
                var clicks = 0;
                    el.addEventListener("click",function(e){
                    if (clicks == 0) {
                      warning[0].innerHTML = "Are you sure?";
                      clicks++;
					  send_to_db_clicks(link, "true", clicks, clickbait, pluginType, "false", hyperlink);
                    } 
                    else if (clicks == 1) {
                      warning[0].innerHTML = "Positive?"
                      clicks++;
					  send_to_db_clicks(link, "true", clicks, clickbait, pluginType, "false", hyperlink);
                    }
                    else {
                      warning[0].innerHTML = "Clickbait now clickable"
                      wrapper.id = "clicked-through";
					  clicks++;
					  send_to_db_clicks(link, "true", clicks, clickbait, pluginType, "false", hyperlink);
                    }
                },false);
              }
              else {
                clickbaits++;
                let html = "<ul id='ct' style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#e67e22;color:#fff;border-radius:5px'>👻 "+clickbait+"% clickbait</ul>";
                el.insertAdjacentHTML('beforeend', html);
                var wrapper = document.createElement('div');
                wrapper.id = 'cb';
                el.insertBefore(wrapper, el.firstChild);
                wrapper.appendChild(el.firstChild.nextSibling);
                el.addEventListener("click", function(){ cb_clicks++;console.log("cb_clicks = " + cb_clicks);});
                var clickable_links = el.getElementsByTagName('div');
                for (var i = 0; i < clickable_links.length; i++) {
                    if (clickable_links[i].className == '_3x-2') {
                      console.log(clickable_links[i]);
                      clickable_links[i].addEventListener("click", function(){console.log("yatzee3"); send_to_db_clicks(link, "true", clicks+1, clickbait, pluginType, "true", hyperlink);});
                    }
                }
                var warning = el.getElementsByTagName('ul');
                var clicks = 0;
                el.addEventListener("click",function(e){
                    if (clicks == 0) {
                      warning[0].innerHTML = "Are you sure?";
                      clicks++;
					  send_to_db_clicks(link, "true", clicks, clickbait, pluginType, "false", hyperlink);
                    } 
                    else if (clicks == 1) {
                      warning[0].innerHTML = "Positive?"
                      clicks++;
					  send_to_db_clicks(link, "true", clicks, clickbait, pluginType, "false", hyperlink);
                    }
                    else {
                      warning[0].innerHTML = "Clickbait now clickable"
                      wrapper.id = "clicked-through";
					  clicks++;
					  send_to_db_clicks(link, "true", clicks, clickbait, pluginType, "false", hyperlink);
                    }
                },false);
              }
          }
      }
  };
  console.log("tot = " + tot_elements);
  console.log("cbs = " + clickbaits);
  console.log("cb_clicks = " + cb_clicks);
  console.log("non_cb_clicks = " + non_cb_clicks);
  request.open("GET", "https://clickbait-detector-engine.herokuapp.com/detect?headline="+link , true);
  request.send();
  });
};

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // ELEMENT_NODE
                facebook_clickbait(node);
            }
        });
    });
});

const config = { attributes: false, childList: true, characterData: false, subtree: true }

observer.observe(document.body, config);

facebook_clickbait(document.body);
