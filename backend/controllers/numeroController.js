const { getDb } = require('../config/database');

// Obtener todos los números
exports.getAllNumeros = async (req, res) => {
    try {
        const db = getDb();
        const [rows] = await db.query('SELECT * FROM numeros ORDER BY CAST(numero AS UNSIGNED)');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener números libres
exports.getNumerosLibres = async (req, res) => {
    try {
        const db = getDb();
        const [rows] = await db.query('SELECT numero FROM numeros WHERE estado = "libre" ORDER BY CAST(numero AS UNSIGNED)');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener números ocupados
exports.getNumerosOcupados = async (req, res) => {
    try {
        const db = getDb();
        const [rows] = await db.query('SELECT numero FROM numeros WHERE estado = "ocupado" ORDER BY CAST(numero AS UNSIGNED)');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ========== REPORTE NÚMEROS LIBRES ==========
exports.getReporteLibres = async (req, res) => {
    try {
        const db = getDb();
        const [rows] = await db.query('SELECT numero FROM numeros WHERE estado = "libre" ORDER BY CAST(numero AS UNSIGNED)');
        res.json({
            total: rows.length,
            numeros: rows.map(r => r.numero)
        });
    } catch (error) {
        console.error('Error reporte libres:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========== REPORTE NÚMEROS OCUPADOS ==========
exports.getReporteOcupados = async (req, res) => {
    try {
        const db = getDb();
        
        const [rows] = await db.query(`
            SELECT 
                n.numero, 
                e.nombre, 
                e.documento, 
                e.celular,
                e.programa, 
                e.registrado_en as fecha_registro
            FROM numeros n
            INNER JOIN estudiantes e ON n.id = e.numero_id
            WHERE n.estado = 'ocupado'
            ORDER BY CAST(n.numero AS UNSIGNED)
        `);
        
        res.json({
            total: rows.length,
            datos: rows
        });
    } catch (error) {
        console.error('Error en getReporteOcupados:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========== VALIDACIONES ==========
exports.validarNumero = async (req, res) => {
    try {
        const { numero } = req.params;
        const db = getDb();
        
        const [rows] = await db.query('SELECT * FROM numeros WHERE numero = ?', [numero]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Número no encontrado' });
        }
        
        res.json({
            numero: numero,
            disponible: rows[0].estado === 'libre',
            estado: rows[0].estado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bloquearNumero = async (req, res) => {
    return res.status(400).json({ 
        error: 'No se puede bloquear un número sin estudiante. Use el registro de estudiantes.' 
    });
};

exports.desbloquearNumero = async (req, res) => {
    try {
        const { numero } = req.params;
        const db = getDb();
        
        const [rows] = await db.query(`
            SELECT n.id FROM numeros n
            LEFT JOIN estudiantes e ON n.id = e.numero_id
            WHERE n.numero = ? AND n.estado = 'ocupado' AND e.id IS NULL
        `, [numero]);
        
        if (rows.length === 0) {
            return res.status(400).json({ 
                error: 'No se puede desbloquear: el número tiene un estudiante asociado o ya está libre' 
            });
        }
        
        await db.query('UPDATE numeros SET estado = "libre" WHERE numero = ?', [numero]);
        res.json({ success: true, message: `Número ${numero} desbloqueado` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};