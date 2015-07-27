// =============================== Automated Introduction ===============================
var introMusic;
function startIntroducton() {
	
	$("#messageInput").prop('disabled', true);
	$("#messageInput").attr("placeholder", "My Introduction");
	
	var styleP = "<style>" +
					".typed-cursor{opacity:1;-webkit-animation:blink 0.7s infinite;-moz-animation:blink 0.7s infinite;animation:blink 0.7s infinite;}" +
					 "@keyframes blink{0%{opacity:1;} 50%{opacity:0;} 100%{opacity:1;}}@-webkit-keyframes blink{0%{opacity:1;} 50%{opacity:0;} 100%{opacity:1;}}@-moz-keyframes blink{0%{opacity:1;} 50%{opacity:0;} 100%{opacity:1;}}" + 
				 "</style>";
	
	$('body').append(styleP); // Clear the chat box first
	
	// Begin music
	introMusic = new buzz.sound("https://s3-us-west-2.amazonaws.com/www.sonicchats.com/music/promotionMusic.mp3");
	resetDemoBlock();
	startPres();
}

function resetDemoBlock() {
	itemDisplay = false;
	// Reset height of chat box if changed
	if ($("#chatBox").height() > 200) {
		$("#chatContainer").animate({width:'290px'});
		$("#chatBox").animate({height:'200px'});
	}
	var demoBlock = "<div  id  = 'demoBlock' style = 'width: 90%!important;  margin: auto!important;  padding-top: 3px!important;  display: block; '>" + "</div>";
			$('#chatBox').html(""); // Clear the chat box first
			$('#chatBox').append(demoBlock);
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			} 
}

function startPres() {
		// displayLoading("#chatBox", true);
		presStarted = true;
		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 10px; margin: auto; padding-top: 50px!important; font-size: 70px!important; display: none; '>" + 
		"<img  id = 'logoImage2' src = 'https://s3-us-west-2.amazonaws.com/www.sonicchats.com/images/logoDark.png' style = 'display: block; margin: auto; width: 78%; margin-bottom: -15px; padding 0px!important; ' />" +
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
				
		$('#demoBlock').append(child);
	
				
	$('#logoImage2').imgLoad(function(){
		// Start Music
		introMusic.fadeIn(4000).setVolume(75);


		//displayLoading("#chatBox", false);
			$("#logo1").fadeIn(1000);
			   $("#typedText").typed({
            strings: [" ^1000 Hello, ^800 I'm " + "<span style = 'color: #59AFFF!important; margin-bottom: 6px!important; font-weight: 600!important;'>SonicChat</span>", "I'm All-In-One ^300", "simple to use ^300 " , "and extremely versatile. ^300"],
            typeSpeed: 55,
            backDelay: 1000,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				displayTilePres();
			}, 
        });
});	
}

function displayTilePres() {
	var timer = setInterval(function () {
	resetDemoBlock();

	iconColor = "#63B8FD";
	tileColor = "#f8f8f8";
	tileHoverColor = "#DFF1FF";
	var tile =  "<div id = 'itemBlock' style = 'color: #63B8FD; text-align: center;  margin-bottom: 15px; padding-bottom: 15px; line-height: 100%!important; margin: auto; margin-top: 12px; padding-top: 15px!important; display: block;'" + 
			
					"<div style = 'width: 100%; margin-top: 0px;   display: inline-block; font-size: 16px; vertical-align: top; '>" +
									"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
							"</div>" + 	
					"</div>" +
					
					"<div class = 'wedge' id = 'sampTile' onClick = '' style = 'margin: auto; font-size: 31px!important; padding:0px!important; width:49%!important; margin-bottom: 5px!important; height: 72px!important;  display: none;  background-color:" + tileColor +";' >" +
						"<div style = 'color:" + iconColor +"; text-align: center; line-height: 100%!important;  margin: auto; padding-top: 13px!important; font-size: 31px!important;' class='icon fa-comments'><p style = 'font-size: 15px!important; cursor: default; margin: 0px;  line-height: 100%!important; padding: 0px; color: #716F6F!important;  margin-top: 6px!important; '>Live Chat</p></div>" +
						"</div>" +	
					"</div> ";
						
			// IF IE: place-holder support
			if (navigator.userAgent.indexOf('MSIE') > -1){
				$('input, textarea').placeholder({customClass:'my-placeholder'});
			}
			
			$('#demoBlock').append(tile);
			$("#sampTile").fadeIn(700);
					
	   $("#typedText").typed({
            strings: ["This is a tile. ^500 ", "When I'm clicked on, ^200 I open up ^500 "],
            typeSpeed: 55,
            backDelay: 500,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
			showChatTile();
			}, 
        });

	clearInterval(timer); // Stop timer
	}, 2200);		
}

