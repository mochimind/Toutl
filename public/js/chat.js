var Toutl = {};
Toutl.Chat = {};

Toutl.Chat.HandleError = function(params) {
	alert('Error: ' + params.message);
};

Toutl.Chat.UpdateName = function(newName) {
	Toutl.ServerConnection.CreateRequest('changename', {'newName': newName}, function(params) {
		Toutl.Landing.ChangeName(params.newName);
	}, Toutl.Chat.HandleError);
};

Toutl.Chat.RequestView = function(channelID) {
	Toutl.ServerConnection.CreateRequest('changeview', {'channel': channelID}, function(params) {
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
	Toutl.Inputs.Init();
	Toutl.Landing.Init();
	Toutl.ServerConnection.Init();
	
});