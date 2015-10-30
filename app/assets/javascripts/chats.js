window.client = new Faye.Client('/faye');

$(document).ready(function(){
  // define elements
  chatBox = $("#chat");
  formBox = $('form');
  formBoxInputs = formBox.find('input');
  messageInput = formBox.find('#message');

  var init = function () {
    scrollHeight = chatBox[0].scrollHeight;
    chatBox.scrollTop(scrollHeight);
  };

  init();

  // subscribe to client
  client.subscribe('/comments', function(payload) {
    console.log("message recieved", payload);
    chatBox.append("<p><span>" + payload.created_at + ": </span>" + payload.message + "</p>");
    scrollHeight = chatBox[0].scrollHeight;
    chatBox.scrollTop(scrollHeight);
  });

  // when user submit message, if success then publish to channel
  formBox.on("submit", function(e){
    e.preventDefault();
    formBoxInputs.attr("disabled", true);

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
        formBoxInputs.removeAttr("disabled");
        messageInput.val("");
        messageInput.focus();

        client.publish('/comments', {
          message: response.message,
          created_at: response.created_at
        });
      },
      error: function(response, status){
        console.log(response);
        formBoxInputs.removeAttr("disabled");
      }
    });

  });
});