/* Property of SonicChat LLC. 2015. 
 * Use of this file and its source code without authorization is punishable by law. 
 * Client and network information is logged by all endpoints. 
 * IP addresses that create excessive request will be BLACK-LISTED by the server.
 */

/*   WEB WIDGET INFO -
*   /====================================\
*	| Widget Version 0.21:2015-06-26     |
*	| UI Altered By: NPM                 |
*	| Date: 2015-07-21                   |
*   \====================================/
*/
 
// ======= Client Site Information =======
var siteID = "1";
var siteName = "SonicChat";

// ======= Widget Controls =======
var itemDisplay = true; // Toggled if selectable TILES are displayed
var spinner; // Global controlled loading spinner 
var presStarted;

// ======= Standard Chat Tile Config =======
var webSocket;
var serverAddress = "ws://localhost";
var port = "50005";
var connectionID = "";
var initiatedChat = false; // Set to true when client hits top of chat box
var dotTimer = null; // Timer used to display now typing(from host).
var nowTyping = false; // Toggled every 3 seconds to allow a "TYPING" message to be sent to server to show client is typing.
var away = false; // True if system in after hours

// =============================== Web Widget ===============================
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

".scrollable{position:relative;}.scrollable:focus{outline:0;}.scrollable.viewport{position:relative;overflow:hidden;}.scrollable.viewport.overview{position:absolute;}.scrollable.scroll-bar{display:none;}.scrollable.scroll-bar.vertical{position:absolute;right:0;height:100%;}.scrollable.scroll-bar.horizontal{position:relative;width:100%;}.scrollable.scroll-bar.thumb" +
"{position:absolute;}.scrollable.scroll-bar.vertical.thumb{width:100%;min-height:10px;}.scrollable.scroll-bar.horizontal.thumb{height:100%;min-width:10px;left:0;}.not-selectable{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.scrollable.default-skin{padding-right:10px;padding-bottom:6px;}" +
".scrollable.default-skin.scroll-bar.vertical{width:6px;}.scrollable.default-skin.scroll-bar.horizontal{height:6px;}.scrollable.default-skin.scroll-bar.thumb{background-color:black;opacity:0.4;border-radius:3px;-moz-border-radius:4px;-webkit-border-radius:4px;}.scrollable.default-skin.scroll-bar:hover.thumb{opacity:0.6;}.scrollable.gray-skin{padding-right:17px;}.scrollable.gray-skin.scroll-bar{border:1px solid gray;background-color:#d3d3d3;}.scrollable.gray-skin.scroll-bar.thumb{background-color:gray;}.scrollable.gray-skin.scroll-bar:hover.thumb{background-color:black;}.scrollable.gray-skin.scroll-bar.vertical{width:10px;}.scrollable.gray-skin.scroll-bar.horizontal{height:10px;margin-top:2px;}.scrollable.modern-skin{padding-right:17px;}.scrollable.modern-skin.scroll-bar{border:1px solid gray;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;-moz-box-shadow:inset 0 0 5px#888;-webkit-box-shadow:inset 0 0 5px#888;box-shadow:inset 0 0 5px#888;}.scrollable.modern-skin.scroll-bar.thumb{background-color:#95aabf;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;border:1px solid#536984;}.scrollable.modern-skin.scroll-bar.vertical.thumb " +
"{width:8px;background:-moz-linear-gradient(left,#95aabf 0%,#547092 100%);background:-webkit-gradient(linear,left top,right top,color-stop(0%,#95aabf),color-stop(100%,#547092));background:-webkit-linear-gradient(left,#95aabf 0%,#547092 100%);background:-o-linear-gradient(left,#95aabf 0%,#547092 100%);background:-ms-linear-gradient(left,#95aabf 0%,#547092 100%);background:linear-gradient(to right,#95aabf 0%,#547092 100%);-ms-filter:'progid:DXImageTransform.Microsoft.gradient( startColorstr='#95aabf', endColorstr='#547092',GradientType=1 )';}.scrollable.modern-skin.scroll-bar.horizontal.thumb{height:8px;background-image:linear-gradient(#95aabf,#547092);background-image:-o-linear-gradient(#95aabf,#547092);background-image:-moz-linear-gradient(#95aabf,#547092);background-image:-webkit-linear-gradient(#95aabf,#547092);background-image:-ms-linear-gradient(#95aabf,#547092);-ms-filter:'progid:DXImageTransform.Microsoft.gradient( startColorstr='#95aabf', endColorstr='#547092',GradientType=0 )';}.scrollable.modern-skin.scroll-bar.vertical{width:10px;}.scrollable.modern-skin.scroll-bar.horizontal{height:10px;margin-top:2px;}" +

"</style>" +

"<link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'>" +	// This ref is for font Icons				

	"<div id = 'chatContainer'  style = 'width: 290px; z-index: 100!important; border-top-left-radius:.4em!important; border-top-right-radius:.4em!important; padding-bottom:0px!important; margin: 0px 0px 0px 0px!important; position: fixed!important; bottom: 0px!important; right: 20px!important; background-color: #EAEAEA!important; box-shadow:0 .10em .5em rgba(0,0,0,.35)!important;'>" +
		"<div  id = 'chatTop' class = 'chatTop' onClick = 'openChatBox()'>" +
		"<p id = 'chatTopMessage' style = 'display: block!important; cursor:default!important;  -moz-user-select: none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none; user-select: none; letter-spacing: .04em!important;  line-height: 100%!important; border: 0px!important; font-size: 15px!important; color: #ffffff!important; width: 100%!important; font-family: Arial, Helvetica, sans-serif;important;  margin: 0px!important; text-align: top!important; padding-left: 11px!important; font-weight: 400!important; padding-top: 10px!important;'><span style = 'color: #64C7E7!important; font-weight: 600!important;  '></span>  <img  id = 'chatArrow' class = 'arrowImg'  src = 'http://sonicchat.elasticbeanstalk.com/static/images/nav-up.png'></p> " +
		"</div>" + 
		"<div  id = 'chatMain' style = 'display: none; margin: 6px 0px 0px 0px!important; padding: 0px!important; overflow: none!important;'>" +  
		"<div  style = 'display: block!important; width: 95%!important; margin: 0 auto!important; padding:0px!important;'>" +
		"<div  id = 'chatBox' style = 'overflow:auto; overflow-x: hidden; max-width: 99%!important;   margin: 0px!important; background-color: #ffffff!important; height: 200px; width: 99%!important;  border: 1px solid #A3A3A3!important; border-top-left-radius:.2em!important; border-top-right-radius:.2em!important;'>" + 
		"</div>" +
		"<input id = 'messageInput' type='text' placeholder='Type to Chat... (Enter to send)' style = 'font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 99%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 2px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important; background-color: #FFFFFF!important;  border-radius: 0px!important;'>" +
	     "<p style = ' display: block!important; line-height: 100%!important; border: 0px!important; margin:3px 0px 3px 0px!important; font-size: 13px!important; padding: 0px!important; color: grey!important; '>Powered by SonicChat&trade;</p>" +
		"</div>" +
		"</div>" +
	"</div>";
							
// Test for an active chat and append chat box							
$(window).ready(function() {
	var iOS = false, p = navigator.platform;
	if( p != 'iPad' || p != 'iPhone' || p != 'iPod' ){	
		$("body").append(chatBoxHtml);
		
		//$("#chatBox").customScrollbar();	
		//$("#chatBox").customScrollbar("resize", true);

		testActiveHost();
		changeChatTopMessage(siteName, "Support", false, true);		
	}	
});

