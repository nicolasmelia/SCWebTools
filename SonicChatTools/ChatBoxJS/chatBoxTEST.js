/* Use of this file without authorization can be punishable by law. SonicChat 2015.
 * Widget Version 0.21:2015-06-26
 * UI Altered By: NPM
 * Date: 2015-06-26
 */
 
// ****** Global Vars ******
var webSocket;

// Host Port and server address
var serverAddress = "ws://localhost"
var port = "50005";
var siteID = "1";
var siteName = "SonicChats.com";
// User connection ID
var connectionID = "";

// ****** COPY CODE FROM LIVE CHAT JS BELOW. TEST USES LOCALHOST!!! ******


var away = false; //True is system in in after hours
var initiatedChat = false; // set to true when client hits top of chat box
var dotTimer = null; // Timer used to display now typing(from host).
var nowTyping = false; // toggled every 3seconds to allow a message to be sent to server to show client is typing.

var chatBoxHtml =  "<style>" +
".blue {color: #d9eef7; background: #2A83FF;} " +
".blue:hover {background: #5ba0ff;}" +
".blue:active {color: #80bed6;background: -webkit-gradient(linear, left top, left bottom, from(#0078a5), to(#00adee));background: -moz-linear-gradient(top,  #0078a5,  #00adee);filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#0078a5', endColorstr='#00adee');}" +
".button:hover {text-decoration: none;}" +
".button:active {position: relative;top: 1px;}" +
".medium {font-size: 12px;margin:auto;display:block;outline: none;cursor: pointer;text-align: center;text-decoration: none;font: 14px/100% Arial, Helvetica, sans-serif;padding: .4em 1.5em .42em;text-shadow: 0 1px 1px rgba(0,0,0,.3); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2);} " +
".arrowImg { width: 15px!important; margin-right: 21px!important; margin-top: 3px!important; float: right!important;}" +
".chatTop { width: 100%!important; display: block!important; font-weight: 400!important; height: 35px!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; background-color: #3E3E3E!important; border-top-left-radius:.3em!important; border-top-right-radius:.3em!important;}" +
".chatTop:hover {background-color: #4F4F4F!important;}" +
"#ChatNameInput::-webkit-input-placeholder{color:#999!important;}" +
"#ChatContactInput::-webkit-input-placeholder{color:#999!important;}" +
"#chatMessage::-webkit-input-placeholder{color:#999!important;}" +
"#messageInput::-webkit-input-placeholder{color:#999!important;}" +
"</style>" +
	"<div style = '  width: 290px!important; important;  z-index: 100!important; border-top-left-radius:.4em!important; border-top-right-radius:.4em!important; padding-bottom:0px!important; margin: 0px 0px 0px 0px!important; position: fixed!important; bottom: 0px!important; right: 20px!important; background-color: #EAEAEA!important; box-shadow:0 .10em .5em rgba(0,0,0,.35)!important;'>" +
		"<div  id = 'chatTop' class = 'chatTop' onClick = 'startChat()'>" +
		"<p id = 'chatTopMessage' style = 'display: block!important; cursor:default!important;  -moz-user-select: none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none; user-select: none; letter-spacing: .04em!important;  line-height: 100%!important; border: 0px!important; font-size: 15px!important; color: #ffffff!important; width: 100%!important; font-family: Arial, Helvetica, sans-serif;important;  margin: 0px!important; text-align: top!important; padding-left: 11px!important; font-weight: 400!important; padding-top: 10px!important;'><span style = 'color: #64C7E7!important; font-weight: 600!important;  '>Chat With: </span>"+ siteName +"<img  id = 'chatArrow' class = 'arrowImg'  src = 'http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png'></p> " +
		"</div>" + 
		"<div  id = 'chatMain' style = 'display: none; margin: 6px 0px 0px 0px!important; height: 280px!  padding: 0px!important;'>" +  
		"<div  style = 'display: block!important; width: 95%!important; margin: 0 auto!important; padding:0px!important;'>" +
		"<div  id = 'chatBox' style = 'overflow-y: scroll!important;  margin: 0px!important; background-color: #ffffff!important; height: 200px!important; width: 99%!important;  border: 1px solid #A3A3A3!important; border-top-left-radius:.2em!important; border-top-right-radius:.2em!important;'>" + 
		"</div>" +
		"<input id = 'messageInput' type='text' placeholder='Type to Chat... (Enter to send)' style = 'font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 99%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 2px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important; background-color: #FFFFFF!important;  border-radius: 0px!important;'>" +
	     "<p style = ' display: block!important; line-height: 100%!important; border: 0px!important; margin:3px 0px 3px 0px!important; font-size: 13px!important; padding: 0px!important; color: grey!important; '>Powered by SonicChat&trade;</p>" +
		"</div>" +
		"</div>" +
	"</div>";
																										
