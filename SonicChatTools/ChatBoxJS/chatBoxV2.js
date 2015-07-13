/* Use of this file without authorization can be punishable by law. SonicChat 2015.
 * Widget Version 0.21:2015-06-26
 * UI Altered By: NPM
 * Date: 2015-06-26
 */

var webSocket;

// Host Port and server address
var serverAddress = "ws://cool-517061425.us-west-2.elb.amazonaws.com";
var port = "50005";
var siteID = "1";
var siteName = "SonicChat";
var connectionID = "";

var away = false; //True if system in in after hours
var initiatedChat = false; // set to true when client hits top of chat box
var dotTimer = null; // Timer used to display now typing(from host).
var nowTyping = false; // toggled every 3seconds to allow a message to be sent to server to show client is typing.
var itemDisplay = true; // toggled if selectable items are displayed

var chatBoxHtml =  "<style>" +
".blue {color: #FFFFFF; background: #63B8FD;} " +
".blue:hover {background: #94CEFE;}" +
".blue:active {background: #70bcf9; }" +
".button:hover {text-decoration: none;}" +
".button:active {position: relative;top: 1px;}" +
".medium {font-size: 12px;margin:auto;display:block;outline: none;cursor: pointer;text-align: center;text-decoration: none;font: 14px/100% Arial, Helvetica, sans-serif;padding: .4em 1.5em .42em;text-shadow: 0 1px 1px rgba(0,0,0,.3); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2);} " +
".arrowImg { width: 15px!important; display: inline-block; margin-right: 21px!important; margin-top: 3px!important; float: right!important;}" +
".chatTop { width: 100%!important; display: block!important; font-weight: 400!important; height: 35px!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; background-color: #3E3E3E!important; border-top-left-radius:.3em!important; border-top-right-radius:.3em!important;}" +
".chatTop:hover {background-color: #4F4F4F!important;}" +
"#ChatNameInput::-webkit-input-placeholder{color:#999!important;}" +
"#ChatContactInput::-webkit-input-placeholder{color:#999!important;}" +
"#chatMessage::-webkit-input-placeholder{color:#999!important;}" +
"#messageInput::-webkit-input-placeholder{color:#999!important;}" +
"</style>" +
	"<div id = 'chatContainer' style = 'width: 290px; z-index: 100!important; border-top-left-radius:.4em!important; border-top-right-radius:.4em!important; padding-bottom:0px!important; margin: 0px 0px 0px 0px!important; position: fixed!important; bottom: 0px!important; right: 20px!important; background-color: #EAEAEA!important; box-shadow:0 .10em .5em rgba(0,0,0,.35)!important;'>" +
		"<div  id = 'chatTop' class = 'chatTop' onClick = 'openChatBox()'>" +
		"<p id = 'chatTopMessage' style = 'display: block!important; cursor:default!important;  -moz-user-select: none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none; user-select: none; letter-spacing: .04em!important;  line-height: 100%!important; border: 0px!important; font-size: 15px!important; color: #ffffff!important; width: 100%!important; font-family: Arial, Helvetica, sans-serif;important;  margin: 0px!important; text-align: top!important; padding-left: 11px!important; font-weight: 400!important; padding-top: 10px!important;'><span style = 'color: #64C7E7!important; font-weight: 600!important;  '></span>  <img  id = 'chatArrow' class = 'arrowImg'  src = 'http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png'></p> " +
		"</div>" + 
		"<div  id = 'chatMain' style = 'display: none; margin: 6px 0px 0px 0px!important; padding: 0px!important;'>" +  
		"<div  style = 'display: block!important; width: 95%!important; margin: 0 auto!important; padding:0px!important;'>" +
		"<div  id = 'chatBox' style = 'overflow-y: scroll!important;  margin: 0px!important; background-color: #ffffff!important; height: 200px; width: 99%!important;  border: 1px solid #A3A3A3!important; border-top-left-radius:.2em!important; border-top-right-radius:.2em!important;'>" + 
		"</div>" +
		"<input id = 'messageInput' type='text' placeholder='Type to Chat... (Enter to send)' style = 'font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 99%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 2px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important; background-color: #FFFFFF!important;  border-radius: 0px!important;'>" +
	     "<p style = ' display: block!important; line-height: 100%!important; border: 0px!important; margin:3px 0px 3px 0px!important; font-size: 13px!important; padding: 0px!important; color: grey!important; '>Powered by SonicChat&trade;</p>" +
		"</div>" +
		"</div>" +
	"</div>";
																										
