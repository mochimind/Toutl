Toutl.Channel = {};

Toutl.Channel.NewChannel = function (speaker, data, id) {
	console.log("we got" + speaker + "||" + data + "||" + id);
	var li = $("<li></li>")
		.addClass(Toutl.MessageDisplay.ParentClass)
		.prepend($("<div class='channelBody'><b>" + data + "</b> - " + speaker + "</div>"))
		.prepend($("<div class='channelMessageCount'>0</div>"))
		.click(function() {
			Toutl.ChatLobby.LoadMessages(id);
			Toutl.Chat.RequestView(id);
			Toutl.MessageDisplay.ClearMessageDisplay();
			Toutl.Channel.NewChannel(speaker, data, id);
			$('#back').click(function() {
				Toutl.MessageDisplay.ClearMessageDisplay();
				Toutl.ChatLobby.LoadChannels();
			});
		});

	$("#chatTable").append(li);
	$("#chatTable").scrollTop($("#chatTable")[0].scrollHeight);
	Toutl.MessageDisplay.components.push(li);
};

