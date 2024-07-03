import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { useState, useEffect } from "react";

const Stream = () => {
    const [response, setResponse] = useState("");
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:5000");
        setWebSocket(ws);
        
        ws.onmessage = (event) => {
            setResponse(event.data);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            {/* <ReactMediaRecorder
                audio
                render={({ startRecording, stopRecording, mediaBlobUrl }) => (
                    <div>
                        <button onClick={startRecording}>Start Recording</button>
                        <button onClick={stopRecording}>Stop Recording</button>
                        <audio src={mediaBlobUrl} controls autoPlay loop />
                    </div>
                )}
            /> */}
            <p>
                Message: {response}
            </p>
        </div>
    )
}

export default Stream;




