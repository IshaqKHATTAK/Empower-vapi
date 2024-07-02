import React, { useState, useEffect } from 'react';
import { AssemblyAI, RealtimeTranscript } from 'assemblyai';
import { SoxRecording } from './sox.js'; 

interface HelloWorldProps {
    name: string;
}

const Streaming: React.FC<HelloWorldProps> = ({ name }) => {
    const [times, setTimes] = useState(0);

    const handleClick = () => {
        setTimes(times + 1);
    };

    useEffect(() => {
        if (times > 0) {
            document.title = `${name} clicked ${times} times`;
        }
    }, [times, name]);

    const run = async () => {
        const client = new AssemblyAI({
            apiKey: 'YOUR_API_KEY'
        });

        const SAMPLE_RATE = 16_000;

        const transcriber = client.realtime.transcriber({
            sampleRate: SAMPLE_RATE
        });

        transcriber.on('open', ({ sessionId }) => {
            console.log(`Session opened with ID: ${sessionId}`);
        });

        transcriber.on('error', (error: Error) => {
            console.error('Error:', error);
        });

        transcriber.on('close', (code: number, reason: string) =>
            console.log('Session closed:', code, reason)
        );

        transcriber.on('transcript', (transcript: RealtimeTranscript) => {
            if (!transcript.text) {
                return;
            }

            if (transcript.message_type === 'PartialTranscript') {
                console.log('Partial:', transcript.text);
            } else {
                console.log('Final:', transcript.text);
                // Here you can update your React component state with the final transcript if needed
            }
        });

        console.log('Connecting to real-time transcript service');
        await transcriber.connect();

        console.log('Starting recording');
        const recording = new SoxRecording({
            channels: 1,
            sampleRate: SAMPLE_RATE,
            audioType: 'wav' 
        });

        recording.stream().pipeTo(transcriber.stream());

        // Stop recording and close connection using Ctrl-C.
        process.on('SIGINT', async function () {
            console.log();
            console.log('Stopping recording');
            recording.stop();

            console.log('Closing real-time transcript connection');
            await transcriber.close();

            process.exit();
        });
    };

    useEffect(() => {
        run(); // Start the transcription process when the component mounts
    }, []); // Only run once when the component mounts

    return (
        <div>
            <h1>Hello, {name}</h1>
            <p>
                {name} clicked {times} times
            </p>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
};

export default Streaming;
