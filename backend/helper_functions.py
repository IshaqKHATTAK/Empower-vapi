import taskingai
from taskingai.file import upload_file
import taskingai
from taskingai.retrieval import Record, TokenTextSplitter
from taskingai.retrieval.collection import Collection, create_collection
from taskingai.assistant.memory import AssistantNaiveMemory
from taskingai.assistant import Assistant, AssistantRetrieval, AssistantRetrievalType
from taskingai.assistant import AssistantTool, AssistantToolType
from taskingai.tool import Action
from taskingai.tool import ActionAuthentication, ActionAuthenticationType
from Schema import DATABASE_API_SCHEMA
from typing import List
import json
from dotenv import load_dotenv 
import os
load_dotenv()
model_id = os.getenv('model_id')
embed_model_id = os.getenv('embed_model_id')


class Assistant:
    assistant_id = None
    def __init__(self) -> None:
        self.file_path = None
        self.model_id = model_id 
        self.assistant_name =  None
        self.collection_name = None
        self.embed_model_id =  embed_model_id #Embedings model id
        self.collection_id = None
        self.record_title = None #record name or title
        self.DATABASE_API_SCHEMA = json.dumps(DATABASE_API_SCHEMA)
        
    
    #create assistant with name and model for chat completion
    def Create_assistant(self, model_id, name,prompt):
        self.model_id = model_id
        self.assistant_name = name
        print('creating assistant ...')
        assistant = taskingai.assistant.create_assistant(
            model_id= self.model_id,
            name= self.assistant_name,
            description="You are a kind assistant here to help people with the best of your knwledge. 'Ensure that your response is according to the prompt given to you'",
            system_prompt_template=[prompt],
            memory=AssistantNaiveMemory()
        )
        return assistant
    #Creating collection
    def Create_collection(self, name, embd_model_id, collection_description):
        self.collection_name = name
        self.embed_model_id = embd_model_id
        print('creating collection ...')
        collection: Collection = create_collection(
            name= self.collection_name,
            description=collection_description,
            embedding_model_id= self.embed_model_id,
            capacity = 1000
        )
        return collection
    
    #Create records
    def Create_insert_records(self, path, collection_id, title = "Mixture records data",chuck_size = 200,chnk_overlap = 20):
        self.file_path = path
        self.collection_id = collection_id
        self.record_title = title
        print('creating records ...')
        new_file = taskingai.file.upload_file(file=open(self.file_path, "rb"), purpose="record_file")
        record: Record = taskingai.retrieval.create_record(
            title = self.record_title,
            collection_id=self.collection_id,
            type="file",
            file_id=new_file.file_id,
            text_splitter={"type": "token", "chunk_size": chuck_size, "chunk_overlap": chnk_overlap},
        )
        return record
    #Edit assistatn if already exit
    def Edit_assistant(self, assistant_id, collection_id):
        self.assistant_id = assistant_id
        self.collection_id = collection_id
        print('editing assistant ...')
        assistant: Assistant = taskingai.assistant.update_assistant(
            assistant_id=self.assistant_id,
            retrievals=[AssistantRetrieval(
                type=AssistantRetrievalType.COLLECTION,
                id=self.collection_id,
            )]
        )
        return 
    
    def create_schema(self, title, title_desc, route, route_summary, route_description, server_url):
        self.DATABASE_API_SCHEMA = self.DATABASE_API_SCHEMA.replace("{title}", title)
        self.DATABASE_API_SCHEMA = self.DATABASE_API_SCHEMA.replace("{title_description}", title_desc)
        self.DATABASE_API_SCHEMA = self.DATABASE_API_SCHEMA.replace("{route}", route)
        self.DATABASE_API_SCHEMA = self.DATABASE_API_SCHEMA.replace("{route_summary}", route_summary)
        self.DATABASE_API_SCHEMA = self.DATABASE_API_SCHEMA.replace("{route_description}", route_description)
        self.DATABASE_API_SCHEMA = self.DATABASE_API_SCHEMA.replace("{server_url}", server_url)
        self.DATABASE_API_SCHEMA = json.loads(self.DATABASE_API_SCHEMA)
        return self.DATABASE_API_SCHEMA

    def Create_action(self):
        actions: List[Action] = taskingai.tool.bulk_create_actions(
            openapi_schema=self.DATABASE_API_SCHEMA,
            authentication=ActionAuthentication(
            type=ActionAuthenticationType.NONE,
            )
        )
        return actions
    
    def add_action(self,assistant_id,action_id):
        assistant: Assistant = taskingai.assistant.update_assistant(
            assistant_id=assistant_id,
            tools=[
                AssistantTool(
                    type=AssistantToolType.ACTION,
                    id=action_id),
            ]
        )
        return assistant
    def set_assistant_id(self, api):
        Assistant.assistant_id = api
    def get_assistant_id(self):
        return self.assistant_id


