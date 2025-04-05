const axios = require('axios');
const fs = require('fs').promises;
const chalk = require('chalk');
const gradient = require('gradient-string');
const ProgressBar = require('progress');

// Configuration
const SIM_API_BASE_URL = 'https://sim.api.nexalo.xyz/v1/train';
const SIM_API_KEY = 'YOUR_API'; // Replace with your actual API key
const LANGUAGE = 'bn'; // Bangla language code

// File paths
const JSON_FILE_PATH = 'training_data.json';
const LOG_FILE_PATH = 'training_log.txt';

// Gradient definitions
const successGradient = gradient('green', 'cyan');
const errorGradient = gradient('red', 'yellow');
const infoGradient = gradient('blue', 'magenta');

// Utility function to log messages with color
async function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    await fs.appendFile(LOG_FILE_PATH, logMessage, 'utf8');

    let styledMessage;
    switch (type) {
        case 'success':
            styledMessage = successGradient(`[${timestamp}] ${message}`);
            break;
        case 'error':
            styledMessage = errorGradient(`[${timestamp}] ${message}`);
            break;
        default:
            styledMessage = infoGradient(`[${timestamp}] ${message}`);
    }
    console.log(styledMessage);
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
        await log(`Error loading JSON file: ${error.message}`, 'error');
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

    if (!payload.question) {
        await log(`Invalid payload: Missing 'question'`, 'error');
        return false;
    }

    try {
        const response = await axios.post(SIM_API_BASE_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const result = response.data;

        if (result.status_code === 201) {
            await log(`Successfully trained: Question: '${payload.question}' | Response Type: '${payload.response_type}' | ` +
                (payload.response_type === 'text' ? `Answer: '${payload.answer}'` : `Image URL: '${payload.image_url}'`) +
                ` | Sentiment: '${payload.sentiment}' | Category: '${payload.category}' | Type: '${payload.type}'`, 'success');
            return true;
        } else {
            await log(`Failed to train: Question: '${payload.question}' | Response: ${JSON.stringify(result)}`, 'error');
            return false;
        }
    } catch (error) {
        const status = error.response?.status || 'No status';
        const responseData = error.response?.data || error.message;
        await log(`API request failed for '${payload.question}': Status: ${status} | Response: ${typeof responseData === 'string' ? responseData.slice(0, 200) : JSON.stringify(responseData)}`, 'error');
        return false;
    }
}

// Main function to process bulk training with progress bar
async function bulkTrainSimApi(jsonFilePath) {
    // Abstract header
    console.log(chalk.bold(gradient.rainbow('====================================')));
    console.log(chalk.bold(gradient.retro('      B U L K   T R A I N I N G     ')));
    console.log(chalk.bold(gradient.rainbow('====================================')));
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

    // Initialize progress bar
    const bar = new ProgressBar(chalk.cyan('Training [:bar] :percent | :current/:total | ETA: :etas'), {
        total: totalPairs,
        width: 40,
        complete: '█',
        incomplete: '░',
        clear: true
    });

    // Process each pair
    for (let index = 0; index < totalPairs; index++) {
        const item = trainingData[index];

        // Boxed separation
        console.log(chalk.gray('┌' + '─'.repeat(80) + '┐'));
        console.log(chalk.gray(`│ Training Item ${index + 1}/${totalPairs} ` + ' '.repeat(60 - (index + 1).toString().length - totalPairs.toString().length) + '│'));

        if (await trainSimApi(item)) {
            successCount++;
        }

        console.log(chalk.gray('└' + '─'.repeat(80) + '┘'));

        // Update progress bar
        bar.tick();

        // Add a 1-second delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Summary with styled footer
    console.log(chalk.bold(gradient.rainbow('====================================')));
    console.log(chalk.bold(gradient.mind(`      T R A I N I N G   C O M P L E T E D     `)));
    console.log(chalk.bold(gradient.rainbow('====================================')));
    await log(`Bulk training completed. Successfully trained ${successCount}/${totalPairs} pairs.`, 'success');
    await log(`Failed: ${totalPairs - successCount} pairs.`, successCount === totalPairs ? 'success' : 'error');
}

// Run the bulk training
bulkTrainSimApi(JSON_FILE_PATH).catch(async error => {
    await log(`Main error: ${error.message}`, 'error');
});