// =============================== STANDARD WEB WIDGET FUNCTIONS ===============================
function openChatBox() {
	if (!presStarted) { 
		// Don't allow user to quit press. will cause timer errors
		//PrssStartes is only used for SonicChat self Presentation.
		
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
			displayTileSelection();
			changeChatTopMessage(siteName, "Support", false, false);
		}
	
	}
}

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
		if ($("#innerForm").length) {
			$("#innerForm").hide();
		}
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
		$('#chatBox').append("<div id = 'waitingText' style = 'font-color: #000000!important; line-height: 105%!important; border: 0px!important; height: 21px!important; margin-top: 10px!important; margin-bottom: 10px!important;  font-family: Arial, Helvetica, sans-serif!important; padding: 0px!important; margin-bottom: 7px!important; font-weight: 600!important; text-align: center!important; font-size: 14px!important;'><span style = 'font-weight: 550!important; font-family: Arial, Helvetica, sans-serif!important;  color: #616161!important; margin: 0px!important; padding: 0px!important; font-size: 15px!important;'>" + message+ "</span><span style = 'font-weight: 500!important; color: #616161!important; font-family: Arial, Helvetica, sans-serif!important;  margin: 0px!important; padding: 0px!important;'> " + messageSmall + "</span> <hr style = 'width: 95%!important; margin: auto!important; margin-top: 6px!important; border: 0!important; height: 0!important; border-top: 1px solid rgba(0, 0, 0, 0.1)!important; margin-bottom: 8px!important;  border-bottom: 1px solid rgba(255, 255, 255, 0.3)!important; padding: 0px;!important;'></div>");
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

// =============================== COOKIE FUNCTIONS =============================== 
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

// =============================== ACTIVE HOST TEST (FOR STANDARD CHAT TILE) =============================== 
function testActiveHost() {
	if (!away) {
		// Function is dedicated to see if services is in after hours and/or there are even an active host, 
			$.ajax({
				  url: "http://localhost:8080/SonicChatV1/DataAccess/testHostActive/" + siteID,
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
		displayTileSelection();
	} else if (testVal == "TRUE") {
		away = false;
		displayTileSelection();	
	} else {
	// TODO: Error response from server, create a fallback
	}
}

// =============================== DYNAMIC TILE IMPLIMENTATION ===============================
/* 
Tile implementation is DYNAMICLY created and appended to this file based on 
client selected tiles and configuration. 

THIS FILE INCLUDES THE FOLLOWING TILES:
1. Chat V1
2. AnswerBase V1
3. Ticket V1
4. Map V1
5. Message V1
6. FeedBack (Beta)
7. AboutMe - starts presentation
8. Link - Site: Twitter to https://twitter.com/SonicChat

Created with Server function DYNAMICTILEAPPENDER, Version: 1 
 */

// Main TILE choice options. Dynamic.
function itemSelected(item) {
	// Unbind any keyup events to avoid double sends
	$('#messageInput').unbind('keyup');
	if (item == 1) {
		changeChatTopMessage("Chat with", siteName, true);
		// Live chat
		if (!away) {
		connectToHost(); 
		} else {
		AnswerbaseSearchYesNo();
		}
		itemDisplay = false;
	} else if(item == 2) {
		// Message
		changeChatTopMessage("Contact Us", "", true);
		displayMessageForm();
		itemDisplay = false;
	} else if (item == 3) {
		changeChatTopMessage("Ticket Support", "", true);
		displayTicketSelection();
		itemDisplay = false;
	} else if (item == 4) {
		//window.open("/about.html", "_self");
		changeChatTopMessage("About Me", "", true);
		startIntroducton();
	} else if (item == 5) {
		// Google Map of location
		displayMap();
		changeChatTopMessage("Map View", "", true);
		itemDisplay = false;
	} else if (item == 6) {
		// Answerbase 
		displayAnswerBase();
		itemDisplay = false;
	} else if (item == 7) {
		changeChatTopMessage("Feedback and", "Support", true);
		displayFeedBackForm();
		itemDisplay = false;
		$(function () {
		  $("#rateYo").rateYo({
			rating: 3,
			fullStar: true,
			starWidth: "20px"
		  });
		});	
	} else if (item = 8) {
		window.open("https://twitter.com/SonicChat", "_blank");
	}
	
	// Hide item selection block if left visible
	if($('#itemBlock').length == 0){
		$("#itemBlock").css("display", "none");
	}
	
}

function displayTileSelection() {
	iconColor = "#63B8FD";
	tileColor = "#f8f8f8";
	tileHoverColor = "#DFF1FF";
	var awayAppend =  "<div  id  = 'itemBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
					
							"<div class = 'wedge' onClick = 'itemSelected(1)' style = 'float:left; font-size: 31px!important; padding:0px!important; width:49%!important; margin-bottom: 5px!important; height: 72px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + iconColor +"; text-align: center;   line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-comments'><p style = 'font-size: 15px!important; cursor: default; margin: 0px;  line-height: 100%!important;  padding: 0px; color: #716F6F!important;  margin-top: 6px!important; '>Live Chat</p></div>" +
							"</div>" +
							
							"<div class = 'wedge' onClick = 'itemSelected(6)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-search '><p style = 'font-size: 15px!important; margin: 0px; line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default; '>AnswerBase</p></div>" +
							"</div>" +	
							
							"<div class = 'wedge' onClick = 'itemSelected(3)' style = 'float:left;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";'>" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-ticket'><p style = 'font-size: 15px!important; margin: 0px; padding: 0px;  line-height: 100%!important;   margin-top: 6px!important;  color: #716F6F!important;  cursor: default; '>Ticket</p></div>" +
							"</div>" +
																		
							"<div class = 'wedge' onClick = 'itemSelected(5)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-map-marker'><p style = 'font-size: 15px!important; margin: 0px;   line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default; '>Where are we?</p></div>" +
							"</div>" +	
							
							"<div class = 'wedge' onClick = 'itemSelected(2)' style = 'float:left;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-envelope'><p style = 'font-size: 15px!important; margin: 0px; padding: 0px;  line-height: 100%!important;   margin-top: 6px!important;  color: #716F6F!important;  cursor: default; '>Message Us</p></div>" +
							"</div>" +
							
							"<div class = 'wedge' onClick = 'itemSelected(7)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-bullhorn'><p style = 'font-size: 15px!important;   margin: 0px; padding: 0px;  line-height: 100%!important;   margin-top: 6px!important;  color: #716F6F!important;  cursor: default; '>Feedback</p></div>" +
							"</div>" +
							
							// DEMO TILE
							"<div id = 'aboutTile' class = 'wedge' onClick = 'itemSelected(4)' style = 'float:left;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;   margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-question-circle'><p style = 'font-size: 15px!important; margin: 0px;   line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default; '>About Me</p></div>" +
							"</div>" +	
							
							// LINK TILE --
							"<div class = 'wedge' onClick = 'itemSelected(8)' style = 'float:right;  width:49%!important; height: 72px!important; margin-bottom: 5px!important; vertical-align: top;  display: inline-block!important; background-color:" + tileColor +";' >" +
							"<div style = 'color:" + "#c7c7c7" +"; position: relative; top: 4px; left: 4px; margin-bottom: -14px; line-height: 100%!important; font-size: 11px!important;' class='icon  fa-external-link'></div>" +
							"<div style = 'color:" + iconColor +"; text-align: center;  line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-twitter'><p style = 'font-size: 15px!important; margin: 0px;   line-height: 100%!important;  padding: 0px; margin-top: 6px!important; color: #716F6F!important; cursor: default; '>Twitter</p></div>" +
							"</div>" +	

						"</div> ";
					
					// On hover for Tiles after DOM load append
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
			
			//$("#chatBox").customScrollbar("resize", true);

}

// ===============================  MAP TILE ===============================
function displayMap(){
		//displayLoading("#chatBox", true);
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
			//displayLoading("#chatBox", false);

			$("#mapDiv").fadeIn(400);
}

// =============================== MESSAGE TILE =============================== 
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

// =============================== TICKET TILE =============================== 
function displayTicketForm() {
		// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
		var ticketAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important; padding-top: 3px!important; display: none; '>" + 
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


// ===============================  ANSWERBASE TILE =============================== 
function displayAnswerBase() {
		// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
	
	var defaultIntro = "Search for information on our products or services, for example, 'Why is SonicChat awesome?'";
	var defaultQuestion = "Hello! Ask me anything." 
	var answerAppend = "<div  id  = 'chatMessageBlock' style = 'width: 90%!important; margin: auto!important; padding-top: 3px!important;  display: none; '>" + 
							"<div id = 'answerBlock' style = 'width: 100%; margin-top: 5px; background-color: #F8F8F8; border-radius: 5px;'>" +
							"<p  style = 'padding: 6px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
							"<span style = 'color: #63B8FD!important; display: block; font-size: 15px!important; border-radius: 2px!important; margin-bottom: 3px!important; font-weight: 600!important;'>"  + defaultQuestion +  "</span>" + 
							defaultIntro + 
							"</p>" +			
							"</div>" +
						"</div>";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', false);
			$("#messageInput").attr("placeholder", "Search... (Enter to Send)");
			$("#messageInput").focus();
			
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
							// SonicChats.com specific, starts SonicChat intro
							if ($('#messageInput').val().trim().toLowerCase() == "tell me about yourself" ||
							$('#messageInput').val().trim().toLowerCase() == "why is sonicchat awesome?"  ||
							$('#messageInput').val().trim().toLowerCase() == "why is sonicchat awesome"   ||
							$('#messageInput').val().trim().toLowerCase() == "why are you awesome?"       ||
							$('#messageInput').val().trim().toLowerCase() == "why are you awesome") {
								changeChatTopMessage("About Me", "", true);
								startIntroducton();
							} else {
							displayLoading("#chatMessageBlock", true);
							displayBanner("AnswerBase Search" , "", "", "");
							requestAnswer($('#messageInput').val().trim());
							$("#messageInput").val(""); // Reset input to empty
							}
					} else {
						displayBanner("*Please enter a valid question.", "",  "#FF0000", "12px");
					}
				}
			}); 			
}

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
									"<span style = 'color: #63B8FD!important; display: block; border-radius: 2px!important; margin-bottom: 3px!important; font-size: 15px!important; font-weight: 600!important;'> &#34;" + object.question + "&#34; </span>" + 
									object.answer + 
								"</p>" +			
							"</div>";
							$("#chatMessageBlock").append(htmlItem);
		});
	} else {
		htmlItem =  "<div id = 'answerBlock' style = 'width: 100%; margin-top: 5px; background-color: #F8F8F8; border-radius: 5px;'>" +
						"<p  style = 'padding: 6px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
							"<span style = 'color: #63B8FD!important; display: block; border-radius: 2px!important; font-size: 15px!important; margin-bottom: 3px!important; font-weight: 600!important;'>" + "No Results" + "</span>" + 
								"Looks like we don't have an answer for that question, ask something else." + 
						"</p>" +			
					"</div>";
						 $("#chatMessageBlock").append(htmlItem);
	}
}

