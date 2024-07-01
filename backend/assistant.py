import os
import taskingai
from dotenv import load_dotenv
from taskingai.inference import chat_completion, SystemMessage, UserMessage


def chat_creation(assistant_id):
    chat = taskingai.assistant.create_chat(
    assistant_id = assistant_id)
    return chat

def chat_with_assitant(chat_id, assist_id, u_input):
    #Create message
    message = taskingai.assistant.create_message(
    assistant_id= assist_id,
    chat_id=chat_id,
    text=u_input,)
    #Call the assistant
    response = taskingai.assistant.generate_message(
    assistant_id= assist_id,
    chat_id= chat_id,)
    return response
    