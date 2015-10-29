window.client = new Faye.Client('/faye');

$(document).ready(function(){
  // subscribe to client
  client.subscribe('/comments', function(payload) {
    console.log("message recieved", payload);
    $("#chat").append("<p>"+payload.message+"</p>");
  });

  // when user submit message, publish to channel
  $('form').on("submit", function(e){
    e.preventDefault();
    publisher = client.publish('/comments', {
      message: $('#message').val()
    });
  });
});