require('dotenv').config()

const env = {
    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || '147.93.70.83',
    PROXY: process.env.PROXY || '',
    GMAIL_USER: process.env.GMAIL_USER || '',
    GMAIL_PASS: process.env.GMAIL_PASS || ''
}

module.exports = env;