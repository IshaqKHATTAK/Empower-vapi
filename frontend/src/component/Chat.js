// import React, { useState } from 'react';
// import './Recorder.css';
// import sendAudioToServer from './Api'; // Import the sendAudioToServer function
// import WebSocket from 'ws';

// const BASE_URL = 'http://127.0.0.1:5000'
// const route = 'ask'

// const Chat = () => {
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//     const [recordedAudios, setRecordedAudios] = useState([]);
//     const [isRecording, setIsRecording] = useState(false);
//     const ws = new WebSocket(`${BASE_URL}/${route}`);

//     recorder.ondataavailable = (event) => {
//         const audioChunk = event.data;
//         ws.send(audioChunk);
//     };
//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const recorder = new MediaRecorder(stream);
//         let chunks = [];

//         recorder.ondataavailable = (event) => {
//             chunks.push(event.data);
//         };

//         recorder.onstop = () => {
//             const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
//             console.log("Audio Blob:", audioBlob);
//             // setRecordedAudios(prev => [...prev, audioBlob]); 
//             // sendAudioToServer(audioBlob); 
//             setRecordedAudios(prev => [...prev, { blob: audioBlob, type: 'user' }]);
//             sendAudioToServer(audioBlob, (responseAudioBlob) => {
//                 setRecordedAudios(prev => [...prev, { blob: responseAudioBlob, type: 'response' }]);
//             });
//         };

//         recorder.start();
//         setIsRecording(true);
//         setMediaRecorder(recorder);
//     };

//     const stopRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             setIsRecording(false);
//         }
//     };

//     return (
//         <>
//             <div className="container">
//                 <div className="recorder-container">
//                     <h1>Voice Assistant</h1>
//                     <div className="audio-list">
//                         {recordedAudios.map((audio, index) => (
//                             // <audio key={index} controls src={URL.createObjectURL(audioBlob)} className="audio-player" />
//                             <div key={index} className={`audio-item ${audio.type}`}>
//                                 <audio controls src={URL.createObjectURL(audio.blob)} className="audio-player" />
//                             </div>
//                         ))}
//                     </div>
//                     <button className="record-button" onClick={isRecording ? stopRecording : startRecording}>
//                         {isRecording ? 'Listening...' : 'Start Recording'}
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Chat;




import React, { useState } from 'react';
import './Recorder.css';
import sendAudioToServer from './Api'; 
import { useEffect, useNavigate } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedAudios, setRecordedAudios] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [chatid, setChatid] = useState('')
    const {uuid } = useParams()

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        let chunks = [];
        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
            console.log("Audio Blob:", audioBlob);
            // setRecordedAudios(prev => [...prev, audioBlob]);
            // sendAudioToServer(audioBlob);
            const chat_id = localStorage.getItem(`chat_id_${uuid}`) || '';
            console.log(`chat id at ||, ${chat_id}`)
            setRecordedAudios(prev => [...prev, { blob: audioBlob, type: 'user' }]);
            sendAudioToServer(audioBlob, (responseAudioBlob, newChatId) => {
                setRecordedAudios(prev => [...prev, { blob: responseAudioBlob, type: 'response' }]);
                console.log(`Received new chat_id from backend: ${newChatId}`);
                if (newChatId) {
                    setChatid(newChatId);
                    localStorage.setItem(`chat_id_${uuid}`, newChatId); // Update localStorage with new chat_id
                }
            }, { uuid, chat_id});
            
            // const storedChatId = localStorage.getItem(`chat_id_${uuid}`);
            // if (storedChatId === null) {
            //     localStorage.setItem(`chat_id_${uuid}`, chatid);
            //   }
        };
        recorder.start();
        setIsRecording(true);
        setMediaRecorder(recorder);
    };
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="recorder-container">
                    <h1>Voice Assistant</h1>
                    <div className="audio-list">
                        {recordedAudios.map((audio, index) => (
                            // <audio key={index} controls src={URL.createObjectURL(audioBlob)} className="audio-player" />
                            <div key={index} className={`audio-item ${audio.type}`}>
                                <audio controls src={URL.createObjectURL(audio.blob)} className="audio-player" />
                            </div>
                        ))}
                    </div>
                    <button className="record-button" onClick={isRecording ? stopRecording : startRecording}>
                        {isRecording ? 'Listening...' : 'Start Recording'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chat;
