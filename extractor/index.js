const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

// Load JSON and parse
// const games = JSON.parse(fs.readFileSync('./games.json', 'utf-8'));
const categories = JSON.parse(fs.readFileSync('./categories.json', 'utf-8'));
// Create a map of unique categories (first game per category)
const categoryMap = new Map();


// Helper to download an image from a URL
async function downloadImage(url, destFolder = './temp') {
  const ext = path.extname(new URL(url).pathname) || '.jpg';
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(destFolder, filename);

  fs.mkdirSync(destFolder, { recursive: true });

  const writer = fs.createWriteStream(filePath);
  const response = await axios.get(url, { responseType: 'stream' });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}

// Main runner
(async () => {
    console.log(categories)
    let i = 0;
  for(category of categories) {
    try {
        i++;
        const imagePath = await downloadImage(category.image_url);
  
        const form = new FormData();
        form.append('file', fs.createReadStream(imagePath));
  
        const response = await axios.patch(
          'http://localhost:5678/category/update-category-image/'+i,
          form,
          {
            headers: {
              ...form.getHeaders(),
            },
          }
        );
  
        console.log(`✅ Uploaded category ${category.name_tm}:`, response.data);
  
        fs.unlinkSync(imagePath); // Clean up temp image
      } catch (error) {
        console.error(`❌ Error with category ${category.name_tm}:`, error.message);
      }
  }
})();
