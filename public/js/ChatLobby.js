Toutl.ChatLobby = {};
Toutl.ChatLobby.Init = function() {
	$('#feeds').prop('disabled', true);
	$('#friendConvo').prop('disabled', true);
	$('#settings').prop('disabled', true);
	
	$('#channels').click(Toutl.ChatLobby.LoadChannel);
	$('#feeds').click(Toutl.ChatLobby.LoadFeeds);
	$('#friendConvo').click(Toutl.ChatLobby.LoadFriends);
	$('#settings').click(Toutl.ChatLobby.LoadSettings);

	$("#chatInput").keypress(function(e){
		// Submit the form on enter
		if(e.which == 13) {
			e.preventDefault();
			$("#chatForm").trigger('submit');
		}
	});
	
	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		Toutl.ChatLobby.SubmitMessage();
	});	
	
	$("#chatBody").show();
	Toutl.ChatLobby.LoadChannels();
};

Toutl.ChatLobby.SubmitMessage = function() {
	var msg = $("#chatInput").val().trim();
	if (msg.length > 0) {
		$("#chatInput").val("");
		if (Toutl.ChatLobby.isLobbyMode) {
			Toutl.Chat.CreateChannel(msg);
		} else {
			Toutl.Chat.CreateMessage(msg, Toutl.ChatLobby.curView);
		}
		// TODO: filter out html
		// TODO: check that the post was successful before posting it finally
	}
};

Toutl.ChatLobby.LoadChannels = function() {
	// TODO: this is a hack, we will have many different ways to sort in the future
	Toutl.ChatLobby.curView = 0;
	Toutl.ChatLobby.isLobbyMode = true;

	$('#banner').text('Active Channels: ');
	$('#chatInput').prop('placeholder', 'new channel name');
	$('#back').hide();

	Toutl.Chat.RequestView(0);
};

Toutl.ChatLobby.LoadMessages = function(chanID) {
	Toutl.ChatLobby.curView = chanID;
	Toutl.ChatLobby.isLobbyMode = false;
	$('#back').show();
	$('#chatInput').prop('placeholder', 'chat text here');
	$('#banner').text('Channel Messages: ');	
};

Toutl.ChatLobby.LoadFeeds = function() {
	
};

Toutl.ChatLobby.LoadFriends = function() {
	
};

Toutl.ChatLobby.LoadSettings = function() {
	
};


