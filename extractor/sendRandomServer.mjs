import axios from 'axios'; // Use import if your project uses ES modules
// const axios = require('axios'); // Use require if your project uses CommonJS

// --- Configuration ---
const API_BASE_URL = 'http://localhost:5678'; // <--- REPLACE with your actual backend URL
const API_ENDPOINT = '/server/add-server';
const AUTH_TOKEN = 'YOUR_AUTHENTICATION_TOKEN_HERE'; // <--- REPLACE with your actual Bearer token or other auth mechanism

// --- Helper Functions for Random Data ---

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIp() {
  // Generate a plausible fake IP (e.g., private or non-routable ranges for testing)
  return `${getRandomInt(10, 192)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}.${getRandomInt(1, 254)}`;
}

function getRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// --- Server Data Generator ---

function generateRandomServerData() {
  const serverTypes = ['BASIC', 'ADVANCED', 'BUISNESS']; // Matches ServerType enum
  const serverLocations = ['LOCAL', 'GLOBAL'];      // Matches ServerLocation enum
  const gameNames = [
    // Popular FPS/Shooters
    'CS:GO',
    'Valorant',
    'Apex Legends',
    'Fortnite',
    'Overwatch 2',
    'Call of Duty: Warzone',
    'Call of Duty: Modern Warfare II',
    'Call of Duty: Black Ops Cold War',
    'Battlefield 2042',
    'Battlefield V',
    'Battlefield 1',
    'Rainbow Six Siege',
    'PUBG: Battlegrounds',
    'Escape from Tarkov',
    'Destiny 2',
    'Halo Infinite',
    'Team Fortress 2',
    'Splitgate',
    'DOOM Eternal MP',
    'Quake Champions',
    'Insurgency: Sandstorm',
    'Hell Let Loose',
    'Squad',
    'Titanfall 2',
  
    // MOBAs
    'League of Legends',
    'Dota 2',
    'Smite',
    'Heroes of the Storm', // Less active but known
    'Pokemon Unite',
  
    // MMOs
    'World of Warcraft',
    'Final Fantasy XIV',
    'Elder Scrolls Online',
    'Guild Wars 2',
    'New World',
    'Lost Ark',
    'Black Desert Online',
    'EVE Online',
    'Runescape (OSRS)',
    'Runescape 3',
    'Star Wars: The Old Republic',
    'Albion Online',
  
    // Survival/Crafting
    'Minecraft',
    'Rust',
    'Ark: Survival Evolved',
    'Valheim',
    'Terraria',
    'Don\'t Starve Together',
    'DayZ',
    'Conan Exiles',
    '7 Days to Die',
    'The Forest / Sons of the Forest',
    'Project Zomboid',
    'SCUM',
  
    // Battle Royale (some overlap)
    'Fall Guys',
    'Naraka: Bladepoint',
    'Super Animal Royale',
  
    // Strategy (with MP focus)
    'StarCraft II',
    'Age of Empires IV',
    'Age of Empires II: DE',
    'Civilization VI MP',
    'Total War: Warhammer III MP',
    'Company of Heroes 2',
    'Northgard',
  
    // Sports/Racing
    'Rocket League',
    'FIFA 23', // Or latest FIFA/EA Sports FC
    'NBA 2K23', // Or latest NBA 2K
    'Assetto Corsa Competizione',
    'iRacing',
    'F1 23', // Or latest F1
  
    // Party/Social/Misc
    'Among Us',
    'Garry\'s Mod',
    'Grand Theft Auto V Online',
    'Red Dead Online',
    'Sea of Thieves',
    'Phasmophobia',
    'Jackbox Games',
    'Left 4 Dead 2',
    'Payday 2',
    'Deep Rock Galactic',
    'Warframe',
    'Arma 3',
    'VRChat', // Technically needs servers
    'Diablo IV',
    'Path of Exile',
    'Street Fighter 6',
    'Mortal Kombat 1',
    'Tekken 7',
    'MultiVersus',
    'Tower Unite',
    'Factorio MP',
    'Satisfactory MP',
    'Monster Hunter Rise',
    'Monster Hunter World',
    'Killing Floor 2',
    'Chivalry 2',
    'Mordhau',
  ];
  
  const regions = [
    // North America
    'US-East (N. Virginia)',
    'US-East (Ohio)',
    'US-East (New York)',
    'US-East (Miami)',
    'US-East (Atlanta)',
    'US-West (N. California)',
    'US-West (Oregon)',
    'US-West (Los Angeles)',
    'US-Central (Texas)',
    'US-Central (Illinois)',
    'US-Central (Iowa)',
    'Canada-Central (Montreal)',
    'Canada-East (Toronto)',
    'Canada-West (Vancouver)',
    'NA-Central',
    'NA-East',
    'NA-West',
  
    // Europe
    'EU-West (London)',
    'EU-West (Paris)',
    'EU-West (Ireland)',
    'EU-Central (Frankfurt)',
    'EU-Central (Amsterdam)',
    'EU-North (Stockholm)',
    'EU-North (Finland)',
    'EU-South (Milan)',
    'EU-South (Madrid)',
    'EU-Central (Warsaw)',
    'EU-Zurich',
    'Europe-West',
    'Europe-Central',
    'Europe-North',
  
    // Asia Pacific
    'AP-Northeast (Tokyo)',
    'AP-Northeast (Seoul)',
    'AP-Southeast (Singapore)',
    'AP-Southeast (Jakarta)',
    'AP-South (Mumbai)',
    'AP-East (Hong Kong)',
    'AP-Sydney',
    'AP-Melbourne',
    'Asia-Tokyo',
    'Asia-Seoul',
    'Asia-Singapore',
    'Asia-Mumbai',
    'Asia-HongKong',
    'Oceania-Sydney',
  
    // South America
    'SA-East (Sao Paulo)',
    'SA-West (Santiago)', // Less common but exists
    'BR-South',
    'Brazil-SP',
  
    // Middle East & Africa
    'ME-South (Bahrain)',
    'ME-Central (Dubai)',
    'Africa-North (Cape Town)', // Often labeled North for AWS/Azure
    'Africa-Johannesburg',
    'MEA',
  
    // Generic / Broad
    'Global',
    'AnyCast',
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Oceania',
    'Africa',
    'Middle East',
  ];

  const serverPort = getRandomInt(10000, 65535);
  const serverHost = getRandomIp();

  const serverData = {
    server_name: `${getRandomElement(regions)} ${getRandomElement(gameNames)} Proxy #${getRandomInt(1, 999)}`,
    server_port: serverPort,
    server_host: serverHost,
    server_username: `proxy_user_${getRandomInt(100, 999)}`,
    server_password: getRandomString(12),
    display_host: serverHost, // Often same as server_host for display
    display_port: String(serverPort), // DTO expects string for display_port
    speed: getRandomInt(50, 1000), // Example: Speed in Mbps
    categoryId: getRandomInt(1, 5), // Example: Assuming 5 categories exist
    type: getRandomElement(serverTypes),
    location: getRandomElement(serverLocations),
  };

  return serverData;
}

