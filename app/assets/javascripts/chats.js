window.client = new Faye.Client('/faye');

$(document).ready(function(){
  // define elements
  chatBox = $("#chat");
  formBox = $('#new-message');
  formBoxInputs = formBox.find('input');
  newMessageInput = formBox.find('#message');
  deleteBox = $('#delete-messages');

  var init = function () {
    scrollHeight = chatBox[0].scrollHeight;
    chatBox.scrollTop(scrollHeight);
  };

  init();

  // subscribe to client
  client.subscribe('/comments', function(payload) {
    if (payload.action == "create"){
      console.log("message recieved", payload);
      chatBox.append("<p><span>" + payload.created_at + ": </span>" + payload.message + "</p>");
      scrollHeight = chatBox[0].scrollHeight;
      chatBox.scrollTop(scrollHeight);
    } else {
      console.log("deleting all history");
      chatBox.html("");
      chatBox.append("<p>DELETED CHAT HISTORY</p>");
    }
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
        newMessageInput.val("");
        newMessageInput.focus();

        client.publish('/comments', {
          action: "create",
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

  deleteBox.on("submit", function(e){
    e.preventDefault();

    $.ajax({
      url: '/',
      method: "DELETE",
      success: function(response, status){
        console.log(response);

        client.publish('/comments', {
          action: "delete"
        });
      }
    });
  });
});