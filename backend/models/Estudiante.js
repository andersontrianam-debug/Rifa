const { getDb } = require('../config/database');

class Estudiante {
    // Registrar un nuevo estudiante y bloquear su número
    static async registrarConNumero(estudianteData) {
        const db = getDb();
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // 1. Verificar que el número existe y está libre
            const [numeroCheck] = await connection.query(
                'SELECT id, estado FROM numeros WHERE numero = ?',
                [estudianteData.numero]
            );
            
            if (numeroCheck.length === 0) {
                throw new Error('Número no encontrado');
            }
            
            if (numeroCheck[0].estado === 'ocupado') {
                throw new Error('El número ya está ocupado');
            }
            
            // 2. Verificar que el documento no esté registrado
            const [documentoCheck] = await connection.query(
                'SELECT id FROM estudiantes WHERE documento = ?',
                [estudianteData.documento]
            );
            
            if (documentoCheck.length > 0) {
                throw new Error('El documento ya está registrado');
            }
            
            // 3. Insertar el estudiante (con celular)
            const [estudianteResult] = await connection.query(
                `INSERT INTO estudiantes (nombre, documento, programa, celular, numero_id) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    estudianteData.nombre,
                    estudianteData.documento,
                    estudianteData.programa,
                    estudianteData.celular,
                    numeroCheck[0].id
                ]
            );
            
            // 4. Actualizar el estado del número a 'ocupado'
            await connection.query(
                'UPDATE numeros SET estado = "ocupado" WHERE id = ?',
                [numeroCheck[0].id]
            );
            
            await connection.commit();
            
            return {
                success: true,
                estudianteId: estudianteResult.insertId,
                numero: estudianteData.numero,
                message: `Estudiante ${estudianteData.nombre} registrado con el número ${estudianteData.numero}`
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
    // Obtener todos los estudiantes
    static async getAll() {
        const db = getDb();
        const [rows] = await db.query(`
            SELECT e.*, n.numero 
            FROM estudiantes e
            LEFT JOIN numeros n ON e.numero_id = n.id
            ORDER BY e.registrado_en DESC
        `);
        return rows;
    }
    
    // Obtener estudiantes con números ocupados
    static async getEstudiantesConNumeros() {
        const db = getDb();
        const [rows] = await db.query(`
            SELECT e.nombre, e.documento, e.programa, e.celular, n.numero, e.registrado_en
            FROM estudiantes e
            INNER JOIN numeros n ON e.numero_id = n.id
            WHERE n.estado = 'ocupado'
            ORDER BY n.numero ASC
        `);
        return rows;
    }
    
    // Buscar estudiante por documento
    static async findByDocumento(documento) {
        const db = getDb();
        const [rows] = await db.query(
            `SELECT e.*, n.numero 
             FROM estudiantes e
             LEFT JOIN numeros n ON e.numero_id = n.id
             WHERE e.documento = ?`,
            [documento]
        );
        return rows[0];
    }
}

module.exports = Estudiante;