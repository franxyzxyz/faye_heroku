window.client = new Faye.Client('/faye');

$(document).ready(function(){
  // define chat element
  chatBox = $("#chat");

  // subscribe to client
  client.subscribe('/comments', function(payload) {
    console.log("message recieved", payload);
    chatBox.append("<p><span>" + payload.created_at + ": </span>" + payload.message + "</p>");
    scrollHeight = chatBox[0].scrollHeight;
    chatBox.scrollTop(scrollHeight);
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
        console.log(response);
        client.publish('/comments', {
          message: response.message,
          created_at: response.created_at
        });
      },
      error: function(response, status){
        console.log(response);
      }
    });

  });
});