$(document).ready(function() {
	var iOS = false, p = navigator.platform;
	if( p != 'iPad' || p != 'iPhone' || p != 'iPod' ){	
		$("body").append(chatBoxHtml);
		testActiveHost();
		changeChatTopMessage(siteName, "Support", false, true);		
	}	
});

// ****** Start chat with host on users demand******
function startChat() {
	// When a user wants to start a chat start a socket
	if (!initiatedChat && !away) {
		connectToHost(); 
	} 
}

function openChatBox() {
	// Reset height of chat box if changed
	if ($("#chatBox").height() > 200) {
		$("#chatContainer").animate({width:'290px'});
		$("#chatBox").animate({height:'200px'});
	}
	if (itemDisplay == true) {
		if ($('#chatMain').is(':visible')) {
			$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png');
			$('#chatMain').slideUp();
			changeChatTopMessage(siteName, "Support", false, true);
		} else {
			$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-down.png');
			$('#chatMain').slideDown();
			changeChatTopMessage(siteName, "Support", false, false);
		}
	} else {
		if ($('#chatMessageBlock').length > 0 ) {
			$("#chatMessageBlock").fadeOut(400);
		}
		itemDisplay = true;
		displayItemSelection();
		changeChatTopMessage(siteName, "Support", false, false);
	}	
}

// =============================== Following methods connect and interact with the server for WS ops ===============================
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

// =============================== Following methods change and add display elements to the chat box ===============================
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
		$('#chatBox').append("<div id = 'waitingText' style = 'font-color: #000000!important; line-height: 105%!important; border: 0px!important; height: 21px!important; margin-top: 8px!important; margin-bottom: 2px!important;  font-family: Arial, Helvetica, sans-serif!important; padding: 0px!important; margin-bottom: 7px!important; font-weight: 600!important; text-align: center!important; font-size: 14px!important;'><span style = 'font-weight: 550!important; font-family: Arial, Helvetica, sans-serif!important;  color: #616161!important; margin: 0px!important; padding: 0px!important; font-size: 15px!important;'>" + message+ "</span><span style = 'font-weight: 500!important; color: #616161!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important;'> " + messageSmall + "</span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 5px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 5px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'></div>");
	} else {
		$('#waitingText').html("<span style = 'font-weight: 600!important; font-family: Arial, Helvetica, sans-serif!important; color:" + color + "!important; margin: 0px!important; padding: 0px!important; font-size:" + size + "!important;'>" + message + "</span> <span style = 'font-weight: 500!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important;'> " + messageSmall + "</span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 5px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 5px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'>");	
	}
}

function changeChatTopMessage(message, messageTwo, backVis, navUp) {
$('#chatTopMessage').html('<span style = "color: #63B8FD!important; font-weight: 600!important; ">' + message + '</span> </b> <span style = "color: #E9E9E9!important; font-weight: 600!important; ">' + messageTwo + '</span>  <img  id = "chatArrow"  class = "arrowImg"  src = "http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png"> <span id = "backimg" style = "color: #c1c1c1!important; display: none; margin: 0px!important; padding: 0px!important; padding-right: 15px!important; float: right; font-size: 18px;" class="icon fa-hand-o-left"></span>');
	if (backVis) {
		$("#backimg").css("display", "inline-block");
	} else if (!backVis){
		$("#backimg").css("display", "none");
	}
	
	if (navUp) {
		$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png');
	} else {
		$('#chatArrow').attr('src', 'http://sonicchat.elasticbeanstalk.com/static/images/nav-down.png');
	}
	
	// Reset chat message input
	$('#messageInput').val("");
	
}

