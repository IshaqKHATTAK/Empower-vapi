from helper_functions import Assistant
from dotenv import load_dotenv
import os

load_dotenv()
embd_model_id = os.getenv('embed_model_id')
model_id = os.getenv('model_id') #chat model id

def create_or_fetch_assistant(path, assistant_id = None):  
        #assistant does't exist so create one and add knowledge base
        custom_assistant = Assistant()
        assistant = custom_assistant.Create_assistant(model_id=model_id, name="Asphalt mixture expert latest")
        custom_assistant.set_assistant_id(assistant.assistant_id)
        collection = custom_assistant.Create_collection(name="Projects records latest",embd_model_id = embd_model_id)
        custom_assistant.Create_insert_records(path, collection.collection_id, title="Asphalt prjects records latest")
        custom_assistant.Edit_assistant(custom_assistant.get_assistant_id(), collection.collection_id)
        action = custom_assistant.Create_action()
        custom_assistant = custom_assistant.add_action(custom_assistant.get_assistant_id(),action[0].action_id)
        print(f'newly created assistant with knowledge base having id = {custom_assistant.get_assistant_id()} succesfully! ')
        return (custom_assistant.get_assistant_id(), collection.collection_id)