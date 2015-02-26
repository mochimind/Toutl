$(function(){
	// connect to the socket
	var socket = io.connect('/socket');
	console.log("hit");
	
	// on connection to server get the id of person's room
	socket.on('connect', function(){
		socket.emit('connected', $("#chatName").val());
		showMsg("system", "loaded");
	});
	
	socket.on('receiveMsg', function(name, msg) {
		showMsg(name, msg);
	});
	
	socket.on('leaving', function(name) {
		showMsg("system", name + " is leaving");
	});
	
	function showMsg(speaker, data) {
		var li = document.createElement('li');
		li.innerHTML = "<b>"+ speaker + "</b>: " + data;
		$("#chatTable").append(li);
	}
	
	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		var msg = $("#chatInput").val().trim();
		if (!isValidChatter($("#chatName").val())) { return; }
		if (msg.length > 0) {
			showMsg("me", msg);
			// scroll to bottom
			// filter out html
			socket.emit("msg", msg);
		}
		
	});	
	
	$("#chatInput").keypress(function(e){

		// Submit the form on enter

		if(e.which == 13) {
			e.preventDefault();
			$("#chatForm").trigger('submit');
		}

	});

	
	function isValidChatter(name) {
		if (name.length) { return true; }
		showMsg("system", "you need to choose another name");
		return false;
	}
	
});