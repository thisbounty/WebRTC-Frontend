jQuery(document).ready(function() {
    $("div.content").on("click", "button.green.mobile-call", function(e) {
        this.disabled = true;
        $(this).text("CONNECTING");
        var call_button = this;
        $.ajax({
            type: "GET",
            url: config.calls_new_url,
            dataType: "json",
            data: {
                "access_token": localStorage.getItem('call2search')
            },
            success: function(res) {
                call2text_opentok_connect(config.tokbox_api, res.call.session, res.call.token, function(session)
                {
                    console.log(session);
                    //change button to hangup
                    $(call_button).removeClass("green");
                    $(call_button).addClass("red");
                    $(call_button).text("HANGUP");
                    call_button.disabled = false;
                    
                    $("div.content").one("click", "button.red.mobile-call", function(e) {
                        session.disconnect();
                        return false;
                    });
					
                    //send disconnect request to our api and make button callable once again
                    session.on("sessionDisconnected", function(event) {
                        $.ajax({
                            type: "GET",
                            url: config.calls_disconnect_url,
                            dataType: "json",
                            data: {
								"access_token": localStorage.getItem('call2search'),
                                "id": res.call.id
                            },
                            success: function(res) {
                                console.log("api has been informed about the session disconnection");
                            }
                        });
                        $(call_button).removeClass("red");
                        $(call_button).addClass("green");
                        $(call_button).text("CALL");
                        return false;
                    });//onSessionDisconnected

                    //connect to every new stream
                    session.on("streamCreated", function (event) {
                        var options = {
                            subscribeToAudio: true,
                            subscribeToVideo: false,
                            insertMode: "append"
                        };
                        session.subscribe(event.stream, 'mobile_call_window', options, function(error) {
                            if(error) {
                                console.log(error);
                            } else {
                                console.log('call/new callback');
                            }
                        });
                    }); //on streamCreated
					
                    //publish session
                    call2text_opentok_publish(session, 'mobile_call_window');
                });
            }
        });
		return false;
    });
});

function call2text_opentok_connect($api, $session_id, $token, cb) {
    var session = OT.initSession($api, $session_id);
    session.connect($token, function(error) {
      if (error) {
        console.log("Error connecting: ", error.code, error.message);
      } else {
          cb(session);
      }
    });
}

function call2text_opentok_publish(session, replacementElementId) {
    var publisher;

	var pubOptions = { publishAudio:true, publishVideo:false, insertMode: "append" };
    // Replace with the replacement element ID:
    publisher = OT.initPublisher(replacementElementId, pubOptions);
    publisher.on({
      streamCreated: function (event) {
        console.log("Publisher started streaming.");
      },
      streamDestroyed: function (event) {
        console.log("Publisher stopped streaming. Reason: " + event.reason);
      }
    });
	
	if (session.capabilities.publish == 1) {
      session.publish(publisher);
    } else {
      console.log("You cannot publish an audio-video stream.");
    }
}