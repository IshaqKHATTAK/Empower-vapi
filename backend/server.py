from flask import Flask,make_response,  request, send_file, jsonify
from assistant import chat_creation, chat_with_assitant
from flask_cors import CORS
import sqlite3 as sql
import taskingai
from helper_functions import Assistant
from transcribe_synthesize import EmpowerTranscribe, Empowervoice
from openai import OpenAI
from Create_database import database
from dotenv import load_dotenv
from flask_cors import CORS
import os
#txt, doc, html, pdf, md
app = Flask(__name__)
CORS(app, expose_headers=['chat_id']) 


load_dotenv()
model_id = os.getenv('model_id')
embd_model_id = os.getenv('embed_model_id')
T_API_KEY = os.getenv('Tasking_API_KEY')
openai_api = os.getenv('OPENAI_API_KEY')
XI_KEY  = os.getenv('Eleven_LAB_API')

path = "./output2.mp3"


taskingai.init(api_key=T_API_KEY,host='https://tasking.fayazk.com') 

UPLOAD_FOLDER = 'data'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    data = []
    with sql.connect('database.db') as con:
        cur = con.cursor()
        records = cur.execute('''SELECT * FROM assistants''')
        for record in records:
            data.append({'uuid':record[0], 'assistant_id':record[1], "assistant_name":record[2], 'transcribe':record[3],'synthesizer':record[4], 'date':record[5]})
        con.commit()
    con.close()
    return jsonify(data)

@app.route('/assistant',  methods=['GET','POST'])
def create_assistant():
     if request.method == 'POST':
        data = request.get_json()
        chatComp_model = data.get('model')
        assistant_name = data.get('assistant')
        sys_prompt = data.get('prompt')
        description = data.get('description')
        
        custom_assistant = Assistant()
        assistant = custom_assistant.Create_assistant(model_id=chatComp_model, name=assistant_name,prompt=sys_prompt, description=description)

        db = database()
        db.insert_rows(assistant_id=assistant.assistant_id, assistant_name=assistant_name, transcriber='', synthesizer='')
        
        # Create a response
        response = {
            'status': 'success',
            'data': {
                'assistant': assistant_name,
                'prompt': sys_prompt,
                'model': chatComp_model
            }
        }
        return jsonify(response), 200

@app.route('/action/<uuid>', methods = ['POST','GET'])
def add_cation(uuid):
     if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        title_desc = data.get('title_desc')
        route = data.get('route')
        route_desc = data.get('route_desc')
        route_summary = data.get('route_summary')
        server_url = data.get('server_url')
        
        custom_assistant = Assistant()
        #schema = custom_assistant.create_schema(title='GIKI info', title_desc='get infromation about giki', route='/vision-and-mission/',route_summary="get the vision and mission of giki", route_description="giki vision and mission description", server_url="https://giki.edu.pk")
        schema = custom_assistant.create_schema(title=title, title_desc=title_desc, route=route,route_summary=route_summary, route_description=route_desc, server_url=server_url)
        action = custom_assistant.Create_action()
        with sql.connect('database.db') as con:
            cur = con.cursor()
            record = cur.execute('SELECT * FROM assistants WHERE uuid = ?', (uuid,))
            record = record.fetchone()
            assistant_id = record[1] 

        # assistant_id = "X5lMmdpINdfCWApN1YvbiSMb"
        custom_assistant.add_action(assistant_id, action[0].action_id)
        response = {
            'status': 'success',
            'data': {
                'message': 'action added to the assistant',
            }
        }
        return jsonify(response), 200

@app.route('/addknowledge/<uuid>', methods = ['POST','GET'])
def add_knowledgebase(uuid):
    print('uudi == ',uuid)
    
    if request.method == 'POST':
        with sql.connect('database.db') as con:
            cur = con.cursor()
            record = cur.execute('SELECT * FROM assistants WHERE uuid = ?', (uuid,))
            record = record.fetchone()
            assistant_id = record[1] 

        
        file = request.files['file']
        title = request.form['title']
        chunk_size = request.form['chunkSize']
        chunk_overlap = request.form['chunkOverlap']
        collection_name = request.form['collection_name']
        collection_deescription = request.form['collection_description']
        print(f'collection name = {collection_name} collection description = {collection_deescription}')

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        custom_assistant = Assistant()
        
        collection = custom_assistant.Create_collection(name=collection_name, embd_model_id=embd_model_id,collection_description=collection_deescription)
        custom_assistant.Create_insert_records(path=file_path, collection_id=collection.collection_id,title=title,chuck_size=chunk_size, chnk_overlap=chunk_overlap)
        
        # assistant_id = "X5lMmdpINdfCWApN1YvbiSMb"
        custom_assistant.Edit_assistant(assistant_id = assistant_id,collection_id = collection.collection_id)
        response = {
            'status': 'success',
            'data':{
                'message': 'action added to the assistant',
            }
        }
        return jsonify(response), 200
    else:
        response = {
            'status':'failed',
            'data': {
                'This method is not supported',
            }
        }
        return jsonify(response), 200

@app.route('/chat/<uuid>',  methods=['GET','POST'])
def Chat(uuid):
    if request.method == 'GET':
        return jsonify({"error": "GET requests not supported"}), 405  

    if 'audio' not in request.files:
        return jsonify({"error": "No audio file received"}), 400

    audio_file = request.files.get('audio')
    chat_id = request.form.get('chat_id')

    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    audio_path = "./audio/voice_note.mp3"
    try:
        with sql.connect('database.db') as con:
            cur = con.cursor()
            records = cur.execute('SELECT * FROM assistants WHERE uuid = ?', (uuid,))
            record = records.fetchone()
            assistant_id = record[1]

        audio_file.save(audio_path)
        
        #transcribe the audio to text
        transcriber = EmpowerTranscribe()

        transcribed_text = transcriber.transcriber_whisper(openai_api=openai_api, audio_path=audio_path)
        print("transcribed text used whisper",transcribed_text)
        
        #create chat id if not exsit
        if not chat_id:
            create_chat = chat_creation(assistant_id=assistant_id)
            chat_id = create_chat.chat_id
            print('created chat id',chat_id)
        #assistant llm
        response = chat_with_assitant(chat_id,assistant_id,transcribed_text)
        print('assistant response',response.content.text)

        #synthesizer ElevenLabs
        synthesizer = Empowervoice()
        audio_response = synthesizer.synthesizer_elevenlabs(ELEVENLABS_API_KEY=XI_KEY, text=response.content.text)
        
        if not audio_response:
            return jsonify({"error": "Empty response audio"}), 500

        response = make_response(send_file(
        audio_response,
        mimetype='audio/mpeg',
        as_attachment=True,
        download_name='output2.mp3'
        ))
        
        response.headers['chat_id'] = chat_id
        return response

    except Exception as e:  
        print(f"Error processing audio: {e}")
        return jsonify({"error": "Error processing audio"}), 500  

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    flask_host = os.getenv('FLASK_HOST', '127.0.0.1')
    app.run(host=flask_host, port=port)


# sys_prmpt1 = '''You a nice financial advisor help people to save money and invest them in good and profitiable places."'''
# sys_prmpt2 = '''Advise poeple with best of your knowledge and tell them where to ivest money.
#                 if you dont have knowledge about a particular topic, place, or anything unrelated just simply say
#                 "I can't answer you questions"
#             '''
# prompt = [sys_prmpt1, sys_prmpt2]
# model_id
# assistant_name = "Financial advisor"
# assistant = create_assistant(chatComp_model=model_id, assistant_name=assistant_name, sys_prompt=prompt)
# print(assistant)