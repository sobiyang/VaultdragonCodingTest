'use strict'

module.exports = {
    name: 'Vaultdragon Coding Test API',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: './localDB.db',
    },
}