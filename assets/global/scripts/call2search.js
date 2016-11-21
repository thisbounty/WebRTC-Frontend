jQuery(document).ready(function(){
    $("div.portlet-body").on("click","button.connect", function() {
        if (OT.checkSystemRequirements() == 1) {
            call2text_opentok_connect(config.tokbox_api, $(this).attr('data-session'), $(this).attr('data-token'), function(session) {
                console.log('Desktop App Connect');
            }); //call2text_opentok_connect
        }
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
