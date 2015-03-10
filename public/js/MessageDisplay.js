Toutl.MessageDisplay = {};
Toutl.MessageDisplay.parentID = 0;
Toutl.MessageDisplay.components = [];
Toutl.MessageDisplay.ParentClass = "chatParent";
Toutl.MessageDisplay.ChildClass = "chatChild";

Toutl.MessageDisplay.ChangeView = function(parentID, children) {
	if (parentID == 0) {
		// this is the top level view
		if (Toutl.MessageDisplay.parentID != null && Toutl.MessageDisplay.parentID != parentID) {
			Toutl.MessageDisplay.ClearMessageDisplay();
		}
		Toutl.MessageDisplay.parentID = parentID;
		var childCount = children.length;
		for (var i=0 ; i<children.length ; i++) {
			Toutl.MessageDisplay.ShowChannel(children[i].poster, children[i].msg, children[i].ID);
		}
	} else {
		// at this point, the user has already clicked on something
		if (Toutl.MessageDisplay.parentID != parentID) {
			/*
			Toutl.MessageDisplay.ClearMessageDisplay();
			Toutl.MessageDisplay.ShowMsg(parentMsg.poster, parentMsg.msg, Toutl.MessageDisplay.ParentClass);
			var childCount = children.length;
			for (var i=0 ; i<children.length ; i++) {
				Toutl.MessageDisplay.ShowMsg(children[i].poster, children[i].msg, Toutl.MessageDisplay.ChildClass);
			}
			*/
		} else {
			/*
			// TODO: change this to only add new items
			Toutl.MessageDisplay.ShowMsg(parentMsg.poster, parentMsg.msg, Toutl.MessageDisplay.ParentClass);
			var childCount = children.length;
			for (var i=0 ; i<children.length ; i++) {
				Toutl.MessageDisplay.ShowMsg(children[i].poster, children[i].msg, Toutl.MessageDisplay.ChildClass);
			}
			*/			
		}
		Toutl.MessageDisplay.parentID = parentID;
	}
};

Toutl.MessageDisplay.ShowChannel = function (speaker, data, id) {
	var li = $("<li><p><b>" + data + "</b> - " + speaker + "</p></li>")
		.addClass(Toutl.MessageDisplay.ParentClass)
		.click(function() {
			Toutl.GUIDisplay.LoadMessages();
			Toutl.Chat.RequestView(id);
			Toutl.MessageDisplay.ClearMessageDisplay();
		});
		
	$("#chatTable").append(li);
	$("#chatTable").scrollTop($("#chatTable")[0].scrollHeight);
	Toutl.MessageDisplay.components.push(li);
};

Toutl.MessageDisplay.ShowMsg = function (speaker, data, _class) {
	var li = document.createElement('li');
	li.innerHTML = "<b>"+ speaker + "</b>: " + data;
	li.className = _class;
	$("#chatTable").append(li);
	$("#chatTable").scrollTop($("#chatTable")[0].scrollHeight);
	Toutl.MessageDisplay.components.push(li);
};

Toutl.MessageDisplay.ClearMessageDisplay = function() {
	var componentCount = Toutl.MessageDisplay.components.length;
	for (var i=0 ; i<componentCount ; i++) {
		componentCount[i].remove();
	}
	Toutl.MessageDisplay.components = [];
};

