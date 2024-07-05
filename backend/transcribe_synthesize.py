import time
from gtts import gTTS
from io import BytesIO
import requests
from deepgram import (
    DeepgramClient,
    DeepgramClientOptions,
    LiveTranscriptionEvents,
    LiveOptions,
    Microphone,
)
from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)
from openai import OpenAI

import uuid
import assemblyai as aai

from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

import os

load_dotenv()
API_KEY = os.getenv('DEEPGRAM_API')
XI_KEY  = os.getenv('Eleven_LAB_API')
Assemly_AI_API = os.getenv('Assemly_AI_API')

ELEVENLABS_API_KEY = XI_KEY

class EmpowerTranscribe:
    def __init__(self) -> None:
        self.deep_gram_api = None
        self.openai_api = None
        self.elevenlab_api = None

    def transcriber_whisper(self, openai_api, audio_path):
        '''Convert audio into text'''
        self.openai_api = openai_api 
        client = OpenAI(api_key=openai_api)
        audio_file= open(audio_path, "rb")
        transcription = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file 
        )

        return transcription.text
    
    def transcribe_nova2(self,DEEPGRAM_KEY, AUDIO_FILE_PATH):
        deepgram = DeepgramClient(DEEPGRAM_KEY)
        with open(AUDIO_FILE_PATH, "rb") as file:
            buffer_data = file.read()
        payload: FileSource = {
                "buffer": buffer_data,
            }
        options = PrerecordedOptions(
                model="nova-2",
                smart_format=True,
            )
        response = deepgram.listen.prerecorded.v("1").transcribe_file(payload, options)
        return response.results.channels[0].alternatives[0].transcript

class Empowervoice:
    def __init__(self) -> None:
        self.openai_api = None
        self.elevenlabs_api = None

    def syntheizer_gtts(self,text,path_to_save = 'output2.mp3'):
        tts = gTTS(text)
        mp3_fp = BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        tts.save(path_to_save)
        return mp3_fp

    def voices_elevenlabs(self, ELEVENLABS_API):
        url = "https://api.elevenlabs.io/v1/voices"
        headers = {
        "Accept": "application/json",
        "xi-api-key": ELEVENLABS_API,
        "Content-Type": "application/json"
        }

        response = requests.get(url, headers=headers)
        data = response.json()
        for voice in data['voices']:
            return (f"{voice['name']}; {voice['voice_id']}")

    def synthesizer_elevenlabs(self,ELEVENLABS_API_KEY, text: str, path_to_save = 'output2.mp3'):
        self.elevenlabs_api = ELEVENLABS_API_KEY
        client = ElevenLabs(
            api_key=ELEVENLABS_API_KEY,
        )
        
        response = client.text_to_speech.convert(
            voice_id="pNInz6obpgDQGcFmaJgB", # Dave voice
            optimize_streaming_latency="0",
            output_format="mp3_22050_32",
            text=text,
            model_id="eleven_turbo_v2", # use the turbo model for low latency, for other languages use the `eleven_multilingual_v2`
            voice_settings=VoiceSettings(
                stability=0.0,
                similarity_boost=1.0,
                style=0.0,
                use_speaker_boost=True,
            ),
        )
        # Writing the audio to a file
        with open(path_to_save, "wb") as f:
            for chunk in response:
                if chunk:
                    f.write(chunk)

        # Return the path of the saved audio file
        return path_to_save


def AssemlyAI_streaming(KEY):
    aai.settings.api_key = KEY
    def on_open(session_opened: aai.RealtimeSessionOpened):
        print("Session opened with ID:", session_opened.session_id)

    def on_error(error: aai.RealtimeError):
        print("Error:", error)

    def on_close():
        print("Session closed")
    def on_data(transcript: aai.RealtimeTranscript):
        if not transcript.text:
            return
        if isinstance(transcript, aai.RealtimeFinalTranscript):
            # Add new line after final transcript.
            print(transcript.text, end="\r\n")
            print('sentence complted!', end='\n')
        # else:
        #     print(transcript.text, end="\r")

    transcriber = aai.RealtimeTranscriber(
    sample_rate=16_000,
    on_data=on_data,
    on_error=on_error,
    on_open=on_open,
    on_close=on_close,
    end_utterance_silence_threshold=1200,#1200 miliseconds threashold for silence detection
    )

    transcriber.connect()
    microphone_stream = aai.extras.MicrophoneStream(sample_rate=16_000)
    transcriber.stream(microphone_stream)
    transcriber.force_end_utterance()
    transcriber.close()