// Main item selection picker
function itemSelected(item) {
	
	// Unbind any keyup events to avoid double sends
	$('#messageInput').unbind('keyup');
	
	if (item == 1) {
		// Live chat
		if (!away) {
		connectToHost(); 
		} else {
		displayChatChoice();
		}
		itemDisplay = false;
		changeChatTopMessage("Chat with", siteName, true);
	} else if(item == 2) {
		// Message
		displayMessageForm();
		changeChatTopMessage("Contact Us", "", true);
		itemDisplay = false;
	} else if (item == 3) {
		displayTicketSelection();
		changeChatTopMessage("Ticket Support", "", true);
		itemDisplay = false;
	} else if (item == 4) {
		window.open("/about.html", "_self");
	   $("#itemBlock").fadeOut(600);
	} else if (item == 5) {
		// Google Map of location
		displayMap();
		changeChatTopMessage("Map View", "", true);
		itemDisplay = false;
	} else if (item == 6) {
		// Answerbase 
		displayAnswerBase();
		itemDisplay = false;
	}
	
	// Hide item selection block if left visible
	if($('#itemBlock').length == 0){
		$("#itemBlock").css("display", "none");
	}
}

/* =============================== DISPLAY: Append and Display functions below! ===============================
The following functions request data from the server
and handle the data in a callback */


function displayMap(){
		displayLoading("chatBox", true);
		var cord = "Downtown cleveland ohio" // coordinates of map location
		// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
		var map = "<div  id  = 'mapDiv' style = 'width: 100%!important; height: 100%!important; overflow-y: hidden; overflow-x: hidden;  margin: auto!important;  padding-top: 0px!important;  display: none; '>" + 					
					"<iframe  id = 'mapFrame' frameborder='0' style='z-index: 1000; border:0; width:100%; height:100%;'src='https://www.google.com/maps/embed/v1/place?key=AIzaSyCT0nwdHgOiASwTY84VMt589mE184xTJ58 &q=" + cord + "' allowfullscreen></iframe>" + 
				"</div>";
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "Viewing our location.");

			$('#chatBox').html(""); // Clear the chat box first
			$('#chatBox').append(map);
						
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$("#mapDiv").fadeIn(400);
}



function displayMessageForm() {
		var awayAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
						"<div id = 'innerForm' style = 'display:block'>" +
								"<input id = 'ChatNameInput' type='text' placeholder='Your Name' style = ' font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 0px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'> " +
								"<input id = 'ChatContactInput' type='text' placeholder='Your Email' style = '  font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'>" + 
								"<textarea id = 'chatMessage' placeholder='Leave a Message...' style = '  width: 100%; resize: none; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 50px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important; '></textarea>" +
								"<span onClick = 'sendAfterHourMessage()'class='blue medium'>Send Message</span>" +  
							"</div>" +
						"</div> ";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "Leave us a detailed message");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("Leave us a message" , "", "", "");
			$('#chatBox').append(awayAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$("#chatMessageBlock").fadeIn(400);
}


function displayTicketForm() {
		// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
		var ticketAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
				"<div id = 'innerForm' style = 'display:block'>" +
				"<select id = 'productListD' style = 'font-size: 15px!important; background-color: #F8F8F8!important; -moz-appearance:menulist!important -webkit-appearance:menulist!important; appearance:menulist!Important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; padding: 0px!important;  height: 25px!important; display:block!important; width: 100%!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;' ><option value='volvo'>Select a Product</option><option value='chat'>Implementation</option><option value='answerbase'>My AnswerBase</option><option value='chat'>Chat System</option><option value='tiles'>Tiles</option><option value='other'>Other</option> </select>" +			
				"<input id = 'ChatNameInput' type='text' placeholder='Your Name' style = ' font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 0px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'> " +
				"<input id = 'ChatContactInput' type='text' placeholder='Your Email' style = 'font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'>" + 
				"<textarea id = 'chatMessage' placeholder='Describe your issue here...' style = 'width: 100%; resize: none; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 70px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important; '></textarea>" +
				"<span onClick = 'sendTicket()'class='blue medium'>Create Ticket</span>" +  
					"</div>" +
			"</div>";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "Open a Ticket");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("Create a New Ticket" , "", "", "");
			$('#chatBox').append(ticketAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$("#chatMessageBlock").fadeIn(400);
}


function displayTicketSelection() {
	var awayAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
				"<span onClick = 'displayTicketForm()' style = 'margin-bottom: 5px;' class='blue medium'>Open a Ticket</span>" +  
				"<span onClick = 'viewTicket()'class='blue medium'>My Tickets</span>" +  
			"</div>";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "SonicChat Ticket System");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("Choose an Option" , "", "", "");
			$('#chatBox').append(awayAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}

			$("#chatMessageBlock").fadeIn(400);
}

