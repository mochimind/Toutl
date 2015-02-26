$(function(){
	// connect to the socket
	var socket = io.connect('/socket');
	console.log("hit");
	
	// on connection to server get the id of person's room
	socket.on('connect', function(){

		socket.emit('load');
		showMsg("system", "loaded");
	});
	
	function showMsg(speaker, data) {
		var li = document.createElement('li');
		li.innerHTML = "<b>"+ speaker + "</b>: " + data;
		$("#chatTable").append(li);
	}
	
	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		var msg = $("#chatInput").val().trim();
		if (!isValidChatterName($("#chatName").value)) { return; }
		if (msg.length > 0) {
			showMsg("me", msg);
			// scroll to bottom
			// filter out html
			socket.emit("msg", $("#chatName").value, msg);
		}
		
	});	
	
	function isValidChatter(name) {
		if (name.length) { return true; }
		showMsg("system", "you need to choose another name");
		return false;
	}
	
});