function showChatTile() {
	// Automated icon Click
	var timer22 = setInterval(function () {
		$("#sampTile").css('background-color', '#DFF1FF');
		clearInterval(timer22); // Stop timer
	}, 1000);
	
	var timer33 = setInterval(function () {
		$("#sampTile").css('background-color', '#f8f8f8');
		clearInterval(timer33); // Stop timer
	}, 1400);
			
	// start automated chat
	var timer = setInterval(function () {
		$('#chatBox').html(""); // Clear the chat box first
		displayBanner("Now chatting with","SonicChat");
		appendMessageIn("SonicChat", "");
		clearInterval(timer); // Stop timer
	}, 2200);
	
	var timer3 = setInterval(function () {
		displayNowTyping(true, true);
		clearInterval(timer3); // Stop timer
	}, 3500);
	
	var timer7 = setInterval(function () {
		displayNowTyping(false, false);
		appendMessageIn("SonicChat", "  This is a chat tile!");
		clearInterval(timer7); // Stop timer
	}, 6500);
	
	var timer8 = setInterval(function () {
		displayNowTyping(true, true);
		clearInterval(timer8); // Stop timer
	}, 8000);
	
	var timer4 = setInterval(function () {
		displayNowTyping(false, false);
		appendMessageOut("Wow, I can talk to my customers when I select this tile?");
		clearInterval(timer4); // Stop timer
	}, 10500);
	
	var timer9 = setInterval(function () {
		displayNowTyping(true, true);
		clearInterval(timer9); // Stop timer
	}, 12500);
	
	var timer15 = setInterval(function () {
		displayNowTyping(false, false);
		appendMessageIn("SonicChat", " Yes you can!");
		clearInterval(timer15); // Stop timer
	}, 14000);
	
	var timer90 = setInterval(function () {
		displayNowTyping(true, true);
		clearInterval(timer90); // Stop timer
	}, 16000);
	
	var timer10 = setInterval(function () {
		displayNowTyping(false, false);
		appendMessageIn("SonicChat", " Tiles allow you to customize your widget with powerful functions. Lets take a closer look!");
		clearInterval(timer10); // Stop timer
	}, 18500);
	
	// End of automated chat
	var timer11 = setInterval(function () {
		showTiles();
		clearInterval(timer11); // Stop timer
	}, 21000);
	
}

function showTiles() {
	var timer = setInterval(function () {
	$("#demoBlock").fadeOut(1000);
	resetDemoBlock();
	itemDisplay = true;
	displayTileSelection();
	changeChatTopMessage("About Me", "", true);
	
	// Scroll to bottom
	$("#chatBox").animate({
	scrollTop: $('#aboutTile').offset().top
	}, 13100);
	
	clearInterval(timer); // Stop timer
	}, 3500);
	
	var timer2 = setInterval(function () {
		resetDemoBlock();
		ticketPres();
		clearInterval(timer2); // Stop timer
	}, 8500);
}

function ticketPres() {
		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: none;' class='icon fa-th-large'>" + 
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -15px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
		$('#demoBlock').append(child);
		$("#logo1").fadeIn(1000);
				
	   $("#typedText").typed({
            strings: ["^800 Choose tiles that fit your needs", "For example... ^300 ", "The ticket tile ^500"],
            typeSpeed: 55,
            backDelay: 500,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				 showTicketPres();
			}, 
        });
}

function showTicketPres() {
	var timer66 = setInterval(function () {
		displayTicketSelection();
		changeChatTopMessage("About Me", "", true);
		itemDisplay = false;
		displayTicketForm();
		
		$("#messageInput").prop('disabled', true);
		$("#messageInput").attr("placeholder", "My Introduction");
		
		clearInterval(timer66); // Stop timer
	}, 2000);
	mapPres();
}

