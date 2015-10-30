window.client = new Faye.Client('/faye');

$(document).ready(function(){
  // subscribe to client
  client.subscribe('/comments', function(payload) {
    console.log("message recieved", payload);
    $("#chat").append("<p>"+payload.message+"</p>");
  });

  // when user submit message, if success then publish to channel
  $('form').on("submit", function(e){
    e.preventDefault();

    message = $('#message').val();

    $.ajax({
      url: '/',
      method: 'POST',
      data: {
        chat: {
          message: message
        }
      },
      success: function(response, status){
        client.publish('/comments', {
          message: message
        });
      },
      error: function(response, status){
        console.log(response);
      }
    });

  });
});