$(document).ready(function() {
	var iOS = false, p = navigator.platform;
	if( p != 'iPad' || p != 'iPhone' || p != 'iPod' ){
		testActiveHost();
		$("body").append(chatBoxHtml);
		}	
});

// ****** Start chat with host on users demand******
function startChat() {
	// When a user wants to start a chat start a socket
	if (!initiatedChat && !away) {
		connectToHost(); 
	} 
	
	$('#chatTopMessage').html('<span style = "color: #64C7E7!important; font-weight: 600!important;  ">Chat With: </span>'+ siteName +'<img  id = "chatArrow"  class = "arrowImg"  src = "http://sonicchat.elasticbeanstalk.com/static/images/nav-down.png">');
	
	if ($('#chatMain').is(':visible')) {
		$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png');
		$('#chatMain').slideUp();
	} else {
		$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-down.png');
		$('#chatMain').slideDown();
	}
}

// ****** Following methods connect and interact with the server for WS ops******
function connectToHost() {	
	// Connect to the socket server
	webSocket = $.gracefulWebSocket(serverAddress + ":" + port);
	var establishConection = setInterval(function () {
		if (webSocket.readyState == 1) {
			
			// Client or re-establish has started chat
			initiatedChat = true;	
			
			// Kill this check timer
			clearInterval(establishConection);
				
			// allow this client to send and get messages
			sendAndRecieve();
				
			// After host accepts this client send request to establish proper client ID
			establishConectionInfo();
				
			displayBanner("Estimated Wait Time:","1 Min");
				
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
							
		}
	}, 400);	
				
	// When the host (Server) disconnects show the user a message
	var checkConnection = setInterval(function () {
		if ((webSocket.readyState == 2 || webSocket.readyState == 3)) {
			// Nothing for now
			clearInterval(checkConnection); // Stop timer
		}
	}, 2500);	
}
	