// --- API Call Function ---

async function sendServerData() {
  const serverPayload = generateRandomServerData();
  const url = `${API_BASE_URL}${API_ENDPOINT}`;

  console.log('Attempting to send server data:');
  console.log(JSON.stringify(serverPayload, null, 2)); // Pretty print the data being sent

  try {
    const response = await axios.post(url, serverPayload, {
      headers: {
        'Content-Type': 'application/json',
        // --- IMPORTANT: Add your Authentication Header ---
        // If you use a different auth scheme, adjust the header accordingly
        // e.g., 'X-API-Key': 'YOUR_API_KEY'
      },
    });

    console.log('\n--- Success ---');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data;

  } catch (error) {
    console.error('\n--- Error Sending Data ---');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error: No response received.', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Axios Config Error:', error.message);
    }
    // Optional: Log the full error object for more details
    // console.error('Full Error Object:', error);
    return null; // Indicate failure
  }
}

// --- Execute ---


// Optional: Send multiple servers
async function sendMultipleServers(count) {
  console.log(`\n--- Sending ${count} servers ---`);
  for (let i = 0; i < count; i++) {
    console.log(`\nSending server ${i + 1} of ${count}...`);
    await sendServerData();
    // Optional delay between requests
    // await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
  }
  console.log(`\n--- Finished sending ${count} servers ---`);
}
sendMultipleServers(200); // Example: Send 5 random servers