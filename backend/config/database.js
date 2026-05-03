const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function initializeDatabase() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
        const connection = await pool.getConnection();
        console.log('✅ Conectado a MySQL correctamente');
        connection.release();
        
        return pool;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        throw error;
    }
}

function getDb() {
    if (!pool) {
        throw new Error('Base de datos no inicializada');
    }
    return pool;
}

module.exports = { initializeDatabase, getDb };