function viewTicket() {
			// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
		var ticketAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
								"<p style = 'font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 100%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #4D4D4D;important; '>" + 
								"You can view your ticket status by entering your ticket number or email address below.</p>" +
								"<input id = 'ChatNameInput' type='text' placeholder='Enter ticket number or email' style = ' font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 0px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'> " +
								"<span onClick = 'getTickets()'class='blue medium'>Find Ticket</span>" +  
							"</div>" +
						"<div id = 'messageSentBlock' style = '  display: none;  width: 95%;important; padding-top: 2px;important; margin: auto;important;'>" +  "</div> ";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "My Tickets");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("View My Tickets" , "", "", "");
			$('#chatBox').append(ticketAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$("#chatMessageBlock").fadeIn(400);
}

function getTickets() {
displayBanner("*Ticket or Email not found. ", "",  "#FF0000", "12px");
$('#ChatNameInput').val(""); // Clear the input field
}

function displayAnswerBase() {
		// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
	
	var defaultIntro = "Search for information on our products or services, for example, 'Why is SonicChat so awesome?'";
	var defaultQuestion = "Hello! Ask me anything." 
	var answerAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important; margin: auto!important; padding-top: 3px!important;  display: none; '>" + 
							"<div id = 'answerBlock' style = 'width: 100%; margin-top: 5px; background-color: #F8F8F8; border-radius: 5px;'>" +
							"<p  style = 'padding: 6px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
							"<span style = 'color: #63B8FD!important; display: block; border-radius: 2px!important; margin-bottom: 6px!important; font-weight: 600!important;'> &#34;" + defaultQuestion + "&#34; </span>" + 
							defaultIntro + 
							"</p>" +			
							"</div>" +
						"</div>";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', false);
			$("#messageInput").attr("placeholder", "Search... (Enter to Send)");

			$('#chatBox').html(""); // Clear the chat box first
			
			changeChatTopMessage("Search", siteName, true);

			displayBanner("AnswerBase Search" , "", "", "");
			$('#chatBox').append(answerAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}

			$("#chatMessageBlock").fadeIn(400);
			
			// This allows searches to AB
			$("#messageInput").keyup(function(event){
				if(event.keyCode == 13){ // Key code for enter button
					if ($('#messageInput').val().trim() != "") {
						displayLoading("#chatMessageBlock", true);
						displayBanner("AnswerBase Search" , "", "", "");
						requestAnswer($('#messageInput').val().trim());
						$("#messageInput").val(""); // Reset input to empty
					} else {
						displayBanner("*Please enter a valid question.", "",  "#FF0000", "12px");
					}
				}
			}); 			
}

function displayChatChoice() {
	var awayAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
						"<p style = 'font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 100%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #4D4D4D;important; '>" + 
						"You can search our AnswerBase for help in this widget while you browse.</p>" +
						"<span onClick = 'displayAnswerBase()' style = 'margin-bottom: 5px;' class='blue medium'>Search AnswerBase</span>" +  
						"<span onClick = 'itemSelected(2)' class='blue medium'>Message Us</span>" +  
					"</div>";
			
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "Get in Touch.");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("Live person not available" , "", "", "");
			$('#chatBox').append(awayAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}

			$("#chatMessageBlock").fadeIn(400);
}
						
