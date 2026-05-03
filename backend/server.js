const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./config/database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Rutas
app.use('/api/numeros', require('./routes/numeroRoutes'));
app.use('/api/estudiantes', require('./routes/estudianteRoutes'));
app.use('/api/sorteo', require('./routes/sorteoRoutes'));

// Inicializar BD y arrancar servidor
(async () => {
    try {
        await initializeDatabase();
        console.log('📦 Base de datos lista');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    }
})();