function parseNewConnectionInformation(messageFromServer){
	try {
		var connectionMessageArray = messageFromServer.split(":");
		if (connectionMessageArray[0] == "CONNECTION INFORMATION") {
			connectionID = connectionMessageArray[1];
			setCookie("connectionID",connectionID,1)
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

function establishConectionInfo() {
	connectionID = getCookie("connectionID");
	if (connectionID != ""){
		// Send REESTABLISH message of, connectionType -  clientID - CurrentPage - 
		webSocket.send("CONNECTION INFORMATION:REESTABLISH:" + connectionID + ":" + siteID + "::" + window.location.href);
		return true;
	} else if (connectionID == "" && initiatedChat) {
		webSocket.send("CONNECTION INFORMATION:ESTABLISH:" + siteID + "::" + window.location.href);
		return true;
	} else {
		return false;
	}
}

function parseHistory(message) {
	var messages = message.split("%:%");
	 for(var i=1; i < messages.length; i++) {
		var who = messages[i].split("/");
		if (who[0] == "H") { // Host message
			var hostMessage = who[1].split(":");
			appendMessageIn(hostMessage[0], hostMessage[1]);
		} else if (who[0] == "C") { // Client message
			var clientMessage = who[1].split(":");
			appendMessageOut(clientMessage[1]);
		}
	}
	$('#chatMain').css("display","block"); // display chat box
	$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-down.png');
	$('#chatBox').scrollTop($('#chatBox').prop("scrollHeight"));
}

// ****** Following methods are for sending and receiving data from host******
function sendAndRecieve(){
	// This sends messages
	$("#messageInput").keyup(function(event){
		if(event.keyCode == 13){ // Key code for enter button
			if ($('#messageInput').val().replace(" ", "").trim().length > 1) {
				sendMessage($('#messageInput').val());
				appendMessageOut($('#messageInput').val());
				$('#messageInput').val("");
			} else {
				$('#messageInput').val("");
			}
		}
	}); 
	
	// This looks for messages
	webSocket.onmessage = function (event) {
		var messageFromServer = event.data;  
		if (connectionID != "") { 
			var message = messageFromServer.split(":");
			if (message[0] == "!HISTORY!") {
				parseHistory(messageFromServer);
			} else if(message[0] == "!TYPING!") {
				displayNowTyping(true);
			} else {
				appendMessageIn(message[0], message[1]);
			}

		} else {
			// Get client ID from message. This is a new socket connection
			parseNewConnectionInformation(messageFromServer);
		}
	}
	
	// Onkey press send a message to socket to let host know client it typing
	$("#messageInput").keypress(function(){
		if (nowTyping == false) {
			nowTyping = true;
			sendMessage("!TYPING!");
			var typingTimer = setInterval(function () {
				nowTyping = false;
				clearInterval(typingTimer); 
			}, 3000);
		}
	});
}
	
function sendMessage(message) {
	if (webSocket.readyState == 1 && message != "") {
		webSocket.send(connectionID + ":" + message);
	}
}

function appendMessageIn(name, message) {
	// Message from host appended to chat box
	displayNowTyping(false);
	$('#waitingText').html("<span style = 'font-weight: 550!important; font-family: Arial, Helvetica, sans-serif!important;  color: #616161!important; margin: 0px!important; padding: 0px!important; font-size: 15px!important;'>Now chatting with </span><span style = 'font-weight: 500!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important; color: #616161!important;'>" + name + "</span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 5px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 5px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'>");	
	$('#chatBox').append('<p style = "font-family: Arial, Helvetica, sans-serif;important; font-weight: 400!important;  margin: 3px 3px 6px 5px!important; color: #3c3c3c!important;  font-size: 14px!important; line-height: 100%!important; "><span style = "color: #BF0000!important; font-weight: 600!important;">'  + name + ':</span>' + message + '</p>');
	$('#chatBox').scrollTop($('#chatBox').prop("scrollHeight"));
}

function appendMessageOut(message) {
	// Message being sent to host from client append to chat box
	// If now typing is being displayed
	var text1 = '<p style = "font-family: Arial, Helvetica, sans-serif;important; font-weight: 600!important;  margin: 3px 3px 6px 5px!important; color: #009ac7!important; font-size: 14px!important; line-height: 100%!important; color: #009ac7!important; ">You:<span style = "font-weight: 400!important; color: #222222!important;"> ' + message + '</p>'
	if ($("#typingP").length) {
		$('#typingP').before(text1);
	} else {
		$('#chatBox').append(text1);
	}
	$('#chatBox').scrollTop($('#chatBox').prop("scrollHeight"));
}


// ****** Following methods change and add display elements to the chat box******
function displayNowTyping(show){
	if (show && dotTimer == null) {
		$('#chatBox').append('<p id = "typingP" style = "font-family: Arial, Helvetica, sans-serif;important; font-weight: 600!important;  margin: 3px 3px 6px 5px!important; color: #949494!important; font-size: 14px!important; line-height: 100%!important;"> </p>');
	
		// Change text dots(...) per second to show now typing...
		var dots = ".";
		var displayCount = 0; // counts how many times this blinks a dot
		dotTimer = setInterval(function () {
			
			$("#typingP").text("Typing" + dots);		
			$('#chatBox').scrollTop($('#chatBox').prop("scrollHeight"));

			switch (dots) {
			case ".": dots = "..";
				break;
			case "..": dots = "...";
				break;
			case "...": dots = "";
				break;
			default: dots = ".";
			}
			
			displayCount++;	
			
			if (displayCount > 15) {
				clearInterval(dotTimer); // end the timer
				dotTimer = null;
				$("#typingP").remove();
			}
		}, 400);
		
	} else if ($("#typingP").length && !show) {//Test whether the typingP ID exist.
		clearInterval(dotTimer); // end the timer
		dotTimer = null;
		$("#typingP").remove();
		$('#chatBox').scrollTop($('#chatBox').prop("scrollHeight"));
	}
}

function displayBanner(message, messageSmall, color, size) {
	if (color == "") {
		color = "#616161";
	}
	if (size == ""){
		size = "15px";
	}
	if ($('#waitingText').length == 0) {
		$('#chatBox').append("<div id = 'waitingText' style = 'font-color: #000000!important;  line-height: 105%!important; border: 0px!important; height: 21px!important; margin-top: 8px!important; margin-bottom: 2px!important;  font-family: Arial, Helvetica, sans-serif!important; padding: 0px!important; margin-bottom: 7px!important; font-weight: 600!important; text-align: center!important; font-size: 14px!important;'><span style = 'font-weight: 550!important; font-family: Arial, Helvetica, sans-serif!important;  color: #616161!important; margin: 0px!important; padding: 0px!important; font-size: 15px!important;'>" + message+ "</span><span style = 'font-weight: 500!important; color: #616161!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important;'> " + messageSmall + "</span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 5px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 5px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'></div>");
	} else {
		$('#waitingText').html("<span style = 'font-weight: 600!important; font-family: Arial, Helvetica, sans-serif!important; color:" + color + "!important; margin: 0px!important; padding: 0px!important; font-size:" + size + "!important;'>" + message + "</span> <span style = 'font-weight: 500!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important;'> " + messageSmall + "</span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 5px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 5px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'>");	
	}
}

function displayAway() {
		var awayAppend = "<div  id  = 'chatMessageBlock' style = '   width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: block; '>" + 
				"<input id = 'ChatNameInput' type='text' placeholder='Your Name' style = ' font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 0px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'> " +
				"<input id = 'ChatContactInput' type='text' placeholder='Your Email' style = '  font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'>" + 
				"<textarea id = 'chatMessage' placeholder='Leave a Message...' style = '  width: 100%; height: 30%;important; resize: none; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 50px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important; '></textarea>" +
				"<span onClick = 'sendAfterHourMessage()'class='blue medium'>Send Message</span>" +  
			"</div>" +
			"<div id = 'messageSentBlock' style = '  display: none;  width: 95%;important; padding-top: 2px;important; margin: auto;important;'>" +
				"<div style = '  background-color:#F9F9F9;important; height: 60px!important;   overflow x: auto!important;  overflow y: auto!important;  width: 95%!important;  margin-top: 5px!important;  margin-left:4px!important;   border: 1px solid #A3A3A3!important;  padding: 3px!important;'> " +
					"<p id = 'ChatMessageName' style = '  font-size: 14px!important;  margin-bottom: 12px!important; margin-top: 8px!important;  color: #64C7E7!important;   line-height: 90%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #4D4D4D;important; '></p>" + 
					"<p style = '   font-size: 14px!important;  font-family: Arial, Helvetica, sans-serif;important; color: #64C7E7!important;  font-style: normal!important; margin-top: -5px!important; line-height: 90%!important; margin:-bottom: 5px;important; color: #4D4D4D;important;'>Your message as been sent.</p>" +
				"</div> <br>" +
			"</div> ";
			
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "After Hours :(");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("After Hours Support" , "", "", "");
			$('#chatBox').append(awayAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			away = true;
}

// ******** COOKIE FUNCTIONS ********
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// ******** FORM MESSAGE FUNCTIONS ********
function sendAfterHourMessage() {
	if ($("#ChatContactInput").val().indexOf("@") != -1 && $("#ChatContactInput").val() != ""){
	 var data={name:$("#ChatNameInput").val(), contact:$("#ChatContactInput").val(), message:$("#chatMessage").val()};
			$.ajax({
				url: "http://sonicchat.elasticbeanstalk.com/dataAccess/recieveAwayMessage",
				dataType: 'jsonp',
				crossDomain:true,
				jsonpCallback: "jsonCallbackAwayMessage",
				data: data,
				scriptCharset: 'UTF-8',
				  success: function(data) {
					//Nothing as of now
			}});
			
		$('#chatMessageBlock').slideUp();
		$('#messageSentBlock').slideDown();
		displayBanner("After Hours Support" , "", "", "");
		//$('#waitingText').html("<span style = 'font-weight: 600!important; font-family: Arial, Helvetica, sans-serif!important;  color: #616161!important; margin: 0px!important; padding: 0px!important; font-size: 15px!important;'>After Hours Support</span> <span style = 'font-weight: 500!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important;'></span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 5px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 5px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'>");	
		if ($('#ChatNameInput').val() != "") {
		$('#ChatMessageName').html("Thank you, " + $('#ChatNameInput').val());
		} else {
		$('#ChatMessageName').html("Thank you, valued customer!");
		}	
	return true;
	} else {
		displayBanner("*Please use a valid email address", "",  "#FF0000", "12px");
	}
}

function jsonCallbackAwayMessage() {
// Call back function from sendAfterHourMessage() if SUCCESS
}


// ******** CHECKS TO SEE IF A HOST IS ACTIVE FOR THE SITE ********
function testActiveHost() {
	var helpTimer = setInterval(function () {
		if (!$('#chatMain').is(':visible')) {
			$('#chatTopMessage').html('<span style = "color: #64C7E7!important; font-weight: 600!important; ">Need Help?</span></b> Click to chat! <img  id = "chatArrow"  class = "arrowImg"  src = "http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png">');
		}
			clearInterval(helpTimer); // end the timer
	}, 10000);
	
	if (!away) {
		// Function is dedicated to see if services is in after hours and/or there are even an active host, 
			$.ajax({
				  url: "http://sonicchat.elasticbeanstalk.com/DataAccess/testHostActive/" + siteID,
				  dataType: 'jsonp',
				  crossDomain:true,
				   jsonpCallback: "jsonCallback",
				  scriptCharset: 'UTF-8',
				  success: function(data) {
					//alert(result[0].description);
			}});						
	}
}

\
function jsonCallback(data) {
var testVal = data.result;
	if (testVal == "TRUE") {
		if (getCookie("connectionID") != "") {
			connectToHost(); 
		}
	} else if(testVal == "FALSE") {
		displayAway();
	} else {
	//No response from server
	}
}


 // ******** 3ed party library support below. When updating or adding new libraries always check IE support! ********
 // ******** WebSocket with graceful degradation - jQuery plugin VERSION 0.1 ********
(function($){$.extend({gracefulWebSocket:function(url,options){this.defaults={keepAlive:false,autoReconnect:false,fallback:true,fallbackSendURL:url.replace('ws:','http:').replace('wss:','https:'),fallbackSendMethod:'POST',fallbackPollURL:url.replace('ws:','http:').replace('wss:','https:'),fallbackPollMethod:'GET',fallbackOpenDelay:100,fallbackPollInterval:3000,fallbackPollParams:{}};var opts=$.extend({},this.defaults,options);function FallbackSocket(){var CONNECTING=0;var OPEN=1;var CLOSING=2;var CLOSED=3;var pollInterval;var openTimout;var fws={readyState:CONNECTING,bufferedAmount:0,send:function(data){var success=true;$.ajax({async:false,type:opts.fallbackSendMethod,url:opts.fallbackSendURL+'?'+$.param(getFallbackParams()),data:data,dataType:'text',contentType:"application/x-www-form-urlencoded; charset=utf-8",success:pollSuccess,error:function(xhr){success=false;$(fws).triggerHandler('error');}});return success;},close:function(){clearTimeout(openTimout);clearInterval(pollInterval);this.readyState=CLOSED;$(fws).triggerHandler('close');},onopen:function(){},onmessage:function(){},onerror:function(){},onclose:function(){},previousRequest:null,currentRequest:null};function getFallbackParams(){fws.previousRequest=fws.currentRequest;fws.currentRequest=new Date().getTime();return $.extend({"previousRequest":fws.previousRequest,"currentRequest":fws.currentRequest},opts.fallbackPollParams);}
function pollSuccess(data){var messageEvent={"data":data};fws.onmessage(messageEvent);}
function poll(){$.ajax({type:opts.fallbackPollMethod,url:opts.fallbackPollURL,dataType:'text',data:getFallbackParams(),success:pollSuccess,error:function(xhr){$(fws).triggerHandler('error');}});}
openTimout=setTimeout(function(){fws.readyState=OPEN;$(fws).triggerHandler('open');poll();pollInterval=setInterval(poll,opts.fallbackPollInterval);},opts.fallbackOpenDelay);return fws;}
var ws=window.WebSocket?new WebSocket(url):new FallbackSocket();$(window).unload(function(){ws.close();ws=null});return ws;}});})(jQuery);

// ******** IE PLACE-HOLDER SUPPORT: HTML5 Place-holder jQuery Plugin - v2.1.2 ********
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof module&&module.exports?require("jquery"):jQuery)}(function(a){function b(b){var c={},d=/^jQuery\d+$/;return a.each(b.attributes,function(a,b){b.specified&&!d.test(b.name)&&(c[b.name]=b.value)}),c}function c(b,c){var d=this,f=a(d);if(d.value==f.attr("placeholder")&&f.hasClass(m.customClass))if(f.data("placeholder-password")){if(f=f.hide().nextAll('input[type="password"]:first').show().attr("id",f.removeAttr("id").data("placeholder-id")),b===!0)return f[0].value=c;f.focus()}else d.value="",f.removeClass(m.customClass),d==e()&&d.select()}function d(){var d,e=this,f=a(e),g=this.id;if(""===e.value){if("password"===e.type){if(!f.data("placeholder-textinput")){try{d=f.clone().prop({type:"text"})}catch(h){d=a("<input>").attr(a.extend(b(this),{type:"text"}))}d.removeAttr("name").data({"placeholder-password":f,"placeholder-id":g}).bind("focus.placeholder",c),f.data({"placeholder-textinput":d,"placeholder-id":g}).before(d)}f=f.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id",g).show()}f.addClass(m.customClass),f[0].value=f.attr("placeholder")}else f.removeClass(m.customClass)}function e(){try{return document.activeElement}catch(a){}}var f,g,h="[object OperaMini]"==Object.prototype.toString.call(window.operamini),i="placeholder"in document.createElement("input")&&!h,j="placeholder"in document.createElement("textarea")&&!h,k=a.valHooks,l=a.propHooks;if(i&&j)g=a.fn.placeholder=function(){return this},g.input=g.textarea=!0;else{var m={};g=a.fn.placeholder=function(b){var e={customClass:"placeholder"};m=a.extend({},e,b);var f=this;return f.filter((i?"textarea":":input")+"[placeholder]").not("."+m.customClass).bind({"focus.placeholder":c,"blur.placeholder":d}).data("placeholder-enabled",!0).trigger("blur.placeholder"),f},g.input=i,g.textarea=j,f={get:function(b){var c=a(b),d=c.data("placeholder-password");return d?d[0].value:c.data("placeholder-enabled")&&c.hasClass(m.customClass)?"":b.value},set:function(b,f){var g=a(b),h=g.data("placeholder-password");return h?h[0].value=f:g.data("placeholder-enabled")?(""===f?(b.value=f,b!=e()&&d.call(b)):g.hasClass(m.customClass)?c.call(b,!0,f)||(b.value=f):b.value=f,g):b.value=f}},i||(k.input=f,l.value=f),j||(k.textarea=f,l.value=f),a(function(){a(document).delegate("form","submit.placeholder",function(){var b=a("."+m.customClass,this).each(c);setTimeout(function(){b.each(d)},10)})}),a(window).bind("beforeunload.placeholder",function(){a("."+m.customClass).each(function(){this.value=""})})}});

//************ SonicChat 2015 - End of SonicChat JS File ************