function displayItemSelection() {
	iconColor = "#63B8FD";
	tileColor = "#f8f8f8";
	tileHoverColor = "#DFF1FF";
	var awayAppend =  "<link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'>" +
					"<div  id  = 'itemBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
					
						"<div class = 'wedge' onClick = 'itemSelected(1)' style = 'float:left;  width:49%!important; margin-bottom: 5px!important; height: 72px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
						"<div style = 'color:" + iconColor +"; text-align: center;  margin: auto; padding-top: 14px; font-size: 31px;' class='icon fa-comments'><p style = 'font-size: 15px;  cursor: default;  margin: 0px;  line-height: 100%!important;  padding: 0px; color: #716F6F!important;  margin-top: 6px!important; '>Live Chat<p></div>" +
						"</div>" +
						
						"<div class = 'wedge' onClick = 'itemSelected(2)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
						"<div style = 'color:" + iconColor +"; text-align: center;  margin: auto; padding-top: 14px; font-size: 31px;' class='icon fa-envelope'><p style = 'font-size: 15px; margin: 0px; padding: 0px;  line-height: 100%!important;   margin-top: 6px!important;  color: #716F6F!important;  cursor: default;  '>Message Us<p></div>" +
						"</div>" +
						
						"<div class = 'wedge' onClick = 'itemSelected(3)' style = 'float:left;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";'>" +
						"<div style = 'color:" + iconColor +"; text-align: center;  margin: auto; padding-top: 14px; font-size: 31px;' class='icon fa-ticket'><p style = 'font-size: 15px; margin: 0px; padding: 0px;  line-height: 100%!important;   margin-top: 6px!important;  color: #716F6F!important;  cursor: default;  '>Ticket<p></div>" +
						"</div>" +

						
						"<div class = 'wedge' onClick = 'itemSelected(6)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
						"<div style = 'color:" + iconColor +"; text-align: center;  margin: auto; padding-top: 14px; font-size: 31px;' class='icon fa-search '><p style = 'font-size: 15px; margin: 0px;   line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default;  '>AnswerBase<p></div>" +
						"</div>" +	
						
												
						"<div class = 'wedge' onClick = 'itemSelected(5)' style = 'float:left;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
						"<div style = 'color:" + iconColor +"; text-align: center;  margin: auto; padding-top: 14px; font-size: 31px;' class='icon fa-map-marker'><p style = 'font-size: 15px; margin: 0px;   line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default;  '>Where are we?<p></div>" +
						"</div>" +		
						
						"<div class = 'wedge' onClick = 'itemSelected(4)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
						"<div style = 'color:" + iconColor +"; text-align: center;  margin: auto; padding-top: 14px; font-size: 31px;' class='icon fa-question-circle'><p style = 'font-size: 15px; margin: 0px;   line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default;  '>About Me<p></div>" +
						"</div>" +	

					"</div> ";
					
					// On hover for items after dom load append
					$(document).on('mouseover', '.wedge', function(e) {
						$(this).css('background-color',  tileHoverColor);
					});
					
					$(document).on('mouseout', '.wedge', function(e) {
						$(this).css('background-color', tileColor);
					});
					
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "Help and Support");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("Welcome, choose an option" , "", "", "");
			$('#chatBox').append(awayAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$("#itemBlock").fadeIn(400);
}

