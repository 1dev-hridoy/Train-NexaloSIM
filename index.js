const axios = require('axios');
const fs = require('fs').promises;

// Configuration
const SIM_API_BASE_URL = 'https://sim.api.nexalo.xyz/v1/train';
const SIM_API_KEY = 'MAINPOINT'; // Replace with your actual API key
const LANGUAGE = 'bn'; // Bangla language code

// File paths
const JSON_FILE_PATH = 'training_data.json';
const LOG_FILE_PATH = 'training_log.txt';

// Utility function to log messages
async function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    await fs.appendFile(LOG_FILE_PATH, logMessage, 'utf8');
    console.log(`[${timestamp}] ${message}`);
}

// Function to read JSON file
async function loadJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        if (!Array.isArray(jsonData)) {
            throw new Error('JSON file must contain an array of objects');
        }
        return jsonData;
    } catch (error) {
        await log(`Error loading JSON file: ${error.message}`);
        throw error;
    }
}

// Function to train SIM API with a single question-answer pair
async function trainSimApi(data) {
    const payload = {
        api: SIM_API_KEY,
        question: data.question,
        answer: data.answer || '', // Required by API, default to empty string if not provided
        response_type: data.response_type || 'text', // Default to 'text'
        language: data.language || LANGUAGE, // Use provided language or default
        sentiment: data.sentiment || 'neutral', // Optional, default to 'neutral'
        category: data.category || 'general', // Optional, default to 'general'
        response: data.response || data.answer || '', // Optional, defaults to answer
        type: data.type || 'good', // Optional, default to 'good'
        image_url: data.image_url || null // Optional, null if not provided
    };

    // Validate required fields
    if (!payload.question) {
        await log(`Invalid payload: Missing 'question'`);
        return false;
    }

    try {
        const response = await axios.post(SIM_API_BASE_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        const result = response.data;

        if (result.status_code === 201) {
            await log(`Successfully trained: Question: '${payload.question}' | Response Type: '${payload.response_type}' | ` +
                (payload.response_type === 'text' ? `Answer: '${payload.answer}'` : `Image URL: '${payload.image_url}'`) +
                ` | Sentiment: '${payload.sentiment}' | Category: '${payload.category}' | Type: '${payload.type}'`);
            return true;
        } else {
            await log(`Failed to train: Question: '${payload.question}' | Response: ${JSON.stringify(result)}`);
            return false;
        }
    } catch (error) {
        await log(`API request failed for '${payload.question}': ${error.message}`);
        return false;
    }
}

// Main function to process bulk training
async function bulkTrainSimApi(jsonFilePath) {
    await log('Starting bulk training process...');

    // Load JSON data
    let trainingData;
    try {
        trainingData = await loadJsonFile(jsonFilePath);
    } catch (error) {
        return;
    }

    const totalPairs = trainingData.length;
    let successCount = 0;

    // Process each pair
    for (let index = 0; index < totalPairs; index++) {
        const item = trainingData[index];

        if (await trainSimApi(item)) {
            successCount++;
        }

        // Add a 1-second delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Log progress
        if ((index + 1) % 10 === 0 || index + 1 === totalPairs) {
            await log(`Progress: ${index + 1}/${totalPairs} pairs processed`);
        }
    }

    // Summary
    await log(`Bulk training completed. Successfully trained ${successCount}/${totalPairs} pairs.`);
    await log(`Failed: ${totalPairs - successCount} pairs.`);
}

// Run the bulk training
bulkTrainSimApi(JSON_FILE_PATH).catch(async error => {
    await log(`Main error: ${error.message}`);
});