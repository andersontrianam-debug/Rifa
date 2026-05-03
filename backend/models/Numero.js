const { getDb } = require('../config/database');

class Numero {
    // Obtener todos los números
    static async getAll() {
        const db = getDb();
        const [rows] = await db.query(
            'SELECT * FROM numeros ORDER BY CAST(numero AS UNSIGNED)'
        );
        return rows;
    }

    // Obtener números libres
    static async getLibres() {
        const db = getDb();
        const [rows] = await db.query(
            'SELECT numero FROM numeros WHERE estado = "libre" ORDER BY CAST(numero AS UNSIGNED)'
        );
        return rows;
    }

    // Obtener números ocupados
    static async getOcupados() {
        const db = getDb();
        const [rows] = await db.query(
            'SELECT numero FROM numeros WHERE estado = "ocupado" ORDER BY CAST(numero AS UNSIGNED)'
        );
        return rows;
    }
    
    // ========== NUEVO: Actualizar estado de un número ==========
    static async updateEstado(numero, estado) {
        const db = getDb();
        const [result] = await db.query(
            'UPDATE numeros SET estado = ? WHERE numero = ?',
            [estado, numero]
        );
        return result;
    }
    
    // ========== NUEVO: Obtener número específico ==========
    static async getByNumero(numero) {
        const db = getDb();
        const [rows] = await db.query(
            'SELECT * FROM numeros WHERE numero = ?',
            [numero]
        );
        return rows[0];
    }

  

// Obtener números ocupados con datos de estudiantes
static async getOcupadosConEstudiantes() {
    const db = getDb();
    const [rows] = await db.query(`
        SELECT n.numero, e.nombre, e.documento, e.programa, e.fecha_registro
        FROM numeros n
        INNER JOIN estudiantes e ON n.id = e.numero_id
        WHERE n.estado = 'ocupado'
        ORDER BY CAST(n.numero AS UNSIGNED)
    `);
    return rows;
}
}

module.exports = Numero;

