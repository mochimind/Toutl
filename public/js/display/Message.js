Toutl.Message = {};

Toutl.Message.NewMessage = function(speaker, message, time) {
	var newObj = {'speaker': speaker, 'message': message, 'time': time};
	newObj.displayObj = $('<li><b>' + speaker + '</b>: ' + message + '</li>')
		.addClass(Toutl.MessageDisplay.ChildClass);
	
	return newObj;
};

Toutl.Message.DisplayMessage = function(message) {
	Toutl.MessageDisplay.DisplayComponent(message.displayObj);
};