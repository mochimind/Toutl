Toutl.GUIDisplay = {};

Toutl.GUIDisplay.Init = function() {
	Toutl.GUIDisplay.myName = $("#chatName").val();
	$('#feeds').prop('disabled', true);
	$('#friendConvo').prop('disabled', true);
	$('#settings').prop('disabled', true);
	
	$('#channels').click(Toutl.GUIDisplay.LoadChannel);
	$('#feeds').click(Toutl.GUIDisplay.LoadFeeds);
	$('#friendConvo').click(Toutl.GUIDisplay.LoadFriends);
	$('#settings').click(Toutl.GUIDisplay.LoadSettings);

	$("#chatInput").keypress(function(e){
		// Submit the form on enter
		if(e.which == 13) {
			e.preventDefault();
			$("#chatForm").trigger('submit');
		}
	});
	
	$("#chatName").on("focusout", function(){
		var newName = $("#chatName").val();
		if (newName != Toutl.GUIDisplay.myName) {
			Toutl.GUIDisplay.myName = newName;
			Toutl.Chat.UpdateName(newName);
		}
	});
	
	Toutl.GUIDisplay.LoadChannels();
};

Toutl.GUIDisplay.LoadChannels = function() {
	$('#banner').text('Active Channels: ');
	$('#chatInput').prop('placeholder', 'new channel name');
	$('#back').hide();

	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		var msg = $("#chatInput").val().trim();
		if (!Toutl.GUIDisplay.IsValidChatter($("#chatName").val())) { return; }
		if (msg.length > 0) {
			$("#chatInput").val("");
			Toutl.Chat.CreateChannel(msg);
			// scroll to bottom
			// TODO: filter out html
			// TODO: check that the post was successful before posting it finally
			//sToutl.MessageDisplay.ShowMsg(myName, msg);
		}
		
	});		

};

Toutl.GUIDisplay.IsValidChatter = function (name) {
	if (name.length) { return true; }
	alert("you need to choose another name");
	return false;
};

Toutl.GUIDisplay.LoadMessages = function() {
	$('#back').show();
	$('#chatInput').prop('placeholder', 'chat text here');
	$('#banner').text('Channel Messages: ');
};

Toutl.GUIDisplay.LoadFeeds = function() {
	
};

Toutl.GUIDisplay.LoadFriends = function() {
	
};

Toutl.GUIDisplay.LoadSettings = function() {
	
};


