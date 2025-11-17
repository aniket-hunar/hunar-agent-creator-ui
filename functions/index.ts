import * as functions from '@google-cloud/functions-framework';
import express from 'express';
import cors from 'cors';

const app = express();

// Use CORS to allow requests from your frontend's origin
app.use(cors({ origin: true }));
app.use(express.json());

const HUNAR_API_URL = 'https://api.voice.hunar.ai/external/v1/agents/';

app.post('/', async (req, res) => {
    const apiKey = process.env.HUNAR_API_KEY;

    if (!apiKey) {
        console.error("HUNAR_API_KEY environment variable not set.");
        return res.status(500).json({ error: 'Server configuration error: API key not found.' });
    }

    try {
        const response = await fetch(HUNAR_API_URL, {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            // Forward Hunar's error message if available
            const errorMessage = responseData.detail || (responseData.errors && responseData.errors[0]?.message) || `Hunar API error: ${response.status}`;
            console.error(`Hunar API Error (${response.status}):`, responseData);
            return res.status(response.status).json({ error: errorMessage });
        }

        // Forward the successful response from Hunar
        return res.status(200).json(responseData);

    } catch (error: any) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: error.message || 'An unexpected internal server error occurred.' });
    }
});

// Export the Express app as a Cloud Function
functions.http('createAgent', app);
