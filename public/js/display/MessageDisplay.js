Toutl.MessageDisplay = {};
Toutl.MessageDisplay.parentID = 0;
Toutl.MessageDisplay.components = [];
Toutl.MessageDisplay.ParentClass = "chatParent";
Toutl.MessageDisplay.ChildClass = "chatChild";

Toutl.MessageDisplay.DisplayChannels = function(children) {
	console.log('displaying channels');
	// this is the top level view
	Toutl.MessageDisplay.ClearMessageDisplay();

	var childCount = children.length;
	console.log('count is: ' + childCount);
	for (var i=0 ; i<children.length ; i++) {
		var newMsg = Toutl.Channel.NewChannel(children[i].poster, children[i].msg, children[i].ID, true);
		Toutl.MessageDisplay.components.push(newMsg.displayObj);
	}
};

Toutl.MessageDisplay.DisplayComponent = function(component) {
	children.push(component);
	$("#chatTable").append(component);
	$("#chatTable").scrollTop($("#chatTable")[0].scrollHeight);
};

Toutl.MessageDisplay.DisplayMessages = function(children) {
	var childCount = children.length;
	for (var i=0 ; i<children.length ; i++) {
		console.log("adding 1");
		Toutl.MessageDisplay.ShowMsg(children[i].poster, children[i].msg);
	}
};

Toutl.MessageDisplay.ShowMsg = function (speaker, data) {
	var li = $('<li><b>' + speaker + '</b>: ' + data + '</li>')
		.addClass(Toutl.MessageDisplay.ChildClass);
	$("#chatTable").append(li);
	$("#chatTable").scrollTop($("#chatTable")[0].scrollHeight);
	Toutl.MessageDisplay.components.push(li);
};

Toutl.MessageDisplay.ClearMessageDisplay = function() {
	var componentCount = Toutl.MessageDisplay.components.length;
	for (var i=0 ; i<componentCount ; i++) {
		Toutl.MessageDisplay.components[i].remove();
	}
	Toutl.MessageDisplay.components = [];
};

