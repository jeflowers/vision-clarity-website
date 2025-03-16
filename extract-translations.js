#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const CONFIG = {
    htmlDirectories: ['pages', '.'], // Directories to scan for HTML files
    outputDirectory: 'locales',
    supportedLanguages: ['en', 'es', 'zh', 'ko', 'hy']
};

/**
 * Recursively merges two objects, giving preference to the source object
 * @param {Object} target - The target object to merge into
 * @param {Object} source - The source object to merge from
 * @returns {Object} The merged object
 */
function deepMerge(target, source) {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                // If source key is an object, recursively merge
                if (!target[key]) Object.assign(output, { [key]: {} });
                output[key] = deepMerge(output[key], source[key]);
            } else {
                // For non-object values, prefer source
                output[key] = source[key];
            }
        });
    }

    return output;
}

/**
 * Check if a value is an object
 * @param {*} item - The value to check
 * @returns {boolean} Whether the value is an object
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Sanitize translation keys and values
 * @param {string} key - The translation key
 * @param {string} value - The translation value
 * @returns {Object} Sanitized key-value pair
 */
function sanitizeTranslation(key, value) {
    return {
        key: key.trim(),
        value: value 
            ? value.replace(/\s+/g, ' ').trim() 
            : ''
    };
}

/**
 * Extract translations from HTML files
 * @returns {Object} Extracted translations
 */
function extractTranslations() {
    const translations = {
        global: {},
        services: {},
        header: {},
        footer: {}
    };

    // Scan HTML files
    CONFIG.htmlDirectories.forEach(dir => {
        const fullPath = path.resolve(dir);
        const files = fs.readdirSync(fullPath)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(fullPath, file));

        files.forEach(file => {
            const html = fs.readFileSync(file, 'utf-8');
            const dom = new JSDOM(html);
            const document = dom.window.document;

            // Find all elements with data-i18n attribute
            const i18nElements = document.querySelectorAll('[data-i18n]');

            i18nElements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const { value } = sanitizeTranslation(key, element.textContent);

                // Organize translations by hierarchy
                const keyParts = key.split('.');
                let currentSection = translations;

                // Traverse/create nested object structure
                for (let i = 0; i < keyParts.length - 1; i++) {
                    const part = keyParts[i];
                    if (!currentSection[part]) {
                        currentSection[part] = {};
                    }
                    currentSection = currentSection[part];
                }

                // Set final value
                const finalKey = keyParts[keyParts.length - 1];
                currentSection[finalKey] = value;
            });
        });
    });

    return translations;
}

/**
 * Generate translation files for each supported language
 */
function generateTranslationFiles() {
    // Ensure output directory exists
    const outputPath = path.resolve(CONFIG.outputDirectory);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    // Extract base translations
    const baseTranslations = extractTranslations();

    // Generate files for supported languages
    CONFIG.supportedLanguages.forEach(lang => {
        const filePath = path.join(outputPath, `${lang}.json`);
        
        // Read existing translations if file exists
        let existingTranslations = {};
        try {
            existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            console.log(`Creating new translation file for ${lang}`);
        }

        // Merge existing translations with base translations
        const mergedTranslations = deepMerge(baseTranslations, existingTranslations);

        // Write updated file
        fs.writeFileSync(
            filePath, 
            JSON.stringify(mergedTranslations, null, 2), 
            'utf-8'
        );

        console.log(`Generated translation file for ${lang}`);
    });

    console.log('Translation files generation complete.');
}

// Run the script
generateTranslationFiles();

module.exports = {
    extractTranslations,
    generateTranslationFiles
};