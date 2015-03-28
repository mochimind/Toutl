Toutl.Inputs = {};

Toutl.Inputs.isLobbyMode = false;

Toutl.Inputs.Init = function() {
	$("#chatInput").keypress(function(e){
		// Submit the form on enter
		if(e.which == 13) {
			e.preventDefault();
			$("#chatForm").trigger('submit');
		}
	});
	
	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		Toutl.Inputs.SubmitMessage();
	});
};

Toutl.Inputs.SubmitMessage = function() {
	var msg = $("#chatInput").val().trim();
	if (msg.length > 0) {
		$("#chatInput").val("");
		if (Toutl.Inputs.isLobbyMode) {
			Toutl.ChatLobby.UserChannel(msg);
		} else {
			Toutl.Channel.UserMessage(msg);
		}
		// TODO: filter out html
		// TODO: check that the post was successful before posting it finally
	}
};

