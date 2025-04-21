import axios from 'axios';
import fs from 'fs'; // Use fs for createReadStream and unlinkSync
import fsp from 'fs/promises'; // Use fs.promises for readFile
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import FormData from 'form-data';

// --- Configuration ---
const API_BASE_URL = 'http://localhost:5678'; // Replace with your actual API URL
const GAMES_JSON_PATH = './games.json'; // Path to your games data
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN'; // Replace with your actual authentication token if needed

const GameLocation = { // Mimic your backend enum
    LOCAL: 'LOCAL',
    GLOBAL: 'GLOBAL',
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if your API requires it
        ...(AUTH_TOKEN && { 'Authorization': `Bearer ${AUTH_TOKEN}` }),
    }
});

// --- Helper Functions ---

/**
 * Downloads an image from a URL to a temporary path.
 * @param {string} url - The URL of the image to download.
 * @param {string} tempPath - The path to save the temporary file.
 * @returns {Promise<void>}
 */
async function downloadImage(url, tempPath) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', (err) => {
                console.error(`Error writing file ${tempPath}:`, err);
                // Attempt cleanup even on write error
                try { fs.unlinkSync(tempPath); } catch (_) {}
                reject(err);
            });
            response.data.on('error', (err) => {
                 console.error(`Error downloading stream from ${url}:`, err);
                 // Attempt cleanup even on stream error
                 try { fs.unlinkSync(tempPath); } catch (_) {}
                 reject(err);
            })
        });
    } catch (error) {
        console.error(`Failed to download image from ${url}:`, error.message || error);
        throw error; // Re-throw to be caught by the caller
    }
}

/**
 * Uploads an image file to the game image endpoint.
 * @param {number} gameId - The ID of the game.
 * @param {string} imagePath - The path to the image file to upload.
 * @returns {Promise<any>} - The API response.
 */
async function uploadImage(gameId, imagePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath), path.basename(imagePath)); // Provide filename

    try {
        console.log(`   Uploading image ${path.basename(imagePath)} for game ID ${gameId}...`);
        const response = await api.put(`/game/add-game-image/${gameId}`, form, {
            headers: {
                ...form.getHeaders(), // Important for multipart/form-data
                 // Keep Auth header if needed
                ...(AUTH_TOKEN && { 'Authorization': `Bearer ${AUTH_TOKEN}` }),
            },
        });
        console.log(`   Image uploaded successfully.`);
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || error;
        console.error(`   Failed to upload image ${path.basename(imagePath)} for game ID ${gameId}:`, errorMsg);
        // Decide if you want to throw or just log and continue
        // throw error;
    } finally {
        // Clean up the temporary file after attempting upload
        try {
            fs.unlinkSync(imagePath);
            // console.log(`   Deleted temp file: ${imagePath}`);
        } catch (unlinkError) {
            console.error(`   Failed to delete temp file ${imagePath}:`, unlinkError);
        }
    }
}


// --- Main Processing Function ---

async function processGames() {
    console.log(`Reading games data from ${GAMES_JSON_PATH}...`);
    let gamesData;
    try {
        const fileContent = await fsp.readFile(GAMES_JSON_PATH, 'utf-8');
        gamesData = JSON.parse(fileContent);
    } catch (error) {
        console.error(`Failed to read or parse ${GAMES_JSON_PATH}:`, error);
        return;
    }

    const tempDir = os.tmpdir();
    console.log(`Using temporary directory: ${tempDir}`);

    const gameIds = Object.keys(gamesData);
    console.log(`Found ${gameIds.length} games to process.`);

    for (const steamId of gameIds) {
        const game = gamesData[steamId];
        console.log(`\nProcessing game: ${game.name} (Steam ID: ${steamId})`);

        // 1. Prepare Game Data for POST request
        const createGamePayload = {
            title_tm: `${game.name} (tm)`, // Placeholder
            title_en: game.name || `Game ${steamId}`,
            title_ru: `${game.name} (ru)`, // Placeholder
            desc_tm: game.short_description || game.about_the_game || 'No description (tm)',
            desc_en: game.short_description || game.about_the_game || 'No description available.',
            desc_ru: game.short_description || game.about_the_game || 'Нет описания (ru)',
            site_url: game.website || `https://store.steampowered.com/app/${steamId}`, // Fallback to steam page
            star: 3, // Default star rating
            steam_id: steamId,
            location: GameLocation.GLOBAL, // Default location
        };

        let createdGameId = null;

        // 2. Add the Game via API
        try {
            console.log(` Adding game "${createGamePayload.title_en}" to API...`);
            const response = await api.post('/game/add-game', createGamePayload);
            if (response.data && response.data.id) { // Adjust based on your actual response structure
                createdGameId = response.data.id;
                console.log(` Game added successfully with ID: ${createdGameId}`);
            } else {
                console.warn(` Game potentially added, but no ID received in response for ${game.name}. Response:`, response.data);
                // Attempt to handle cases where ID might be nested differently, or log and skip images.
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || error;
            console.error(` Failed to add game ${game.name}:`, errorMsg);
            // Skip screenshot processing for this game if adding failed
            continue;
        }

        // 3. Process Screenshots (if game added successfully and screenshots exist)
        if (createdGameId && Array.isArray(game.screenshots) && game.screenshots.length > 0) {
            console.log(` Processing ${game.screenshots.length} screenshots for game ID ${createdGameId}...`);

            for (const screenshotUrl of game.screenshots) {
                 // Generate a unique temporary filename
                const uniqueSuffix = crypto.randomBytes(8).toString('hex');
                const extension = path.extname(screenshotUrl.split('?')[0]) || '.jpg'; // Get extension, default to .jpg
                const tempFileName = `game_${createdGameId}_${uniqueSuffix}${extension}`;
                const tempFilePath = path.join(tempDir, tempFileName);

                try {
                    // Download
                    console.log(`  Downloading ${screenshotUrl} to ${tempFilePath}...`);
                    await downloadImage(screenshotUrl, tempFilePath);
                    console.log(`  Download complete.`);

                    // Upload
                    await uploadImage(createdGameId, tempFilePath);
                    // uploadImage handles its own cleanup via finally block

                } catch (error) {
                    console.error(`  Error processing screenshot ${screenshotUrl}:`, error.message || error);
                    // Cleanup might have already happened in downloadImage or uploadImage,
                    // but try again just in case the error was before upload attempt.
                    try { fs.unlinkSync(tempFilePath); } catch (_) {}
                }
            }
            console.log(` Finished processing screenshots for game ID ${createdGameId}.`);
        } else if (createdGameId) {
             console.log(` No screenshots found or game add failed for ${game.name}.`);
        }
    }

    console.log('\n--- Processing Complete ---');
}

// --- Run the script ---
processGames().catch(err => {
    console.error("\n--- An Unhandled Error Occurred ---");
    console.error(err);
    process.exit(1);
});