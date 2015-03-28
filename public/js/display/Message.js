Toutl.Message = {};

Toutl.Message.NewMessage = function(speaker, message, time) {
	var newOb = {'speaker': speaker, 'message': message, 'time': time};
	newObj.displayObj = $('<li><b>' + speaker + '</b>: ' + message + '</li>')
		.addClass(Toutl.MessageDisplay.ChildClass);
};

Toutl.Message.DisplayMessage = function(message) {
	Toutl.MessageDisplay.DisplayComponent(message.displayObj);
};