function mapPres() {
var timer67 = setInterval(function () {
		resetDemoBlock();

		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 40px!important; font-size: 70px!important; display: none;' class='icon fa-map-marker'>" + 
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -12px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
				
		$('#demoBlock').append(child);
		$("#logo1").fadeIn(1000);
				
	   $("#typedText").typed({
		    strings: ["^1000 The world is a big place ^300 " , "People get lost ^300 ", "So, ^400 don't let them. ^500 "],
            typeSpeed: 55,
            backDelay: 500,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				 showMap();
			}, 
        });
	clearInterval(timer67); // Stop timer
}, 6500);

}

function showMap(){
	var timer55 = setInterval(function () {
		displayMap();
		
		$("#messageInput").prop('disabled', true);
		$("#messageInput").attr("placeholder", "My Introduction");
		
		changeChatTopMessage("About Me", "", true);
		itemDisplay = false;
		clearInterval(timer55); // Stop timer
	}, 2000);
	
	var timer59 = setInterval(function () {
		hiddenTileWordsPres();
		clearInterval(timer59); // Stop timer
	}, 8500);
} 


function hiddenTileWordsPres() {
		resetDemoBlock();

		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: none;' class='icon fa-bar-chart'>" + 
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -13px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
				
		$('#demoBlock').append(child);
		$("#logo1").fadeIn(1000);
				
	   $("#typedText").typed({
            strings: ["^1000 Some of my tiles are hidden... ^300" , "These tiles keep valuable secrets! ^300" , "or.. ^300 umm..", "what you would call... ^300", "Customer Statistics ^2700"],
            typeSpeed: 55,
            backDelay: 500,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				 allTileWordsPres();
			}, 
        });
}

function allTileWordsPres() {
		resetDemoBlock();
		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: none;' class='icon fa-square-o'>" + 
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -13px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
				
		$('#demoBlock').append(child);
		$("#logo1").fadeIn(1000);
				
	   $("#typedText").typed({
            strings: ["^1000 I offer many tiles ^300", "Choose what fits you best! ^1000", ""],
            typeSpeed: 55,
            backDelay: 500,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				 allTileWordsPresFAST();
			}, 
        });
}

function allTileWordsPresFAST() {
		resetDemoBlock();
		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 12px; margin: auto; padding-top: 45px!important; font-size: 70px!important; display: block;' class='icon fa-square-o'>" + 
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; margin-top: -13px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
				
		$('#demoBlock').append(child);
	
	   $("#typedText").typed({
            strings: ["^500 Chat", "Map", "Ticket", "Feedback", "Appointment", "Hidden", "AnswerBase", "Message", "Tiles unique as your business. ^800 " ],
            typeSpeed: 42,
            backDelay: 240,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				endPres();
			}, 
        });
}

function endPres() {
	var timer51 = setInterval(function () {
		resetDemoBlock();
		var child = "<div id = 'logo1' style = 'color: #63B8FD; text-align: center;  line-height: 100%!important; margin-top: 10px; margin: auto; padding-top: 50px!important; font-size: 70px!important; display: none; '>" + 
		"<img  src = 'https://s3-us-west-2.amazonaws.com/www.sonicchats.com/images/logoDark.png' style = 'display: block; margin: auto; width: 78%; margin-bottom: -15px; padding 0px!important; ' />" +
				"<div style = 'width: 100%; margin-top: 0px; display: inline-block; font-size: 16px; vertical-align: top; '>" +
								"<span id = 'typedText' style = 'display: inline-block; padding: 0px!important; text-align: center; vertical-align: top; font-size: 16px; '> </span>" +
						"</div>" + 	
				"</div>";
				
		$('#demoBlock').append(child);
		$("#logo1").fadeIn(1000);
				
	   $("#typedText").typed({
            strings: ["^1000 Now, ^500 it's your turn", "Try me out. ^800"],
            typeSpeed: 60,
            backDelay: 1000,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
            callback: function(){ // Calls when finished
				goHome();
			}, 
        });
		clearInterval(timer51); // Stop timer
	}, 3000);
}

function goHome() {
	
	$("#messageInput").prop('disabled', true);
	$("#messageInput").attr("placeholder", "Help and Support");
	
	// Stop music
	introMusic.fadeOut(4500);
	
	var stopMusic = setInterval(function () {
	introMusic.stop();
	introMusic = null;
	}, 6000);
	
	var timerend = setInterval(function () {
		presStarted = false;
		resetDemoBlock();
		itemDisplay = true;
		displayTileSelection();
		changeChatTopMessage(siteName, "Support", false, false);
		clearInterval(timerend); // Stop timer
	}, 1500);
}