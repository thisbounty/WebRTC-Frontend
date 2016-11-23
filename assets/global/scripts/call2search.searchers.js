jQuery(document).ready(function() {
    $("div.portlet-body").on("click", "button.connect", function(){
        if (OT.checkSystemRequirements() == 1) {
			var but = this;
            $.ajax({
                type: "GET",
                url: config.calls_connect_url,
                dataType: "json",
                contentType: "application/json",
                data: {
                    "access_token": localStorage.getItem('call2search'),
					"id": $(this).attr('call-id')
                },
                success: function(res) {
					$(but).replaceWith("Connected");
                    console.log("calls/connect successful");
                }
            });
            call2text_opentok_connect(config.tokbox_api, $(this).attr('data-session'), $(this).attr('data-token'), function(session) {
                session.on("streamCreated", function (event) {
                    var options = {
                        subscribeToAudio: true,
                        subscribeToVideo: false
                    };
                    session.subscribe(event.stream, replacementElementId, options, function(error) {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log('call/new callback');
                        }
                    });
                }); //on streamCreated
            }); //call2text_opentok_connect
        } //if checkSystemRequirements
    }); //button.connect click
}); //doc ready
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

function call2text_opentok_publish($api, $session_id, $token, cb) {
    var session;
    var publisher;

    // Replace with the replacement element ID:
    publisher = OT.initPublisher(replacementElementId);
    publisher.on({
      streamCreated: function (event) {
        console.log("Publisher started streaming.");
      },
      streamDestroyed: function (event) {
        console.log("Publisher stopped streaming. Reason: " + event.reason);
      }
    });

    // Replace apiKey and sessionID with your own values:
    session = OT.initSession($api, $session_id);
    // Replace token with your own value:
    session.connect($token, function (error) {
      if (session.capabilities.publish == 1) {
        session.publish(publisher);
      } else {
        console.log("You cannot publish an audio-video stream.");
      }
    });
}
