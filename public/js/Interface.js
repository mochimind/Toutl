Toutl.Interface = {};
Toutl.Interface.parentID = 0;
Toutl.Interface.components = [];
Toutl.Interface.ParentClass = "chatParent";
Toutl.Interface.ChildClass = "chatChild";

Toutl.Interface.ChangeView = function(parentID, children) {
	if (parentID == 0) {
		// this is the top level view
		if (Toutl.Interface.parentID != null && Toutl.Interface.parentID != parentID) {
			Toutl.Interface.ClearInterface();
		}
		Toutl.Interface.parentID = parentID;
		var childCount = children.length;
		for (var i=0 ; i<children.length ; i++) {
			Toutl.Interface.ShowMsg(children[i].poster, children[i].msg, Toutl.Interface.ParentClass);
		}
	} else {
		// at this point, the user has already clicked on something
		if (Toutl.Interface.parentID != parentID) {
			/*
			Toutl.Interface.ClearInterface();
			Toutl.Interface.ShowMsg(parentMsg.poster, parentMsg.msg, Toutl.Interface.ParentClass);
			var childCount = children.length;
			for (var i=0 ; i<children.length ; i++) {
				Toutl.Interface.ShowMsg(children[i].poster, children[i].msg, Toutl.Interface.ChildClass);
			}
			*/
		} else {
			/*
			// TODO: change this to only add new items
			Toutl.Interface.ShowMsg(parentMsg.poster, parentMsg.msg, Toutl.Interface.ParentClass);
			var childCount = children.length;
			for (var i=0 ; i<children.length ; i++) {
				Toutl.Interface.ShowMsg(children[i].poster, children[i].msg, Toutl.Interface.ChildClass);
			}
			*/			
		}
		Toutl.Interface.parentID = parentID;
	}
};

Toutl.Interface.ShowMsg = function (speaker, data, _class) {
	var li = document.createElement('li');
	li.innerHTML = "<b>"+ speaker + "</b>: " + data;
	li.className = _class;
	$("#chatTable").append(li);
	$("#chatTable").scrollTop($("#chatTable")[0].scrollHeight);
	Toutl.Interface.components.push(li);
};

Toutl.Interface.ClearInterface = function() {
	var componentCount = Toutl.Interface.components.length;
	for (var i=0 ; i<componentCount ; i++) {
		componentCount[i].remove();
	}
	Toutl.Interface.components = [];
};

