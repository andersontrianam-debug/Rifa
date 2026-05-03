const { getDb } = require('../config/database');

class Sorteo {
    // Guardar resultado del sorteo
    static async guardarResultado(numeroGanador, estudianteId) {
        const db = getDb();
        const [result] = await db.query(
            `INSERT INTO sorteos (numero_ganador, estudiante_id, fecha_sorteo, activo) 
             VALUES (?, ?, NOW(), TRUE)`,
            [numeroGanador, estudianteId]
        );
        return result.insertId;
    }
    
    // Verificar si ya se realizó un sorteo activo
    static async haySorteoActivo() {
    const db = getDb();
    const [rows] = await db.query(
        `SELECT s.id, s.numero_ganador, s.fecha_sorteo, 
                e.nombre, e.documento, e.celular, e.programa
         FROM sorteos s
         INNER JOIN estudiantes e ON s.estudiante_id = e.id
         WHERE s.activo = TRUE 
         ORDER BY s.fecha_sorteo DESC 
         LIMIT 1`
    );
    return rows[0] || null;
}
    
    // Obtener historial de sorteos
    static async getHistorial() {
    const db = getDb();
    const [rows] = await db.query(`
        SELECT s.id, s.numero_ganador, s.fecha_sorteo, s.activo,
               e.nombre, e.documento, e.celular, e.programa
        FROM sorteos s
        INNER JOIN estudiantes e ON s.estudiante_id = e.id
        ORDER BY s.fecha_sorteo DESC
    `);
    return rows;
}
    
    // Finalizar sorteo (desactivar) - para reinicio
    static async finalizarSorteo(id) {
        const db = getDb();
        await db.query(`UPDATE sorteos SET activo = FALSE WHERE id = ?`, [id]);
    }
}

module.exports = Sorteo;