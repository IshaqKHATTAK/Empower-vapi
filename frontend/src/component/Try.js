// import React from 'react'
// import { AssemblyAI } from "assemblyai";

// const Try = () => {
//     const client = new AssemblyAI({
//         apiKey: process.env.ASSEMBLYAI_API_KEY,
//       });
//       const transcribeAudio = async () => {
//         let transcript = await client.transcripts.transcribe({
//           audio: "./output2.mp3",
//         });
//         return transcript; // <-- Add this line to return the transcript value
//       };
      
//       const handleClick = async () => {
//           const finalresutl = await transcribeAudio()
//           console.log(`transcribe text ${finalresutl}`)
//       }
//   return (
//     <>
//         <button onClick={handleClick} >click me</button>

//     </>
//   )
// }

// export default Try


// import React, { useState, useEffect } from 'react';
// import { AssemblyAI } from "assemblyai";

// const Try = () => {
//   const [transcript, setTranscript] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioContext, setAudioContext] = useState(null);
//   const [source, setSource] = useState(null);
//   const [assemblyAiStream, setAssemblyAiStream] = useState(null);

//   useEffect(() => {
//     const initAssemblyAi = async () => {
//       const client = new AssemblyAI({
//         apiKey: '0b0b5e6ae66047fd96ae0d1a83c31bd6',
//       });
//       const stream = await client.createStream({
//         audio: {
//           sample_rate: 48000,
//         },
//         config: {
//           encoding: 'LINEAR16',
//           sample_rate: 48000,
//         },
//       });
//       setAssemblyAiStream(stream);
//     };
//     initAssemblyAi();
//   }, []);

//   const startRecording = async () => {
//     setIsRecording(true);
//     const audioCtx = new AudioContext();
//     setAudioContext(audioCtx);
//     const stream = new MediaStream();
//     const source = audioCtx.createMediaStreamSource(stream);
//     setSource(source);
//     source.connect(audioCtx.destination);
//     const audioStream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });
//     const audioCtxStream = new MediaStreamAudioSourceNode(audioCtx, {
//       mediaStream: audioStream,
//     });
//     audioCtxStream.connect(assemblyAiStream);
//   };

//   const stopRecording = async () => {
//     setIsRecording(false);
//     source.disconnect();
//     audioContext.close();
//   };

//   const handleTranscript = (transcript) => {
//     setTranscript(transcript.text);
//   };

//   return (
//     <div>
//       {isRecording ? (
//         <button onClick={stopRecording}>Stop Recording</button>
//       ) : (
//         <button onClick={startRecording}>Start Recording</button>
//       )}
//       <p>{transcript}</p>
//     </div>
//   );
// };

// export default Try;
