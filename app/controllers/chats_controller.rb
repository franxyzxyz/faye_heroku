class ChatsController < ApplicationController
  def index
    @history = Chat.all.order(:id)
  end

  def create
    @chat = Chat.new(chat_params)
    if @chat.save
      render json: {success: true, message: @chat.message, created_at: @chat.created_at.httpdate}, status: 200
    else
      render json: {success: false, errors: @chat.errors.message}, status: 401
    end
  end

  def destroy
    @chats = Chat.all
    @chats.destroy_all
    render json: {success: true}, status: 200
  end

  private

  def chat_params
    params.require(:chat).permit(:message)
  end
end
