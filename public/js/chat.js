var Toutl = {};

$(function(){
	// connect to the socket
	var socket = io.connect('/socket');
	//console.log("hit");
	var myName = $("#chatName").val();
	
	// on connection to server get the id of person's room
	socket.on('connect', function(){
		socket.emit('connected', myName);
		socket.emit('init');
	});
	
	socket.on('updateview', function(parent, children) {
		Toutl.Interface.ChangeView(parent, children);		
	});
	
	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		var msg = $("#chatInput").val().trim();
		if (!isValidChatter($("#chatName").val())) { return; }
		if (msg.length > 0) {
			showMsg("me", msg);
			$("#chatInput").val("");
			// scroll to bottom
			// filter out html
			socket.emit("msg", msg);
		}
		
	});	
	
	$("#chatName").on("focusout", function(){
		var newName = $("#chatName").val();
		if (newName != myName) {
			myName = newName;
			socket.emit("changename", newName);
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