var spinner; // Global controlled loading spinner 
function displayLoading(element, show) {
	if (show) {
		if ($("#innerForm").length) {
			$("#innerForm").hide();
		}
		$(element).children().hide(); 
		var opts = { lines: 10, length: 17 , width: 2, radius: 0 , scale: 1 , corners: 0.5, color: '#000',
		opacity: 0.2 , rotate: 89 , direction: 1 , speed: 1.1 , trail: 60 , fps: 20 , zIndex: 2e9 ,
		className: 'spinner' , top: '50%', left: '50%', shadow: false, hwaccel: false , position: 'absolute' };
		if (spinner == null) {
		spinner = new Spinner(opts).spin();
		} else {
		spinner.spin();
		}
		$(element).append(spinner.el);
	} else {
		// Please clear element in your own. Use div ID 'innerForm to keep from elements values
		spinner.stop();
		$("#innerForm").hide();
	}
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

/* =============================== AJAX REQUEST: Request Data BELOW ===============================
The following functions request data from the server
and handle the data in a callback */


// ******** FORM MESSAGE FUNCTIONS ******** 
function sendAfterHourMessage() {
	if ($("#ChatContactInput").val().indexOf("@") != -1 && $("#ChatContactInput").val() != ""){
	displayLoading("#chatMessageBlock", true); // kill loading animation
	 var data={name:$("#ChatNameInput").val(), contact:$("#ChatContactInput").val(), message:$("#chatMessage").val()};
			$.ajax({
				url: "http://sonicchat.elasticbeanstalk.com/dataAccess/recieveAwayMessage",
				dataType: 'jsonp',
				crossDomain:true,
				jsonpCallback: "jsonCallbackAwayMessage",
				data: data,
				scriptCharset: 'UTF-8',
				  success: function(data) {
					// Nothing
			}});
			displayBanner("Leave us a message" , "", "", "");
	return true;
	} else {
		displayBanner("*Please use a valid email address", "",  "#FF0000", "12px");
	}
}
function jsonCallbackAwayMessage() {
		displayBanner("Message Sent" , "", "", "");
		displayLoading("#chatMessageBlock", false); // kill loading animation
		if ($('#ChatNameInput').val() != "") {
		custName = $('#ChatNameInput').val();
		} else {
		custName = "valued customer";
		}
		 var htmlItem =  "<div id = 'answerBlock' style = 'width: 100%; margin-top: 0px; border-radius: 5px;'>" +
							"<p  style = 'padding: 2px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
								"<span style = 'color: #59AFFF!important; display: block; border-radius: 2px!important; margin-bottom: 6px!important; font-weight: 600!important;'>Thank you, " + custName + "</span>" + 
								"Your message has been sent and will get back with you shortly at " + $("#ChatContactInput").val() +
							"</p>" +			
						"</div>";
	  
	    $("#chatMessageBlock").append(htmlItem);
		$('#chatMessageBlock').fadeIn();
}

// =============================== FORM MESSAGE FUNCTIONS =============================== 
function sendTicket() {
	if ($("#ChatContactInput").val().indexOf("@") != -1 && $("#ChatContactInput").val() != ""){
	 var data={name:$("#ChatNameInput").val(), contact:$("#ChatContactInput").val(), issue:$("#chatMessage").val(), product:$("#productListD").val()};
			$.ajax({
				url: "http://sonicchat.elasticbeanstalk.com/DataAccess/recieveTicket/",
				dataType: 'jsonp',
				crossDomain:true,
				jsonpCallback: "jsonCallbackTicket",
				data: data,
				scriptCharset: 'UTF-8',
				  success: function(data) {
					// Nothing
			}});
	displayLoading("#chatMessageBlock", true);
	return true;
	} else {
		displayBanner("*Please use a valid email address", "",  "#FF0000", "12px");
	}
}

function jsonCallbackTicket(data) {
	displayLoading("#chatMessageBlock", false); // kill loading animation
	var custName = "";
	if ($('#ChatNameInput').val() != "") {
		custName = $('#ChatNameInput').val() + ", ";
		} else {
		custName = "";
		}
	
		 var htmlItem =  "<div id = 'answerBlock' style = 'width: 100%; margin-top: 0px; border-radius: 5px;'>" +
							"<p  style = 'padding: 4px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
								"<span style = 'color: #6D6D6D!important; display: block; border-radius: 2px!important; margin-bottom: 6px!important; font-weight: 600!important;'>Your Ticket Number is: <span style = 'color: #59AFFF!important;'>" + data.result + "</span></span>" + 
								custName + "We are sorry you are facing issues. You will receive an email shortly, and we will get back to you ASAP. <br><br> Please keep your issue number so you can fast track your solution." +
								"If you happen to lose your number, you can also use your email, <span style = 'color: #59AFFF!important; font-weight: 590!important; '>" + $("#ChatContactInput").val() + "</span> to retrieve issues in this chat box from the Ticket section."
							"</p>" +			
						"</div>";
	  
	    $("#chatMessageBlock").append(htmlItem);
		$('#chatMessageBlock').fadeIn();
		displayBanner("Ticket Created" , "", "", "");
}



// ******** CHECKS TO SEE IF A HOST IS ACTIVE FOR THE SITE ********
function testActiveHost() {
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

function jsonCallback(data) {
var testVal = data.result;
	if (testVal == "TRUE" && getCookie("connectionID") != "") {
		// Keeps alive the concurrent chat between host and this client
		away = false;
		connectToHost(); 
	} else if(testVal == "FALSE") {
		away = true;
		displayItemSelection();
	} else if (testVal == "TRUE") {
		away = false;
		displayItemSelection();	
	} else {
	// TODO: Error response from server, create a fallback
	}
}

// ******** Gets answers from AnswerBase ********
function requestAnswer(question) {
	// Function is dedicated to see if services is in after hours and/or there are even an active host, 
		$.ajax({
			url: "http://sonicchat.elasticbeanstalk.com/DataAccess/quickSearchWidget/" + siteID + ":" + question,
			dataType: 'jsonp',
			crossDomain:true,
			jsonpCallback: "jsonCallbackAnswers",
			scriptCharset: 'UTF-8',
			success: function(data) {
			// Nothing for now
		}});						
}

function jsonCallbackAnswers(data) {	
	$('#chatMessageBlock').html(""); // Clear the chat box first
	displayBanner("AnswerBase Search" , "", "", "");
	var htmlItem = "";
	if (data.length > 0) {
		data.forEach(function(object) {
		  console.log(object.answer);
		  var htmlItem =  "<div id = 'answerBlock' style = 'width: 100%; margin-top: 5px; background-color: #F8F8F8; border-radius: 5px;'>" +
								"<p  style = 'padding: 6px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
									"<span style = 'color: #63B8FD!important; display: block; border-radius: 2px!important; margin-bottom: 6px!important; font-weight: 600!important;'> &#34;" + object.question + "&#34; </span>" + 
									object.answer + 
								"</p>" +			
							"</div>";
							$("#chatMessageBlock").append(htmlItem);
		});
	} else {
		htmlItem =  "<div id = 'answerBlock' style = 'width: 100%; margin-top: 5px; background-color: #F8F8F8; border-radius: 5px;'>" +
						"<p  style = 'padding: 6px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
							"<span style = 'color: #63B8FD!important; display: block; border-radius: 2px!important; margin-bottom: 6px!important; font-weight: 600!important;'> &#34;" + "No Results" + "&#34; </span>" + 
								"Looks like we don't have an answer for that question, ask something else." + 
						"</p>" +			
					"</div>";
						 $("#chatMessageBlock").append(htmlItem);
	}
}

 // =============================== 3ed party library support below. When updating or adding new libraries always check IE support! ===============================
 // ******** WebSocket with graceful degradation - jQuery plugin VERSION 0.1 ********
(function($){$.extend({gracefulWebSocket:function(url,options){this.defaults={keepAlive:false,autoReconnect:false,fallback:true,fallbackSendURL:url.replace('ws:','http:').replace('wss:','https:'),fallbackSendMethod:'POST',fallbackPollURL:url.replace('ws:','http:').replace('wss:','https:'),fallbackPollMethod:'GET',fallbackOpenDelay:100,fallbackPollInterval:3000,fallbackPollParams:{}};var opts=$.extend({},this.defaults,options);function FallbackSocket(){var CONNECTING=0;var OPEN=1;var CLOSING=2;var CLOSED=3;var pollInterval;var openTimout;var fws={readyState:CONNECTING,bufferedAmount:0,send:function(data){var success=true;$.ajax({async:false,type:opts.fallbackSendMethod,url:opts.fallbackSendURL+'?'+$.param(getFallbackParams()),data:data,dataType:'text',contentType:"application/x-www-form-urlencoded; charset=utf-8",success:pollSuccess,error:function(xhr){success=false;$(fws).triggerHandler('error');}});return success;},close:function(){clearTimeout(openTimout);clearInterval(pollInterval);this.readyState=CLOSED;$(fws).triggerHandler('close');},onopen:function(){},onmessage:function(){},onerror:function(){},onclose:function(){},previousRequest:null,currentRequest:null};function getFallbackParams(){fws.previousRequest=fws.currentRequest;fws.currentRequest=new Date().getTime();return $.extend({"previousRequest":fws.previousRequest,"currentRequest":fws.currentRequest},opts.fallbackPollParams);}
function pollSuccess(data){var messageEvent={"data":data};fws.onmessage(messageEvent);}
function poll(){$.ajax({type:opts.fallbackPollMethod,url:opts.fallbackPollURL,dataType:'text',data:getFallbackParams(),success:pollSuccess,error:function(xhr){$(fws).triggerHandler('error');}});}
openTimout=setTimeout(function(){fws.readyState=OPEN;$(fws).triggerHandler('open');poll();pollInterval=setInterval(poll,opts.fallbackPollInterval);},opts.fallbackOpenDelay);return fws;}
var ws=window.WebSocket?new WebSocket(url):new FallbackSocket();$(window).unload(function(){ws.close();ws=null});return ws;}});})(jQuery);

// ******** IE PLACE-HOLDER SUPPORT: HTML5 Place-holder jQuery Plugin - v2.1.2 ********
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof module&&module.exports?require("jquery"):jQuery)}(function(a){function b(b){var c={},d=/^jQuery\d+$/;return a.each(b.attributes,function(a,b){b.specified&&!d.test(b.name)&&(c[b.name]=b.value)}),c}function c(b,c){var d=this,f=a(d);if(d.value==f.attr("placeholder")&&f.hasClass(m.customClass))if(f.data("placeholder-password")){if(f=f.hide().nextAll('input[type="password"]:first').show().attr("id",f.removeAttr("id").data("placeholder-id")),b===!0)return f[0].value=c;f.focus()}else d.value="",f.removeClass(m.customClass),d==e()&&d.select()}function d(){var d,e=this,f=a(e),g=this.id;if(""===e.value){if("password"===e.type){if(!f.data("placeholder-textinput")){try{d=f.clone().prop({type:"text"})}catch(h){d=a("<input>").attr(a.extend(b(this),{type:"text"}))}d.removeAttr("name").data({"placeholder-password":f,"placeholder-id":g}).bind("focus.placeholder",c),f.data({"placeholder-textinput":d,"placeholder-id":g}).before(d)}f=f.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id",g).show()}f.addClass(m.customClass),f[0].value=f.attr("placeholder")}else f.removeClass(m.customClass)}function e(){try{return document.activeElement}catch(a){}}var f,g,h="[object OperaMini]"==Object.prototype.toString.call(window.operamini),i="placeholder"in document.createElement("input")&&!h,j="placeholder"in document.createElement("textarea")&&!h,k=a.valHooks,l=a.propHooks;if(i&&j)g=a.fn.placeholder=function(){return this},g.input=g.textarea=!0;else{var m={};g=a.fn.placeholder=function(b){var e={customClass:"placeholder"};m=a.extend({},e,b);var f=this;return f.filter((i?"textarea":":input")+"[placeholder]").not("."+m.customClass).bind({"focus.placeholder":c,"blur.placeholder":d}).data("placeholder-enabled",!0).trigger("blur.placeholder"),f},g.input=i,g.textarea=j,f={get:function(b){var c=a(b),d=c.data("placeholder-password");return d?d[0].value:c.data("placeholder-enabled")&&c.hasClass(m.customClass)?"":b.value},set:function(b,f){var g=a(b),h=g.data("placeholder-password");return h?h[0].value=f:g.data("placeholder-enabled")?(""===f?(b.value=f,b!=e()&&d.call(b)):g.hasClass(m.customClass)?c.call(b,!0,f)||(b.value=f):b.value=f,g):b.value=f}},i||(k.input=f,l.value=f),j||(k.textarea=f,l.value=f),a(function(){a(document).delegate("form","submit.placeholder",function(){var b=a("."+m.customClass,this).each(c);
setTimeout(function(){b.each(d)},10)})}),a(window).bind("beforeunload.placeholder",function(){a("."+m.customClass).each(function(){this.value=""})})}});


// ******** Loading Spinner CSS and Functions Library: http://spin.js.org/#v2.3.1 ********
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(k.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",k.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;if(b=b.charAt(0).toUpperCase()+b.slice(1),void 0!==e[b])return b;for(d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}k.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.scale*d.width,left:d.scale*d.radius,top:-d.scale*d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.scale*(d.length+d.width),k=2*d.scale*j,l=-(d.width+d.length)*d.scale*2+"px",m=e(f(),{position:"absolute",top:l,left:l});
if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k,l=["webkit","Moz","ms","O"],m={},n={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=a(null,{className:d.className});
if(e(f,{position:d.position,width:0,zIndex:d.zIndex,left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.scale*(f.length+f.width)+"px",height:f.scale*f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.scale*f.radius+"px,0)",borderRadius:(f.corners*f.scale*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.scale*f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),"undefined"!=typeof document){k=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}();var o=e(a("group"),{behavior:"url(#default#VML)"});!d(o,"transform")&&o.adj?i():j=d(o,"animation")}return h});


//************ SonicChat 2015 - End of SonicChat JS File ************