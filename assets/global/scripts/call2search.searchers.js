jQuery(document).ready(function() {
    $("div.portlet-body").on("click", "button.connect", function(){
        var button = this;
        if (OT.checkSystemRequirements() == 1) {
            $.ajax({
                type: "GET",
                url: config.calls_connect_url,
                dataType: "json",
                data: {
                    "access_token": localStorage.getItem('call2search'),
					"id": $(this).attr('call-id')
                },
                success: function(res) {
                    console.log("calls/connect successful");
                }
            });
            call2text_opentok_connect(config.tokbox_api, $(this).attr('data-session'), $(this).attr('data-token'), function(session) {

                //disconnect after clicking "Connected" button
                $(button).one("click", function(e) {
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
                            "id": $(button).attr('call-id')
                        },
                        success: function(res) {
                            console.log("api has been informed about the session disconnection");
                        }
                    });
                    $(button).replaceWith("Disconnected");
                    return false;
                });//onSessionDisconnected

                //connect to every new stream
                session.on("streamCreated", function (event) {
                    var options = {
                        subscribeToAudio: true,
                        subscribeToVideo: false,
                        insertMode: "append"
                    };
                    session.subscribe(event.stream, 'desktop_call_window', options, function(error) {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log('call/new callback');
                        }
                    });
                }); //on streamCreated

                //publish session
                call2text_opentok_publish(session, 'desktop_call_window');
            }); //call2text_opentok_connect
        } //if checkSystemRequirements
    }); //button.connect click
	$("div.portlet-body").on("click", "button.disconnect", function(){
        $.ajax({
            type: "GET",
            url: config.calls_disconnect_url,
            dataType: "json",
            data: {
                "access_token": localStorage.getItem('call2search'),
                "id": $(this).attr('call-id')
            },
            success: function(res) {
                console.log("api has been informed about the session disconnection");
            }
        });
        $(this).replaceWith("Disconnected");
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
