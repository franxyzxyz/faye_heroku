class ChatsController < ApplicationController
  def index
  end

  def create
    @chat = Chat.new(chat_params)
    if @chat.save
      render json: {success: true}, status: 200
    else
      render json: {success: false, errors: @chat.errors.message}, status: 401
    end
  end

  private

  def chat_params
    params.require(:chat).permit(:message)
  end
end
