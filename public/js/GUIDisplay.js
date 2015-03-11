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
		if (!Toutl.GUIDisplay.IsValidChatter($("#chatName").val())) { return; }
		var newName = $("#chatName").val();
		$('#chatName').val("changing name")
			.prop('disabled', true);
		if (newName != Toutl.GUIDisplay.myName) {
			Toutl.Chat.UpdateName(newName);
		}
	});
	
	Toutl.GUIDisplay.LoadChannels();
};

Toutl.GUIDisplay.LoadChannels = function() {
	// TODO: this is a hack, we will have many different ways to sort in the future
	Toutl.GUIDisplay.curView = 0;
	$('#banner').text('Active Channels: ');
	$('#chatInput').prop('placeholder', 'new channel name');
	$('#back').hide();

	$("#chatForm").on("submit", function(e) {
		e.preventDefault();
		var msg = $("#chatInput").val().trim();
		if (msg.length > 0) {
			$("#chatInput").val("");
			Toutl.Chat.CreateChannel(msg);
			// TODO: filter out html
			// TODO: check that the post was successful before posting it finally
		}
	});		

	Toutl.Chat.RequestView(0);
};

Toutl.GUIDisplay.IsValidChatter = function (name) {
	if (name.length) { return true; }
	alert("you need to choose another name");
	return false;
};

Toutl.GUIDisplay.ChangeName = function(name) {
	Toutl.GUIDisplay.myName = name;
	$('#chatName').val(name)
		.prop('disabled', false);
};

Toutl.GUIDisplay.LoadMessages = function(chanID) {
	Toutl.GUIDisplay.curView = chanID;
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


