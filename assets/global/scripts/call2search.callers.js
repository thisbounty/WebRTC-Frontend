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
        console.log("Publisher stopped streaming. Reason: "
          + event.reason);
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
