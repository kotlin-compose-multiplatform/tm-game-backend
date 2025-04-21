const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('./games.json', 'utf-8');
let games;

try {
  const parsed = JSON.parse(raw);
  games = Array.isArray(parsed) ? parsed : parsed.games;
} catch (e) {
  console.error('❌ Failed to parse JSON:', e.message);
  process.exit(1);
}

const numParts = 5;
const chunkSize = Math.ceil(games.length / numParts);

for (let i = 0; i < numParts; i++) {
  const chunk = games.slice(i * chunkSize, (i + 1) * chunkSize);
  const filename = `games-part-${i + 1}.json`;
  fs.writeFileSync(filename, JSON.stringify(chunk, null, 2));
  console.log(`✅ Wrote ${chunk.length} games to ${filename}`);
}