# AssemlyAI_streaming(Assemly_AI_API)
def streaming_detection(API_KEY):
    try:
        # example of setting up a client config. logging values: WARNING, VERBOSE, DEBUG, SPAM
        # config = DeepgramClientOptions(
        #     verbose=verboselogs.DEBUG, options={"keepalive": "true"}
        # )
        # deepgram: DeepgramClient = DeepgramClient("", config)
        # otherwise, use default config
        deepgram: DeepgramClient = DeepgramClient(API_KEY)

        dg_connection = deepgram.listen.live.v("1")

        def on_open(self, open, **kwargs):
            print(f"Connection Open")

        def on_message(self, result, **kwargs):
            global is_finals
            sentence = result.channel.alternatives[0].transcript
            if len(sentence) == 0:
                return
            if result.is_final:
                # We need to collect these and concatenate them together when we get a speech_final=true
                is_finals.append(sentence)
                # Speech Final means we have detected sufficent silence to consider this end of speech
                # Speech final is the lowest latency result as it triggers as soon an the endpointing value has triggered
                if result.speech_final:
                    utterance = " ".join(is_finals)
                    print(f"Speech Final: {utterance}")
                    is_finals = []
                else:
                    # These are useful if you need real time captioning and update what the Interim Results produced
                    print(f"Is Final: {sentence}")
            else:
                # These are useful if you need real time captioning of what is being spoken
                # transcribed real time
                print(f"Interim Results: {sentence}")
            if sentence == "exit":
                dg_connection.on(LiveTranscriptionEvents.Close, on_close)

        def on_metadata(self, metadata, **kwargs):
            print(f"Metadata: {metadata}")

        def on_speech_started(self, speech_started, **kwargs):
            print(f"Speech Started")

        def on_utterance_end(self, utterance_end, **kwargs):
            print(f"Utterance End")
            global is_finals
            if len(is_finals) > 0:
                utterance = " ".join(is_finals)
                print(f"Utterance End: {utterance}")
                is_finals = []

        def on_close(self, close, **kwargs):
            print(f"Connection Closed")

        def on_error(self, error, **kwargs):
            print(f"Handled Error: {error}")

        def on_unhandled(self, unhandled, **kwargs):
            print(f"Unhandled Websocket Message: {unhandled}")

        dg_connection.on(LiveTranscriptionEvents.Open, on_open)
        dg_connection.on(LiveTranscriptionEvents.Transcript, on_message)
        dg_connection.on(LiveTranscriptionEvents.Metadata, on_metadata)
        dg_connection.on(LiveTranscriptionEvents.SpeechStarted, on_speech_started)
        dg_connection.on(LiveTranscriptionEvents.UtteranceEnd, on_utterance_end)
        dg_connection.on(LiveTranscriptionEvents.Close, on_close)
        dg_connection.on(LiveTranscriptionEvents.Error, on_error)
        dg_connection.on(LiveTranscriptionEvents.Unhandled, on_unhandled)

        options: LiveOptions = LiveOptions(
            model="nova-2",
            language="en-US",
            # Apply smart formatting to the output
            smart_format=True,
            # Raw audio format details
            encoding="linear16",
            channels=1,
            sample_rate=16000,
            # To get UtteranceEnd, the following must be set:
            interim_results=True,
            utterance_end_ms="1000",
            vad_events=True,
            # Time in milliseconds of silence to wait for before finalizing speech
            endpointing=300,
        )
        
        addons = {
            # Prevent waiting for additional numbers
            "no_delay": "true"
        }

        print("\n\nPress Enter to stop recording...\n\n")
        if dg_connection.start(options, addons=addons) is False:
            print("Failed to connect to Deepgram")
            return

        # Open a microphone stream on the default input device
        microphone = Microphone(dg_connection.send)

        # start microphone
        microphone.start()

        # wait until finished
        input("")

        # Wait for the microphone to close
        microphone.finish()

        # Indicate that we've finished
        dg_connection.finish()

        print("Finished")
        # sleep(30)  # wait 30 seconds to see if there is any additional socket activity
        # print("Really done!")

    except Exception as e:
        print(f"Could not open socket: {e}")
        return


# from pyht import Client
# pyht_api = os.getenv('Plyaht_API')
# pyht_user_ID = os.getenv('Playht_user_ID')

# client = Client(  
#    user_id=pyht_user_ID,  
#    api_key=pyht_api,  
# 	 # for on-prem users, uncomment and add the advanced grpc_addr option below. Replace grpc_addr with your endpoint. 
#    # advanced=client.Client.AdvancedOptions(grpc_addr="{your-endpoint}.on-prem.play.ht:11045")
# )
# with open('name.mp3','wb') as f:
#     for chunk in client.tts("Hello World!", voice="s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json"):
#         f.write(chunk)




# client = ElevenLabs(
#     api_key=ELEVENLABS_API_KEY,
# )
# text_to_speech_file("Hello World")
