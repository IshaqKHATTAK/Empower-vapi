const BASE_URL = 'http://127.0.0.1:5000'

export const ApiFetch = async ({values, route}) => {
    try {
        const response = await fetch(`${BASE_URL}/${route}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
