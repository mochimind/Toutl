Toutl.ChatLobby = {};
Toutl.ChatLobby.channels = [];

Toutl.ChatLobby.activeChannel = null;

Toutl.ChatLobby.Init = function() {
	$('#feeds').prop('disabled', true);
	$('#friendConvo').prop('disabled', true);
	$('#settings').prop('disabled', true);
	
	$('#channels').click(Toutl.ChatLobby.LoadChannel);
	$('#feeds').click(Toutl.ChatLobby.LoadFeeds);
	$('#friendConvo').click(Toutl.ChatLobby.LoadFriends);
	$('#settings').click(Toutl.ChatLobby.LoadSettings);

	// TODO: add listeners for new channels
	Toutl.ServerConnection.RegisterListener('newmsg', Toutl.ChatLobby.UnreadMessage);	
	// TODO: add listeners for channels getting new messages
	Toutl.ServerConnection.RegisterListener('new_channel', Toutl.ChatLobby.ReceivedNewChannel);

	$("#chatBody").show();
	Toutl.ChatLobby.LoadChannels();
};

Toutl.ChatLobby.UnreadMessage = function(params) {
	if (Toutl.ChatLobby.activeChannel == null || params.channel != Toutl.ChatLobby.activeChannel.id) {
		for (var i=0 ; i<Toutl.ChatLobby.channels.length ; i++) {
			if (Toutl.ChatLobby.channels[i].id == params.channel) {
				Toutl.Channel.HandleUnreadMessage(Toutl.ChatLobby.channels[i], 1);
				return;
			}
		}	} else {
		// a new message came in, we need an immediate update
		//Toutl.Channel.HandleNewMessage(Toutl.ChatLobby.activeChannel, params);
		Toutl.Channel.GetNewMessages(Toutl.ChatLobby.activeChannel);
		return;
	}
	// conceivably, channel creation directives may come after corresponding messages
	var newChan = Toutl.Channel.NewChannel(params.id, "", "", 0, null);
	Toutl.ChatLobby.push(newChan);
};

Toutl.ChatLobby.ReceivedNewChannel = function(params) {
	var chanExists = false;
	for (var i=0 ; i<Toutl.ChatLobby.channels.length ; i++) {
		if (Toutl.ChatLobby.channels[i].id == params.id) {
			chanExists = true;
			break;
		}
	}
	if (chanExists) {
		Toutl.ChatLobby.channels[i].data = params.data;
		Toutl.ChatLobby.channels[i].speaker = params.speaker;
		Toutl.ChatLobby.channels[i].unseen = params.messages;		
	} else {
		var newChan = Toutl.Channel.NewChannel(params.id,
				params.data,
				params.speaker,
				params.messages,
				null);		
	}
	
	Toutl.ChatLobby.channels.push(newChan);
	if (Toutl.ChatLobby.activeChannel == null) {
		Toutl.Channel.DisplayChannel(newChan, true, Toutl.ChatLobby.LoadMessages);
	}
	
};

Toutl.ChatLobby.LoadChannels = function() {
	Toutl.ServerConnection.CreateRequest('loadchannels', null, function(params) {
		if (Toutl.ChatLobby.activeChannel != null) {
			return;
		}
		
		for (var i=0 ; i<params.messages.length ; i++) {
			var newChan = Toutl.Channel.NewChannel(params.messages[i].ID, params.messages[i].message, params.messages[i].poster, params.messages[i].unread, null);
			Toutl.ChatLobby.channels.push(newChan);
			Toutl.Channel.DisplayChannel(newChan, true, Toutl.ChatLobby.LoadMessages);
		}
	}, Toutl.Chat.HandleError);
};

Toutl.ChatLobby.DisplayChannels = function() {
	$('#banner').text('Active Channels: ');
	$('#chatInput').prop('placeholder', 'new channel name');
	$('#back').hide();
	
	Toutl.MessageDisplay.ClearMessageDisplay();
	for (var i=0 ; i<Toutl.ChatLobby.channels.length ; i++) {
		Toutl.Channel.DisplayChannel(Toutl.ChatLobby.channels[i], true, Toutl.ChatLobby.LoadMessages);
	}
};

Toutl.ChatLobby.LoadMessages = function() {
	$('#back').show();
	$('#back').on('click', Toutl.ChatLobby.BackButtonClicked);

	$('#chatInput').prop('placeholder', 'chat text here');
	$('#banner').text('Channel Messages: ');
	
	// TODO: populate the back button
};

Toutl.ChatLobby.BackButtonClicked = function() {
	$('#back').off('click', Toutl.ChatLobby.BackButtonClicked);
	Toutl.ChatLobby.DisplayChannels();
	Toutl.ChatLobby.activeChannel = null;
	Toutl.ChatLobby.isLobbyMode = true;
};

Toutl.ChatLobby.UserChannel = function(message) {
	Toutl.ServerConnection.CreateRequest('create_chan', {'message': message, 'parent': 0}, function(params) {
		// TODO: this is a hack, we need to think more on what to do when a channel is created
		var newChan = Toutl.Channel.NewChannel(params.id, params.message, params.speaker, 0, null);
		
		// TODO: this is a hack, there can be multiple lobbies
		if (Toutl.Channel.currentChannel == null) {
			Toutl.Channel.DisplayChannel(newChan, false, Toutl.ChatLobby.LoadMessages);
		}
		Toutl.ChatLobby.channels.push(newChan);
	}, Toutl.Chat.HandleError);
};

Toutl.ChatLobby.HandleError = function(errorMsg) {
	alert(errorMsg);
};

Toutl.ChatLobby.LoadFeeds = function() {
	
};

Toutl.ChatLobby.LoadFriends = function() {
	
};

Toutl.ChatLobby.LoadSettings = function() {
	
};


