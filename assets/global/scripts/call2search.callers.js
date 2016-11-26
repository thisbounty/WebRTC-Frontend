jQuery(document).ready(function() {
    $("div.content").on("click", "button.mobile-call", function(e) {
        $.ajax({
            type: "GET",
            url: config.calls_new_url,
            dataType: "json",
            contentType: "application/json",
            data: {
                "access_token": localStorage.getItem('call2search')
            },
            success: function(res) {
                call2text_opentok_connect(config.tokbox_api, res.call.session, res.call.token, function(session)
                {
                    ////publish session
                    call2text_opentok_publish(session, 'mobile_call_window');
                    //connect to every new stream
                    session.on("streamCreated", function (event) {
                    var options = {
                        subscribeToAudio: true,
                        subscribeToVideo: false
                    };
                    session.subscribe(event.stream, 'mobile_call_window', options, function(error) {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log('call/new callback');
                        }
                    });
                }); //on streamCreated
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

	var pubOptions = { publishAudio:true, publishVideo:false };
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