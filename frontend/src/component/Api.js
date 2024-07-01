const BASE_URL = 'http://127.0.0.1:5000';

const sendAudioToServer = async (audioBlob, onResponse, {uuid, chat_id}) => {

    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice_note.mp3');
        formData.append('chat_id', chat_id)
        const response = await fetch(`${BASE_URL}/chat/${uuid}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            
            const audioBlob = await response.blob();
            const chatId = response.headers.get('chat_id');
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log(`chat id = ${chatId}`);
            onResponse(audioBlob,chatId);
            
        }
        
        else {
            console.error('Failed to receive response from server');
        }
    } catch (error) {
        console.error('Error sending audio to server:', error);
        throw error; 
    }
};

export default sendAudioToServer;

