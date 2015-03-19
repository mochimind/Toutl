Toutl.Landing = {};

Toutl.Landing.Init = function() {
	Toutl.Landing.myName = $("#chatName").val();
	if ($.cookie('name') != undefined){
		Toutl.Landing.myName = $.cookie('name');
		$("#chatName").val(Toutl.Landing.myName);
	}
	
	$("#chatName").keypress(function(e){
		// Submit the form on enter
		if(e.which == 13) {
			e.preventDefault();
			$("#chatNameForm").trigger('submit');
		}
	});
	
	/*
	$("#submitNewName").click(function() {
		console.log('hit');
		$("#chatNameForm").trigger('submit');
	});
	*/
	
	/*
	$("#chatName").on("focusout", function() {
		Toutl.ChatLobby.NameChangeRequest();
	});
	*/
	
	$("#chatNameForm").on('submit', function(e) {
		e.preventDefault();
		Toutl.Landing.NameChangeRequest();
	});
	
	$("#chatBody").hide();
};

Toutl.Landing.IsValidChatter = function (name) {
	if (name.length) { return true; }
	alert("you need to choose another name");
	return false;
};

Toutl.Landing.NameChangeRequest = function() {
	console.log('new name is: ' + $("#chatName").val());
	if (!Toutl.Landing.IsValidChatter($("#chatName").val())) { return; }
	var newName = $("#chatName").val();
	if (newName != Toutl.Landing.myName) {
		$('#chatName').val("changing name")
		.prop('disabled', true);
		Toutl.Chat.UpdateName(newName);
	} else if(newName == $.cookie('name')) {
		Toutl.ChatLobby.Init();
		$("#login").hide();		
	}
};

Toutl.Landing.ChangeName = function(name) {
	Toutl.Landing.myName = name;
	$('#chatName').val(name)
		.prop('disabled', false);
	
	$("#login").hide();
	
	$.cookie('name', Toutl.Landing.myName, {expires: 365});
	
	Toutl.ChatLobby.Init();
};
