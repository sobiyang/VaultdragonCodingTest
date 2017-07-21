'use strict'

module.exports = {
    name: 'Vaultdragon Coding Test API',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    api_key: process.env.API_KEY || 'e255e7998e964b8258f757d8a0c845a900ff9a7ab5e6b0f1afc2fd788439a738',
    timeout: 30,
    db: {
        uri: './localDB.db',
        busyTimeout: 5
    },
}