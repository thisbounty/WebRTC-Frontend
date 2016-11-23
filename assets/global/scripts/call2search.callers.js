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
                call2text_opentok_publish(config.tokbox_api, res.call.session, res.call.token, function(cb)
				{
                    //callback
                });
            }
        });
		return false;
    });
});

function call2text_opentok_publish($api, $session_id, $token, cb) {
    var session;
    var publisher;

    // Replace with the initPublisher element ID:
    //publisher = OT.initPublisher(replacementElementId);
    //publisher.on({
      //streamCreated: function (event) {
        //console.log("Publisher started streaming.");
      //},
      //streamDestroyed: function (event) {
        //console.log("Publisher stopped streaming. Reason: "
          //+ event.reason);
      //}
    //});

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