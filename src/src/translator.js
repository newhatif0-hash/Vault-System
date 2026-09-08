const translate = require('google-translate-api-x').default;

async function translateToArabic(text) {
    try {
        if (!text || text.trim().length === 0) return text;
        
        const result = await translate(text, { to: 'ar' });
        return result.text;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

async function translateObject(obj) {
    if (typeof obj === 'string') {
        return await translateToArabic(obj);
    } else if (Array.isArray(obj)) {
        return Promise.all(obj.map(item => translateObject(item)));
    } else if (typeof obj === 'object' && obj !== null) {
        const translated = {};
        for (const [key, value] of Object.entries(obj)) {
            translated[key] = await translateObject(value);
        }
        return translated;
    }
    return obj;
}

module.exports = { translateToArabic, translateObject };
