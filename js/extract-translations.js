// extract-translations.js - Node.js script to extract translations

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const outputFile = 'translations/template.json';
const translations = {};

// Walk through directories to find HTML files
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (path.extname(file) === '.html') {
      extractTranslations(filePath);
    }
  });
}

// Extract translations from a file
function extractTranslations(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  
  $('[data-i18n]').each((i, element) => {
    const key = $(element).attr('data-i18n');
    const value = $(element).text().trim();
    
    if (key && value && !translations[key]) {
      translations[key] = value;
    }
  });
}

// Main execution
walkDir('./');

// Write output file
fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2));
console.log(`Extracted ${Object.keys(translations).length} translation keys to ${outputFile}`);
