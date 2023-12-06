// src/lib/logger.ts

import fetch from 'cross-fetch'; // Use cross-fetch or similar for server-side fetch support

export async function getLogs() {

    const response = await fetch('/api/v1/logs/get', {
        method: 'GET',
    });

    console.log(response);

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    // Optionally handle the response data
}


export async function logEventToDB(eventData: {
    user: string;
    action: string;
    success: boolean;
    module: string;
    message: string;
}) {

    console.log(JSON.stringify(eventData));
    const response = await fetch('/api/v1/logs/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });


    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    // Optionally handle the response data
}
