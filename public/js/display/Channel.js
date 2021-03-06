Toutl.Channel = {};


Toutl.Channel.NewChannel = function (id, data, speaker, unseen, lastMsgTime) {
	console.log("creating channel: " + id + "||" + data + "||" + speaker+"||" + unseen + "||" + lastMsgTime);
	var outObj = {};
	outObj.id = id;
	outObj.speaker = speaker;
	outObj.data = data;
	outObj.unseen = unseen;
	outObj.lastMsgTime = lastMsgTime;
	outObj.children = [];

	// didn't get the ternary to work, using something ugly
	var unseenCount = 0;
	if (unseen != null) {unseenCount = unseen;}
	
	outObj.displayObj = $("<li></li>")
		.addClass(Toutl.MessageDisplay.ParentClass)
		.prepend($("<div class='channelBody'><b>" + data + "</b> - " + speaker + "</div>"))
		.prepend($("<div class='channelMessageCount'>" + unseenCount + "</div>"));
	
	return outObj;
};

Toutl.Channel.GetNewMessages = function(channel) {
	var messagesSince = "all";
	if (channel.children.length != 0) {
		messagesSince = channel.lastMsgTime;
	}
	Toutl.ServerConnection.CreateRequest('new_messages', 
			{messagesSince: messagesSince, 
			channel: channel.id}, function(params) {
				if (params.lastMsgTime != null) {
					channel.lastMsgTime = params.lastMsgTime;
					channel.unseen = 0;
					for (var i=0 ; i<params.messages.length ; i++) {
						var newMsg = Toutl.Message.NewMessage(params.messages[i].poster, params.messages[i].msg, params.messages[i].created);
						channel.children.push(newMsg);
						Toutl.Message.DisplayMessage(newMsg);
					}						
				}
	}, Toutl.ChatLobby.HandleError);
	
};

Toutl.Channel.DisplayChannel = function(channel, summaryView, onClick) {
	console.log("displaying: " + channel.id + "||" + channel.displayObj);
	channel.summaryView = summaryView;
	Toutl.MessageDisplay.DisplayComponent(channel.displayObj);
	
	if (!summaryView) {
		Toutl.ChatLobby.activeChannel = channel;
		channel.displayObj.children(".channelMessageCount").hide();
		for (var i=0 ; i<channel.children.length ; i++) {
			Toutl.Message.DisplayMessage(channel.children[i]);
		}
		Toutl.Channel.GetNewMessages(channel);
	} else {
		channel.displayObj.children(".channelMessageCount").show();
		channel.displayObj.children(".channelMessageCount").text(channel.unseen == null ? 0 : channel.unseen);
		console.log("value is: " + channel.displayObj.children(".channelMessageCount").text());
		channel.displayObj.on('click', {'channel': channel, 'onClick': onClick}, Toutl.Channel.HandleClick);
	}
};

Toutl.Channel.HandleNewMessage = function(channel, params) {
	console.log("handling new msg: " + channel.id);
	Toutl.Chat.DEBUG(params);
	channel.lastMsgTime = params.lastMsgTime;
	channel.unseen = 0;
	var newMsg = Toutl.Message.NewMessage(params.poster, params.msg, params.created);
	Toutl.Message.DisplayMessage(newMsg);
};

Toutl.Channel.HideChannel = function(channel) {
	if (!channel.summaryView) {
		Toutl.ChatLoby.activeChannel = null;
	} else {
		channel.displayObj.off('click', Toutl.Channel.HandleClick);
	}
	Toutl.MessageDisplay.ClearMessageDisplay();
};

Toutl.Channel.HandleClick = function(event) {
	Toutl.MessageDisplay.ClearMessageDisplay();
	Toutl.Channel.DisplayChannel(event.data.channel, false, null);
	event.data.onClick();
};

Toutl.Channel.UserMessage = function(message) {
	var parent = Toutl.ChatLobby.activeChannel;
	Toutl.ServerConnection.CreateRequest("create_msg", {'message': message, 'parent': parent.id}, function(params) {
		var newMsg = Toutl.Message.NewMessage(params.speaker, params.message, params.time);
		if (Toutl.ChatLobby.activeChannel.id == parent.id) {
			Toutl.Message.DisplayMessage(newMsg);
		}
		parent.children.push(newMsg);
		parent.lastMsgTime = params.lastMsgTime;
	}, Toutl.Chat.HandleError);
};

/*
Toutl.Channel.BackButtonClicked = function() {
	// TODO: this will need to change because we need to display a subset of all channels
	Toutl.MessageDisplay.ClearMessageDisplay();
	Toutl.ChatLobby.LoadChannels();
	$('#back').off('click', Toutl.Channel.BackButtonClicked);
};
*/

Toutl.Channel.HandleUnreadMessage = function(channel, count) {
	console.log('new message!');
	if (channel.unseen != null) {
		channel.unseen += count;		
	} else {
		channel.unseen = count;
	}
	channel.displayObj.children(".channelMessageCount").text(channel.unseen);
};