function AnswerbaseSearchYesNo() {
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

// ===============================  FEEDBACK V1 TILE =============================== 
function displayFeedBackForm() {
		// Change the chat box height and width 
		$("#chatBox").animate({height:'250px', width:'700px'});
		$("#chatContainer").animate({width:'340px'});
		var ticketAppend = "<style>.jq-ry-container{position:relative;padding:0 5px;line-height:0;display:block;cursor:pointer}.jq-ry-container[readonly=readonly]{cursor:default}.jq-ry-container>.jq-ry-group-wrapper{position:relative;width:100%}.jq-ry-container>.jq-ry-group-wrapper>.jq-ry-group{position:relative;line-height:0;z-index:10;white-space:nowrap}.jq-ry-container>.jq-ry-group-wrapper>.jq-ry-group>svg{display:inline-block}.jq-ry-container>.jq-ry-group-wrapper>.jq-ry-group.jq-ry-normal-group{width:100%}.jq-ry-container>.jq-ry-group-wrapper>.jq-ry-group.jq-ry-rated-group{width:0;z-index:11;position:absolute;top:0;left:0;overflow:hidden}</style>" +
		
		"<div  id  = 'chatMessageBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: none; '>" + 
				"<div id = 'innerForm' style = 'display:block'>" +
				
				"<p style = 'font-size: 14px!important;  margin-bottom: 7px!important; margin-top: -2px!important;  line-height: 100%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #4D4D4D;important; '>" + 
				"Let us know what you think of SonicChat and leave us some feedback.</p>" +

				"<div  style = 'margin-left: -3px; margin-top: 3px; margin-bottom: 4px; padding 0px!important;' id='rateYo'></div>" +
				
				"<input id = 'ChatContactInput' type='text' placeholder='Your Email' style = 'font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 25px!important; display:block!important; width: 100%!important; padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 10px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important;'>" + 
				"<textarea id = 'chatMessage' placeholder='Your Feedback...' style = 'width: 100%; resize: none; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; font-size: 14px!important; height: 60px!important; display:block!important;  padding-top: 2px!important; padding-bottom: 2px!important; padding-left: 3px!important;  margin-bottom: 5px!important;  margin-top: 4px!important; border: 1px solid #A3A3A3!important; color: #000000!important;  border-radius: 0px!important; '></textarea>" +

			    "<span style = 'margin-top: 10px;' onClick = 'sendFeedBack()'class='blue medium'>Submit</span>" +  

				"</div>" +
			"</div>";
			
			$('#messageInput').val("");
			$("#messageInput").prop('disabled', true);
			$("#messageInput").attr("placeholder", "Feedback");

			$('#chatBox').html(""); // Clear the chat box first
			displayBanner("Feedback And Support" , "", "", "");
			$('#chatBox').append(ticketAppend);
			
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$("#chatMessageBlock").fadeIn(400);
}

function sendFeedBack() {
	var $rateYo = $("#rateYo").rateYo();
    var rating = $rateYo.rateYo("rating");
	
	if ($("#ChatContactInput").val().indexOf("@") != -1 && $("#ChatContactInput").val() != ""){
	displayLoading("#chatMessageBlock", true); // kill loading animation
	 var data={name:"FEEDBACK", contact:$("#ChatContactInput").val(), message: "Rating: " + rating + " Feedback: " + $("#chatMessage").val()};
			$.ajax({
				url: "http://sonicchat.elasticbeanstalk.com/dataAccess/recieveFeedback",
				dataType: 'jsonp',
				crossDomain:true,
				jsonpCallback: "jsonCallbackFeedback",
				data: data,
				scriptCharset: 'UTF-8',
				  success: function(data) {
					  // None for now
			}});
			displayBanner("Feedback And Support" , "", "", "");
	return true;
	} else {
		displayBanner("*Please use a valid email address", "",  "#FF0000", "12px");
	}
}

function jsonCallbackFeedback(data) {
		displayBanner("Feedback Sent" , "", "", "");
		displayLoading("#chatMessageBlock", false); // kill loading animation
		 var htmlItem =  "<div id = 'answerBlock' style = 'width: 100%; margin-top: 0px; border-radius: 5px;'>" +
							"<p  style = 'padding: 2px!important; font-size: 14px!important;  margin-bottom: 12px!important; margin-top: -2px!important;  line-height: 105%!important; font-family: Arial, Helvetica, sans-serif;important; font-style: normal!important; margin: 0px;important; color: #565656;important; '>" + 
								"<span style = 'color: #59AFFF!important; display: block; border-radius: 2px!important; margin-bottom: 6px!important; font-weight: 600!important;'>Thank you,</span>" + 
								"Your feedback has been received and will get back with you shortly at " + $("#ChatContactInput").val() +
								"<br><br> <span style = 'color: #59AFFF; font-weight: 600;'  class='icon fa-heart-o'></span> Your feedback is appreciated." +
							"</p>" +			
						"</div>";
	  
	    $("#chatMessageBlock").append(htmlItem);
		$('#chatMessageBlock').fadeIn();
}


// =============================== STANDARD CHAT TILE V1.05 ===============================
// ****** Start chat with host on users demand******
function startChat() {
	// When a user wants to start a chat start a socket
	if (!initiatedChat && !away) {
		connectToHost(); 
	} 
}

function connectToHost() {	
	// Connect to the socket server
	webSocket = $.gracefulWebSocket(serverAddress + ":" + port);
	var establishConection = setInterval(function () {
		if (webSocket.readyState == 1) {
			
			$('#chatBox').html(""); // Clears the chat box and removes tiles
			$("#messageInput").prop('disabled', false); // enable the text field
			$("#messageInput").attr("placeholder", "Type to Chat (Enter to Send)"); 
			$("#messageInput").focus();
			
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
			setCookie("connectionID",connectionID,1);
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
	if (message != "") {
	$('#chatBox').append('<p style = "font-family: Arial, Helvetica, sans-serif;important; font-weight: 400!important;  margin: 3px 3px 6px 5px!important; color: #3c3c3c!important;  font-size: 14px!important; line-height: 100%!important; "><span style = "color: #BF0000!important; font-weight: 600!important;">'  + name + ':</span>' + message + '</p>');
	$('#chatBox').scrollTop($('#chatBox').prop("scrollHeight"));
	}
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

function displayNowTyping(show, reset){
	if (reset) {
		dotTimer = null;
	}
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

// =============================== Automated Introduction (SonicChats.COM Specific) ===============================
var introMusic;function startIntroducton(){$("#messageInput").prop('disabled',true);$("#messageInput").attr("placeholder","My Introduction");var styleP="<style>"+".typed-cursor{opacity:1;-webkit-animation:blink 0.7s infinite;-moz-animation:blink 0.7s infinite;animation:blink 0.7s infinite;}"+"@keyframes blink{0%{opacity:1;} 50%{opacity:0;} 100%{opacity:1;}}@-webkit-keyframes blink{0%{opacity:1;} 50%{opacity:0;} 100%{opacity:1;}}@-moz-keyframes blink{0%{opacity:1;} 50%{opacity:0;} 100%{opacity:1;}}"+"</style>";$('body').append(styleP);introMusic=new buzz.sound("https://s3-us-west-2.amazonaws.com/www.sonicchats.com/music/promotionMusic.mp3");resetDemoBlock();startPres();}
function resetDemoBlock(){itemDisplay=false;if($("#chatBox").height()>200){$("#chatContainer").animate({width:'290px'});$("#chatBox").animate({height:'200px'});}
var demoBlock="<div  id  = 'demoBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: block; '>"+"</div>";$('#chatBox').html("");$('#chatBox').append(demoBlock);if(navigator.userAgent.indexOf('MSIE')>-1){$('input, textarea').placeholder({customClass:'my-placeholder'});}}
function startPres(){displayLoading("#demoBlock",true);presStarted=true;var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 10px; margin: auto; padding-top: 50px!important; font-size: 70px!important; display: none; '>"+"<img  id = 'logoImage2' src = 'https://s3-us-west-2.amazonaws.com/www.sonicchats.com/images/logoDark.png' style = 'display: block; margin: auto; width: 78%; margin-bottom: -15px; padding 0px!important; ' />"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$('#logoImage2').imgLoad(function(){displayLoading("#demoBlock",false);introMusic.fadeIn(4000).setVolume(75);$("#logo1").fadeIn(1000);$("#typedText").typed({strings:[" ^1000 Hello, ^800 I'm "+"<span style = 'color: #59AFFF!important; margin-bottom: 6px!important; font-weight: 600!important;'>SonicChat</span>","I'm All-In-One ^300","simple to use ^300 ","and extremely versatile. ^300"],typeSpeed:55,backDelay:1000,loop:false,contentType:'html',loopCount:false,callback:function(){displayTilePres();},});});}
function displayTilePres(){var timer=setInterval(function(){resetDemoBlock();iconColor="#63B8FD";tileColor="#f8f8f8";tileHoverColor="#DFF1FF";var tile="<div id = 'itemBlock' style = 'color: #63B8FD; text-align: center;  margin-bottom: 15px; padding-bottom: 15px; line-height: 100%!important; margin: auto; margin-top: 12px; padding-top: 15px!important; display: block;'"+"<div style = 'width: 100%; margin-top: 0px;   display: inline-block; font-size: 16px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>"+"<div class = 'wedge2' id = 'sampTile' onClick = '' style = 'margin: auto; font-size: 31px!important; padding:0px!important; width:49%!important; margin-bottom: 5px!important; height: 72px!important;  display: none;  background-color:"+tileColor+";' >"+"<div style = 'color:"+iconColor+"; text-align: center; line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-comments'><p style = 'font-size: 15px!important; cursor: default; margin: 0px;  line-height: 100%!important; padding: 0px; color: #716F6F!important;  margin-top: 6px!important; '>Live Chat</p></div>"+"</div>"+"</div> ";if(navigator.userAgent.indexOf('MSIE')>-1){$('input, textarea').placeholder({customClass:'my-placeholder'});}
$('#demoBlock').append(tile);$("#sampTile").fadeIn(700);$("#typedText").typed({strings:["This is a tile. ^500 ","When I'm clicked on, ^200 I open up ^500 "],typeSpeed:55,backDelay:500,loop:false,contentType:'html',loopCount:false,callback:function(){showChatTile();},});clearInterval(timer);},2200);}
function showChatTile(){var timer22=setInterval(function(){$("#sampTile").css('background-color','#DFF1FF');clearInterval(timer22);},1000);var timer33=setInterval(function(){$("#sampTile").css('background-color','#f8f8f8');clearInterval(timer33);},1400);var timer=setInterval(function(){$('#chatBox').html("");displayBanner("Now chatting with","SonicChat");appendMessageIn("SonicChat","");clearInterval(timer);},2200);var timer3=setInterval(function(){displayNowTyping(true,true);clearInterval(timer3);},3500);var timer7=setInterval(function(){displayNowTyping(false,false);appendMessageIn("SonicChat","  This is a chat tile!");clearInterval(timer7);},6500);var timer8=setInterval(function(){displayNowTyping(true,true);clearInterval(timer8);},8000);var timer4=setInterval(function(){displayNowTyping(false,false);appendMessageOut("Wow, I can talk to my customers when I select this tile?");clearInterval(timer4);},10500);var timer9=setInterval(function(){displayNowTyping(true,true);clearInterval(timer9);},12500);var timer15=setInterval(function(){displayNowTyping(false,false);appendMessageIn("SonicChat"," Yes you can!");clearInterval(timer15);},14000);var timer90=setInterval(function(){displayNowTyping(true,true);clearInterval(timer90);},16000);var timer10=setInterval(function(){displayNowTyping(false,false);appendMessageIn("SonicChat"," Tiles allow you to customize your widget with powerful functions. Lets take a closer look!");clearInterval(timer10);},18500);var timer11=setInterval(function(){showTiles();clearInterval(timer11);},21000);}
function showTiles(){var timer=setInterval(function(){$("#demoBlock").fadeOut(1000);resetDemoBlock();itemDisplay=true;displayTileSelection();changeChatTopMessage("About Me","",true);$("#chatBox").animate({scrollTop:$('#aboutTile').offset().top},13100);clearInterval(timer);},3500);var timer2=setInterval(function(){resetDemoBlock();ticketPres();clearInterval(timer2);},8500);}
function ticketPres(){var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: none;' class='icon fa-th-large'>"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -15px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$("#logo1").fadeIn(1000);$("#typedText").typed({strings:["^800 Choose tiles that fit your needs","For example... ^300 ","The ticket tile ^500"],typeSpeed:55,backDelay:500,loop:false,contentType:'html',loopCount:false,callback:function(){showTicketPres();},});}
function showTicketPres(){var timer66=setInterval(function(){displayTicketSelection();changeChatTopMessage("About Me","",true);itemDisplay=false;displayTicketForm();$("#messageInput").prop('disabled',true);$("#messageInput").attr("placeholder","My Introduction");clearInterval(timer66);},2000);mapPres();}
function mapPres(){var timer67=setInterval(function(){resetDemoBlock();var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 40px!important; font-size: 70px!important; display: none;' class='icon fa-map-marker'>"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -12px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$("#logo1").fadeIn(1000);$("#typedText").typed({strings:["^1000 The world is a big place ^300 ","People get lost ^300 ","So, ^400 don't let them. ^500 "],typeSpeed:55,backDelay:500,loop:false,contentType:'html',loopCount:false,callback:function(){showMap();},});clearInterval(timer67);},6500);}
function showMap(){var timer55=setInterval(function(){displayMap();$("#messageInput").prop('disabled',true);$("#messageInput").attr("placeholder","My Introduction");changeChatTopMessage("About Me","",true);itemDisplay=false;clearInterval(timer55);},2000);var timer59=setInterval(function(){hiddenTileWordsPres();clearInterval(timer59);},8500);}
function hiddenTileWordsPres(){resetDemoBlock();var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: none;' class='icon fa-bar-chart'>"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -13px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$("#logo1").fadeIn(1000);$("#typedText").typed({strings:["^1000 Some of my tiles are hidden... ^300","These tiles keep valuable secrets! ^300","or.. ^300 umm..","what you would call... ^300","Customer Statistics ^2700"],typeSpeed:55,backDelay:500,loop:false,contentType:'html',loopCount:false,callback:function(){allTileWordsPres();},});}
function allTileWordsPres(){resetDemoBlock();var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: none;' class='icon fa-square-o'>"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -13px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$("#logo1").fadeIn(1000);$("#typedText").typed({strings:["^1000 I offer many tiles ^300","Choose what fits you best! ^1000",""],typeSpeed:55,backDelay:500,loop:false,contentType:'html',loopCount:false,callback:function(){allTileWordsPresFAST();},});}
function allTileWordsPresFAST(){resetDemoBlock();var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: block;' class='icon fa-square-o'>"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -13px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$("#typedText").typed({strings:["^500 Chat","Map","Ticket","Feedback","Appointment","Hidden","AnswerBase","Message","Tiles unique as your business. ^800 "],typeSpeed:42,backDelay:240,loop:false,contentType:'html',loopCount:false,callback:function(){endPres();},});}
function endPres(){var timer51=setInterval(function(){resetDemoBlock();var child="<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 10px; margin: auto; padding-top: 50px!important; font-size: 70px!important; display: none; '>"+"<img  src = 'https://s3-us-west-2.amazonaws.com/www.sonicchats.com/images/logoDark.png' style = 'display: block; margin: auto; width: 78%; margin-bottom: -15px; padding 0px!important; ' />"+"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; vertical-align: top; '>"+"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>"+"</div>"+"</div>";$('#demoBlock').append(child);$("#logo1").fadeIn(1000);$("#typedText").typed({strings:["^1000 Now, ^500 it's your turn","Try me out. ^800"],typeSpeed:60,backDelay:1000,loop:false,contentType:'html',loopCount:false,callback:function(){goHome();},});clearInterval(timer51);},3000);}
function goHome(){$("#messageInput").prop('disabled',true);$("#messageInput").attr("placeholder","Help and Support");introMusic.fadeOut(4500);var stopMusic=setInterval(function(){introMusic.stop();introMusic=null;clearInterval(stopMusic);},6000);var timerend=setInterval(function(){presStarted=false;resetDemoBlock();itemDisplay=true;displayTileSelection();changeChatTopMessage(siteName,"Support",false,false);clearInterval(timerend);},1500);}

// =============================== 3ED PARTY LIBRARY SUPPORT ===============================

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

//rateYo V2.0.1, A simple and flexible star rating plugin -- http://prrashi.github.io/rateYo/
!function(a){"use strict";function b(a,b,c){return a===b?a=b:a===c&&(a=c),a}function c(a,b,c){var d=a>=b&&c>=a;if(!d)throw Error("Invalid Rating, expected value between "+b+" and "+c);return a}function d(b,c){var d;return a.each(c,function(){return b===this.node?(d=this,!1):void 0}),d}function e(b,c){return a.each(c,function(a){if(b===this.node){var d=c.slice(0,a),e=c.slice(a+1,c.length);return c=d.concat(e),!1}}),c}function f(a){return"undefined"!=typeof a}function g(d,h){function i(a){f(a)||(a=h.rating);var b=a/I,c=b*K;b>1&&(c+=(Math.ceil(b)-1)*M),Q.css("width",c+"%")}function k(){N=J*h.numStars,N+=L*(h.numStars-1),K=J/N*100,M=L/N*100,d.width(N),i()}function l(a){return f(a)?(h.starWidth=h.starHeight=a,J=parseFloat(h.starWidth.replace("px","")),P.find("svg").attr({width:h.starWidth,height:h.starHeight}),Q.find("svg").attr({width:h.starWidth,height:h.starHeight}),k(),d):h.starWidth}function m(a){return f(a)?(h.spacing=a,L=parseFloat(h.spacing.replace("px","")),P.find("svg:not(:first-child)").css({"margin-left":a}),Q.find("svg:not(:first-child)").css({"margin-left":a}),k(),d):h.spacing}function n(a){return f(a)?(h.normalFill=a,P.find("svg").attr({fill:h.normalFill}),d):h.normalFill}function o(a){return f(a)?(h.ratedFill=a,Q.find("svg").attr({fill:h.ratedFill}),d):h.ratedFill}function p(b){if(!f(b))return h.numStars;h.numStars=b,I=h.maxValue/h.numStars,P.empty(),Q.empty();for(var c=0;c<h.numStars;c++)P.append(a(j)),Q.append(a(j));return l(h.starWidth),o(h.ratedFill),n(h.normalFill),m(h.spacing),i(),d}function q(a){return f(a)?(h.maxValue=a,I=h.maxValue/h.numStars,h.rating>a&&E(a),i(),d):h.maxValue}function r(a){return f(a)?(h.precision=a,i(),d):h.precision}function s(a){return f(a)?(h.halfStar=a,d):h.halfStar}function t(a){return f(a)?(h.fullStar=a,d):h.fullStar}function u(a){var b=a%I,c=I/2,d=h.halfStar,e=h.fullStar;return e||d?(e||d&&b>c?a+=I-b:(a-=b,b>0&&(a+=c)),a):a}function v(a){var b=P.offset(),c=b.left,d=c+P.width(),e=h.maxValue,f=a.pageX,g=0;if(c>f)g=R;else if(f>d)g=e;else{var i=(f-c)/(d-c);if(L>0){i*=100;for(var j=i;j>0;)j>K?(g+=I,j-=K+M):(g+=j/K*I,j=0)}else g=i*h.maxValue;g=u(g)}return g}function w(a){var c=v(a).toFixed(h.precision),e=h.maxValue;c=b(parseFloat(c),R,e),i(c),d.trigger("rateyo.change",{rating:c})}function x(){i(),d.trigger("rateyo.change",{rating:h.rating})}function y(a){var b=v(a).toFixed(h.precision);b=parseFloat(b),H.rating(b)}function z(a,b)
{h.onChange&&"function"==typeof h.onChange&&h.onChange.apply(this,[b.rating,H])}function A(a,b){h.onSet&&"function"==typeof h.onSet&&h.onSet.apply(this,[b.rating,H])}function B(){d.on("mousemove",w).on("mouseenter",w).on("mouseleave",x).on("click",y).on("rateyo.change",z).on("rateyo.set",A)}function C(){d.off("mousemove",w).off("mouseenter",w).off("mouseleave",x).off("click",y).off("rateyo.change",z).off("rateyo.set",A)}function D(a){return f(a)?(h.readOnly=a,d.attr("readonly",!0),C(),a||(d.removeAttr("readonly"),B()),d):h.readOnly}function E(a){if(!f(a))return h.rating;var e=a,g=h.maxValue;return"string"==typeof e&&("%"===e[e.length-1]&&(e=e.substr(0,e.length-1),g=100,q(g)),e=parseFloat(e)),c(e,R,g),e=parseFloat(e.toFixed(h.precision)),b(parseFloat(e),R,g),h.rating=e,i(),d.trigger("rateyo.set",{rating:e}),d}function F(a){return f(a)?(h.onSet=a,d):h.onSet}function G(a){return f(a)?(h.onChange=a,d):h.onChange}this.$node=d,this.node=d.get(0);var H=this;d.addClass("jq-ry-container");var I,J,K,L,M,N,O=a("<div/>").addClass("jq-ry-group-wrapper").appendTo(d),P=a("<div/>").addClass("jq-ry-normal-group").addClass("jq-ry-group").appendTo(O),Q=a("<div/>").addClass("jq-ry-rated-group").addClass("jq-ry-group").appendTo(O),R=0;this.rating=function(a){return f(a)?(E(a),d):h.rating},this.destroy=function(){return h.readOnly||C(),g.prototype.collection=e(d.get(0),this.collection),d.removeClass("jq-ry-container").children().remove(),d},this.method=function(a){if(!a)throw Error("Method name not specified!");if(!f(this[a]))throw Error("Method "+a+" doesn't exist!");var b=Array.prototype.slice.apply(arguments,[]),c=b.slice(1),d=this[a];return d.apply(this,c)},this.option=function(a,b){if(!f(a))return h;var c;switch(a){case"starWidth":c=l;break;case"numStars":c=p;break;case"normalFill":c=n;break;case"ratedFill":c=o;break;case"maxValue":c=q;break;case"precision":c=r;break;case"rating":c=E;break;case"halfStar":c=s;break;case"fullStar":c=t;break;case"readOnly":c=D;break;case"spacing":c=m;break;case"onSet":c=F;break;case"onChange":c=G;break;default:throw Error("No such option as "+a)}return c(b)},p(h.numStars),D(h.readOnly),this.collection.push(this),this.rating(h.rating)}function h(b){var c=g.prototype.collection,e=a(this);if(0===e.length)return e;var f=Array.prototype.slice.apply(arguments,[]);if(0===f.length)b=f[0]={};else{if(1!==f.length||"object"!=typeof f[0]){if(f.length>=1&&"string"==typeof f[0]){
var h=f[0],i=f.slice(1),j=[];return a.each(e,function(a,b){var e=d(b,c);if(!e)throw Error("Trying to set options before even initialization");var f=e[h];if(!f)throw Error("Method "+h+" does not exist!");var g=f.apply(e,i);j.push(g)}),j=1===j.length?j[0]:a(j)}throw Error("Invalid Arguments")}b=f[0]}return b=a.extend(JSON.parse(JSON.stringify(k)),b),a.each(e,function(){var e=d(this,c);return e?void 0:new g(a(this),a.extend({},b))})}function i(){return h.apply(this,Array.prototype.slice.apply(arguments,[]))}var j='<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1"xmlns="http://www.w3.org/2000/svg"viewBox="0 12.705 512 486.59"x="0px" y="0px"xml:space="preserve"><polygon id="star-icon"points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "/></svg>',k={starWidth:"32px",normalFill:"gray",ratedFill:"#63B8FD",numStars:5,maxValue:5,precision:1,rating:0,fullStar:!1,halfStar:!1,readOnly:!1,spacing:"0px",onChange:null,onSet:null};g.prototype.collection=[],window.RateYo=g,a.fn.rateYo=i}(jQuery);

// Animated Typing Library -- http://www.mattboldt.com/demos/typed-js/
!function(t){"use strict";var s=function(s,e){this.el=t(s),this.options=t.extend({},t.fn.typed.defaults,e),this.isInput=this.el.is("input"),this.attr=this.options.attr,this.showCursor=this.isInput?!1:this.options.showCursor,this.elContent=this.attr?this.el.attr(this.attr):this.el.text(),this.contentType=this.options.contentType,this.typeSpeed=this.options.typeSpeed,this.startDelay=this.options.startDelay,this.backSpeed=this.options.backSpeed,this.backDelay=this.options.backDelay,this.strings=this.options.strings,this.strPos=0,this.arrayPos=0,this.stopNum=0,this.loop=this.options.loop,this.loopCount=this.options.loopCount,this.curLoop=0,this.stop=!1,this.cursorChar=this.options.cursorChar,this.shuffle=this.options.shuffle,this.sequence=[],this.build()};s.prototype={constructor:s,init:function(){var t=this;t.timeout=setTimeout(function(){for(var s=0;s<t.strings.length;++s)t.sequence[s]=s;t.shuffle&&(t.sequence=t.shuffleArray(t.sequence)),t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos)},t.startDelay)},build:function(){this.showCursor===!0&&(this.cursor=t('<span class="typed-cursor">'+this.cursorChar+"</span>"),this.el.after(this.cursor)),this.init()},typewrite:function(t,s){if(this.stop!==!0){var e=Math.round(70*Math.random())+this.typeSpeed,o=this;o.timeout=setTimeout(function(){var e=0,r=t.substr(s);if("^"===r.charAt(0)){var i=1;/^\^\d+/.test(r)&&(r=/\d+/.exec(r)[0],i+=r.length,e=parseInt(r)),t=t.substring(0,s)+t.substring(s+i)}if("html"===o.contentType){var n=t.substr(s).charAt(0);if("<"===n||"&"===n){var a="",h="";for(h="<"===n?">":";";t.substr(s).charAt(0)!==h;)a+=t.substr(s).charAt(0),s++;s++,a+=h}}o.timeout=setTimeout(function(){if(s===t.length){if(o.options.onStringTyped(o.arrayPos),o.arrayPos===o.strings.length-1&&(o.options.callback(),o.curLoop++,o.loop===!1||o.curLoop===o.loopCount))return;o.timeout=setTimeout(function(){o.backspace(t,s)},o.backDelay)}else{0===s&&o.options.preStringTyped(o.arrayPos);var e=t.substr(0,s+1);o.attr?o.el.attr(o.attr,e):o.isInput?o.el.val(e):"html"===o.contentType?o.el.html(e):o.el.text(e),s++,o.typewrite(t,s)}},e)},e)}},backspace:function(t,s){if(this.stop!==!0){var e=Math.round(70*Math.random())+this.backSpeed,o=this;o.timeout=setTimeout(function(){if("html"===o.contentType&&">"===t.substr(s).charAt(0)){for(var e="";"<"!==t.substr(s).charAt(0);)e-=t.substr(s).charAt(0),s--;s--,e+="<"}var r=t.substr(0,s);o.attr?o.el.attr(o.attr,r):o.isInput?o.el.val(r):
"html"===o.contentType?o.el.html(r):o.el.text(r),s>o.stopNum?(s--,o.backspace(t,s)):s<=o.stopNum&&(o.arrayPos++,o.arrayPos===o.strings.length?(o.arrayPos=0,o.shuffle&&(o.sequence=o.shuffleArray(o.sequence)),o.init()):o.typewrite(o.strings[o.sequence[o.arrayPos]],s))},e)}}, shuffleArray:function(t){var s,e,o=t.length;if(o)for(;--o;)e=Math.floor(Math.random()*(o+1)),s=t[e],t[e]=t[o],t[o]=s;return t},reset:function(){var t=this;clearInterval(t.timeout);var s=this.el.attr("id");this.el.after('<span id="'+s+'"/>'),this.el.remove(),"undefined"!=typeof this.cursor&&this.cursor.remove(),t.options.resetCallback()}},t.fn.typed=function(e){return this.each(function(){var o=t(this),r=o.data("typed"),i="object"==typeof e&&e;r||o.data("typed",r=new s(this,i)),"string"==typeof e&&r[e]()})},t.fn.typed.defaults={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],typeSpeed:0,startDelay:0,backSpeed:0,shuffle:!1,backDelay:500,loop:!1,loopCount:!1,showCursor:!0,cursorChar:"|",attr:null,contentType:"html",callback:function(){},preStringTyped:function(){},onStringTyped:function(){},resetCallback:function(){}}}(window.jQuery);

// Image Text Library/Function - Check if image is loaded
(function($){$.fn.imgLoad=function(callback){return this.each(function(){if(callback){if(this.complete||$(this).height()>0){callback.apply(this);}
else{$(this).on('load',function(){callback.apply(this);});}}});};})(jQuery);

// Sound Library - http://buzz.jaysalvat.com/documentation/sound/
(function(t,e){"use strict";"undefined"!=typeof module&&module.exports?module.exports=e():"function"==typeof define&&define.amd?define([],e):t.buzz=e()})(this,function(){"use strict";var t=window.AudioContext||window.webkitAudioContext,e={defaults:{autoplay:!1,duration:5e3,formats:[],loop:!1,placeholder:"--",preload:"metadata",volume:80,webAudioApi:!1,document:window.document},types:{mp3:"audio/mpeg",ogg:"audio/ogg",wav:"audio/wav",aac:"audio/aac",m4a:"audio/x-m4a"},sounds:[],el:document.createElement("audio"),getAudioContext:function(){if(void 0===this.audioCtx)try{this.audioCtx=t?new t:null}catch(e){this.audioCtx=null}return this.audioCtx},sound:function(t,n){function i(t){for(var e=[],n=t.length-1,i=0;n>=i;i++)e.push({start:t.start(i),end:t.end(i)});return e}function u(t){return t.split(".").pop()}n=n||{};var s=n.document||e.defaults.document,r=0,o=[],a={},h=e.isSupported();if(this.load=function(){return h?(this.sound.load(),this):this},this.play=function(){return h?(this.sound.play(),this):this},this.togglePlay=function(){return h?(this.sound.paused?this.sound.play():this.sound.pause(),this):this},this.pause=function(){return h?(this.sound.pause(),this):this},this.isPaused=function(){return h?this.sound.paused:null},this.stop=function(){return h?(this.setTime(0),this.sound.pause(),this):this},this.isEnded=function(){return h?this.sound.ended:null},this.loop=function(){return h?(this.sound.loop="loop",this.bind("ended.buzzloop",function(){this.currentTime=0,this.play()}),this):this},this.unloop=function(){return h?(this.sound.removeAttribute("loop"),this.unbind("ended.buzzloop"),this):this},this.mute=function(){return h?(this.sound.muted=!0,this):this},this.unmute=function(){return h?(this.sound.muted=!1,this):this},this.toggleMute=function(){return h?(this.sound.muted=!this.sound.muted,this):this},this.isMuted=function(){return h?this.sound.muted:null},
this.setVolume=function(t){return h?(0>t&&(t=0),t>100&&(t=100),this.volume=t,this.sound.volume=t/100,this):this},this.getVolume=function(){return h?this.volume:this},this.increaseVolume=function(t){return this.setVolume(this.volume+(t||1))},this.decreaseVolume=function(t){return this.setVolume(this.volume-(t||1))},this.setTime=function(t){if(!h)return this;var e=!0;return this.whenReady(function(){e===!0&&(e=!1,this.sound.currentTime=t)}),this},this.getTime=function(){if(!h)return null;var t=Math.round(100*this.sound.currentTime)/100;return isNaN(t)?e.defaults.placeholder:t},this.setPercent=function(t){return h?this.setTime(e.fromPercent(t,this.sound.duration)):this},this.getPercent=function(){if(!h)return null;var t=Math.round(e.toPercent(this.sound.currentTime,this.sound.duration));return isNaN(t)?e.defaults.placeholder:t},this.setSpeed=function(t){return h?(this.sound.playbackRate=t,this):this},this.getSpeed=function(){return h?this.sound.playbackRate:null},this.getDuration=function(){if(!h)return null;var t=Math.round(100*this.sound.duration)/100;return isNaN(t)?e.defaults.placeholder:t},this.getPlayed=function(){return h?i(this.sound.played):null},this.getBuffered=function(){return h?i(this.sound.buffered):null},this.getSeekable=function(){return h?i(this.sound.seekable):null},this.getErrorCode=function(){return h&&this.sound.error?this.sound.error.code:0},this.getErrorMessage=function(){if(!h)return null;switch(this.getErrorCode()){case 1:return"MEDIA_ERR_ABORTED";case 2:return"MEDIA_ERR_NETWORK";case 3:return"MEDIA_ERR_DECODE";case 4:return"MEDIA_ERR_SRC_NOT_SUPPORTED";default:return null}},this.getStateCode=function(){return h?this.sound.readyState:null},this.getStateMessage=function(){if(!h)return null;switch(this.getStateCode()){case 0:return"HAVE_NOTHING";case 1:return"HAVE_METADATA";case 2:return"HAVE_CURRENT_DATA";case 3:return"HAVE_FUTURE_DATA";case 4:return"HAVE_ENOUGH_DATA";
default:return null}},this.getNetworkStateCode=function(){return h?this.sound.networkState:null},this.getNetworkStateMessage=function(){if(!h)return null;switch(this.getNetworkStateCode()){case 0:return"NETWORK_EMPTY";case 1:return"NETWORK_IDLE";case 2:return"NETWORK_LOADING";case 3:return"NETWORK_NO_SOURCE";default:return null}},this.set=function(t,e){return h?(this.sound[t]=e,this):this},this.get=function(t){return h?t?this.sound[t]:this.sound:null},this.bind=function(t,e){if(!h)return this;t=t.split(" ");for(var n=this,i=function(t){e.call(n,t)},u=0;t.length>u;u++){var s=t[u],r=s;s=r.split(".")[0],o.push({idx:r,func:i}),this.sound.addEventListener(s,i,!0)}return this},this.unbind=function(t){if(!h)return this;t=t.split(" ");for(var e=0;t.length>e;e++)for(var n=t[e],i=n.split(".")[0],u=0;o.length>u;u++){var s=o[u].idx.split(".");(o[u].idx===n||s[1]&&s[1]===n.replace(".",""))&&(this.sound.removeEventListener(i,o[u].func,!0),o.splice(u,1))}return this},this.bindOnce=function(t,e){if(!h)return this;var n=this;return a[r++]=!1,this.bind(t+"."+r,function(){a[r]||(a[r]=!0,e.call(n)),n.unbind(t+"."+r)}),this},this.trigger=function(t,e){if(!h)return this;t=t.split(" ");for(var n=0;t.length>n;n++)for(var i=t[n],u=0;o.length>u;u++){var r=o[u].idx.split(".");if(o[u].idx===i||r[0]&&r[0]===i.replace(".","")){var a=s.createEvent("HTMLEvents");a.initEvent(r[0],!1,!0),a.originalEvent=e,this.sound.dispatchEvent(a)}}return this},this.fadeTo=function(t,n,i){function u(){setTimeout(function(){t>s&&t>o.volume?(o.setVolume(o.volume+=1),u()):s>t&&o.volume>t?(o.setVolume(o.volume-=1),u()):i instanceof Function&&i.apply(o)},r)}if(!h)return this;n instanceof Function?(i=n,n=e.defaults.duration):n=n||e.defaults.duration;var s=this.volume,r=n/Math.abs(s-t),o=this;return this.play(),this.whenReady(function(){u()}),this},this.fadeIn=function(t,e){return h?this.setVolume(0).fadeTo(100,t,e):this},this.fadeOut=function(t,e){
return h?this.fadeTo(0,t,e):this},this.fadeWith=function(t,e){return h?(this.fadeOut(e,function(){this.stop()}),t.play().fadeIn(e),this):this},this.whenReady=function(t){if(!h)return null;var e=this;0===this.sound.readyState?this.bind("canplay.buzzwhenready",function(){t.call(e)}):t.call(e)},this.addSource=function(t){var n=this,i=s.createElement("source");return i.src=t,e.types[u(t)]&&(i.type=e.types[u(t)]),this.sound.appendChild(i),i.addEventListener("error",function(t){n.trigger("sourceerror",t)}),i},h&&t){for(var d in e.defaults)e.defaults.hasOwnProperty(d)&&void 0===n[d]&&(n[d]=e.defaults[d]);if(this.sound=s.createElement("audio"),n.webAudioApi){var l=e.getAudioContext();l&&(this.source=l.createMediaElementSource(this.sound),this.source.connect(l.destination))}if(t instanceof Array)for(var c in t)t.hasOwnProperty(c)&&this.addSource(t[c]);else if(n.formats.length)for(var f in n.formats)n.formats.hasOwnProperty(f)&&this.addSource(t+"."+n.formats[f]);else this.addSource(t);n.loop&&this.loop(),n.autoplay&&(this.sound.autoplay="autoplay"),this.sound.preload=n.preload===!0?"auto":n.preload===!1?"none":n.preload,this.setVolume(n.volume),e.sounds.push(this)}},group:function(t){function e(){for(var e=n(null,arguments),i=e.shift(),u=0;t.length>u;u++)t[u][i].apply(t[u],e)}function n(t,e){return t instanceof Array?t:Array.prototype.slice.call(e)}t=n(t,arguments),this.getSounds=function(){return t},this.add=function(e){e=n(e,arguments);for(var i=0;e.length>i;i++)t.push(e[i])},this.remove=function(e){e=n(e,arguments);for(var i=0;e.length>i;i++)for(var u=0;t.length>u;u++)if(t[u]===e[i]){t.splice(u,1);break}},this.load=function(){return e("load"),this},this.play=function(){return e("play"),this},this.togglePlay=function(){return e("togglePlay"),this},this.pause=function(t){return e("pause",t),this},this.stop=function(){return e("stop"),this},this.mute=function(){return e("mute"),this},this.unmute=function(){
return e("unmute"),this},this.toggleMute=function(){return e("toggleMute"),this},this.setVolume=function(t){return e("setVolume",t),this},this.increaseVolume=function(t){return e("increaseVolume",t),this},this.decreaseVolume=function(t){return e("decreaseVolume",t),this},this.loop=function(){return e("loop"),this},this.unloop=function(){return e("unloop"),this},this.setSpeed=function(t){return e("setSpeed",t),this},this.setTime=function(t){return e("setTime",t),this},this.set=function(t,n){return e("set",t,n),this},this.bind=function(t,n){return e("bind",t,n),this},this.unbind=function(t){return e("unbind",t),this},this.bindOnce=function(t,n){return e("bindOnce",t,n),this},this.trigger=function(t){return e("trigger",t),this},this.fade=function(t,n,i,u){return e("fade",t,n,i,u),this},this.fadeIn=function(t,n){return e("fadeIn",t,n),this},this.fadeOut=function(t,n){return e("fadeOut",t,n),this}},all:function(){return new e.group(e.sounds)},isSupported:function(){return!!e.el.canPlayType},isOGGSupported:function(){return!!e.el.canPlayType&&e.el.canPlayType('audio/ogg; codecs="vorbis"')},isWAVSupported:function(){return!!e.el.canPlayType&&e.el.canPlayType('audio/wav; codecs="1"')},isMP3Supported:function(){return!!e.el.canPlayType&&e.el.canPlayType("audio/mpeg;")},isAACSupported:function(){return!!e.el.canPlayType&&(e.el.canPlayType("audio/x-m4a;")||e.el.canPlayType("audio/aac;"))},toTimer:function(t,e){var n,i,u;return n=Math.floor(t/3600),n=isNaN(n)?"--":n>=10?n:"0"+n,i=e?Math.floor(t/60%60):Math.floor(t/60),i=isNaN(i)?"--":i>=10?i:"0"+i,u=Math.floor(t%60),u=isNaN(u)?"--":u>=10?u:"0"+u,e?n+":"+i+":"+u:i+":"+u},fromTimer:function(t){var e=(""+t).split(":");return e&&3===e.length&&(t=3600*parseInt(e[0],10)+60*parseInt(e[1],10)+parseInt(e[2],10)),e&&2===e.length&&(t=60*parseInt(e[0],10)+parseInt(e[1],10)),t},toPercent:function(t,e,n){var i=Math.pow(10,n||0);return Math.round(100*t/e*i)/i},fromPercent:function(t,e,n){var i=Math.pow(10,n||0);return Math.round(e/100*t*i)/i}};return e});


//************ SonicChat 2015 - End of JS File. STOP ************