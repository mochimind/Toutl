var Toutl = {};
Toutl.Chat = {};

Toutl.Chat.CreateChannel = function(message) {
	Toutl.ServerConnection.CreateRequest('create_chan', {'message': message, 'parent': Toutl.ChatLobby.curView}, function(id, params) {
		// TODO: this is a hack, we need to think more on what to do when a channel is created
		if (Toutl.ChatLobby.curView == 0) {
			Toutl.Channel.NewChannel(params.speaker, params.message, params.id);
		}		
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.HandleError = function(id, params) {
	alert('Error: ' + params.message);
};

Toutl.Chat.CreateMessage = function(message, parent) {
	Toutl.ServerConnection.CreateRequest("create_msg", {'message': message, 'parent': parent}, function(id, params) {
		if (Toutl.ChatLobby.curView == parent) {
			Toutl.MessageDisplay.ShowMsg(params.speaker, params.message);
		}		
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.UpdateName = function(newName) {
	Toutl.ServerConnection.CreateRequest('changename', {'newName': newName}, function(id, params) {
		Toutl.Landing.ChangeName(params.newName);
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.RequestView = function(channelID) {
	Toutl.ServerConnection.CreateRequest('changeview', {'channel': channelID}, function(id, params) {
		if (Toutl.ChatLobby.curView != params.parent) { 
			return; 
		}
		if (channelID == 0) {
			// TODO: this is a hack, change
			Toutl.MessageDisplay.DisplayChannels(params.messages);
		} else {
			Toutl.MessageDisplay.DisplayMessages(params.messages);
		}
	}, Toutl.Chat.HandleError);
};

$(function(){
	// connect to the socket
	Toutl.Landing.Init();
	Toutl.ServerConnection.Init();
	
});