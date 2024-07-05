import React, { useState, useEffect } from 'react';
import './Recorder.css';
import sendAudioToServer from './Api';
import { useParams } from 'react-router-dom';
import { LoadingOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Card, Space, Spin } from 'antd';

const Chat = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedAudios, setRecordedAudios] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [chatid, setChatid] = useState('')
    const [loading, setLoading] = useState(false)
    const { uuid } = useParams();

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        let chunks = [];
        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = () => {
            setLoading(true)
            const audioBlob = new Blob(chunks, { type: 'audio/mp3' });

            const chat_id = localStorage.getItem(`chat_id_${uuid}`) || '';

            setRecordedAudios(prev => [...prev, { blob: audioBlob, type: 'user' }]);
            sendAudioToServer(audioBlob, (responseAudioBlob, newChatId) => {
                setRecordedAudios(prev => [...prev, { blob: responseAudioBlob, type: 'response' }]);

                if (newChatId) {
                    setChatid(newChatId);
                    localStorage.setItem(`chat_id_${uuid}`, newChatId);
                }
                setLoading(false)
            }, { uuid, chat_id });
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

    const contentStyle = {
        padding: 50,
    };
    const content = <div style={contentStyle} />;

    const backgorundstyle = { background: isRecording ? '#d9c5eb' : '#ded5e6', transition: 'background 0.9s ease-in-out' }
    return (
        <div className="container" >
            <div className="recorder-container" style={backgorundstyle} >

                <Card
                    title={<div style={{ textAlign: 'center', color: '#6541e8', fontSize: '20px' }}>Voice Assistant</div>}
                    className='ChatCard'
                    hoverable

                >
                    {recordedAudios.map((audio, index) => (
                        <div key={index} className={`audio-item ${audio.type}`}>

                            {audio.type === 'user' ? (
                                <>
                                    <UserOutlined style={{ fontSize: 20, marginLeft: 'auto', color: '#6541e8', justifyContent:'flex-end' }} />
                                </>
                            ) : (
                                <>
                                    <RobotOutlined style={{ fontSize: 20, marginRight: 10, color: '#6541e8' }} />
                                </>
                            )}
                             <audio controls src={URL.createObjectURL(audio.blob)} className="audio-player" />

                        </div>
                    ))}
                    {loading && (
                        <div className="loading-spinner">
                            <Spin tip="Getting answer" size="large" >
                                {content}
                            </Spin>
                        </div>
                    )}
                    <button className="record-button" onClick={isRecording ? stopRecording : startRecording} >
                        {isRecording ? 'Listening...' : 'Start Recording'}
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default Chat;
