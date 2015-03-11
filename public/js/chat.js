var Toutl = {};
Toutl.Chat = {};

Toutl.Chat.CreateChannel = function(message) {
	Toutl.ServerConnection.CreateRequest('create_chan', {'message': message}, function(id, params) {
		// TODO: this is a hack, we need to think more on what to do when a channel is created
		if (Toutl.GUIDisplay.curView == 0) {
			Toutl.MessageDisplay.NewChannel(params.speaker, params.message, params.id);
		}		
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.HandleError = function(id, params) {
	alert('Error: ' + params.message);
};

Toutl.Chat.CreateMessage = function(message, parent) {
	Toutl.ServerConnection.CreateRequest("create_msg", {'message': message, 'parent': parent}, function(id, params) {
		if (Toutl.GUIDisplay.curView == params.parent) {
			Toutl.MessageDisplay.ShowMsg(params.speaker, params.message);
		}		
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.UpdateName = function(newName) {
	Toutl.ServerConnection.CreateRequest('changename', {'newName': newName}, function(id, params) {
		Toutl.GUIDisplay.changeName(params.newName);
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.RequestView = function(channelID) {
	Toutl.ServerConnection.CreateRequest('changeview', {'channel': channelID}, function(id, params) {
		if (Toutl.MessageDisplay.parentID != params.parent) { return; }
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
	Toutl.ServerConnection.Init();
	Toutl.GUIDisplay.Init();
	
});