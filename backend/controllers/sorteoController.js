const Sorteo = require('../models/Sorteo');
const { getDb } = require('../config/database');

// Obtener números ocupados con sus estudiantes
async function getNumerosOcupadosConEstudiantes() {
    const db = getDb();
    const [rows] = await db.query(`
        SELECT n.numero, e.id as estudiante_id, e.nombre, e.documento, e.celular, e.programa
        FROM numeros n
        INNER JOIN estudiantes e ON n.id = e.numero_id
        WHERE n.estado = 'ocupado'
    `);
    return rows;
}

// ========== REALIZAR SORTEO ==========
exports.realizarSorteo = async (req, res) => {
    try {
        // RN3.1: Verificar si ya hay un sorteo activo
        const sorteoActivo = await Sorteo.haySorteoActivo();
        if (sorteoActivo) {
            return res.status(400).json({
                error: 'RN3.1: La rifa ya finalizó. No se puede realizar otro sorteo.',
                ganador: sorteoActivo
            });
        }
        
        // Obtener números ocupados con estudiantes (incluyendo celular)
        const ocupados = await getNumerosOcupadosConEstudiantes();
        
        if (ocupados.length === 0) {
            return res.status(400).json({
                error: 'No hay números ocupados. Debe registrar al menos un estudiante primero.'
            });
        }
        
        // RF3.2: Generación aleatoria entre números ocupados
        const ganador = ocupados[Math.floor(Math.random() * ocupados.length)];
        
        // RF3.5: Guardar resultado en BD
        const sorteoId = await Sorteo.guardarResultado(ganador.numero, ganador.estudiante_id);
        
        // RF3.4: Retornar resultado para mostrar en frontend (con celular)
        res.json({
            success: true,
            sorteoId: sorteoId,
            mensaje: '🎉 ¡SORTEO REALIZADO! 🎉',
            ganador: {
                numero: ganador.numero,
                estudiante: ganador.nombre,
                documento: ganador.documento,
                celular: ganador.celular,
                programa: ganador.programa,
                fecha: new Date().toLocaleString()
            }
        });
        
    } catch (error) {
        console.error('Error en sorteo:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
};

// ========== VERIFICAR ESTADO DEL SORTEO ==========
exports.verificarSorteo = async (req, res) => {
    try {
        const sorteoActivo = await Sorteo.haySorteoActivo();
        res.json({
            sorteoRealizado: sorteoActivo !== null,
            ganador: sorteoActivo
        });
    } catch (error) {
        console.error('Error verificando sorteo:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========== OBTENER HISTORIAL DE SORTEOS ==========
exports.getHistorial = async (req, res) => {
    try {
        const historial = await Sorteo.getHistorial();
        res.json(historial);
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========== REINICIAR SISTEMA (CORREGIDO) ==========
exports.reiniciarSistema = async (req, res) => {
    const db = getDb();
    const connection = await db.getConnection();
    
    try {
        console.log('🔄 Iniciando reinicio del sistema...');
        
        await connection.beginTransaction();
        
        // 1. Desactivar sorteos existentes (si la tabla existe)
        try {
            await connection.query(`UPDATE sorteos SET activo = FALSE`);
            console.log('✅ Sorteos desactivados');
        } catch (err) {
            console.log('⚠️ No se pudo desactivar sorteos (tabla puede no existir):', err.message);
        }
        
        // 2. Eliminar estudiantes (limpiar para nueva rifa)
        await connection.query(`DELETE FROM estudiantes`);
        console.log('✅ Estudiantes eliminados');
        
        // 3. Desbloquear todos los números
        await connection.query(`UPDATE numeros SET estado = 'libre'`);
        console.log('✅ Números desbloqueados');
        
        await connection.commit();
        
        console.log('✅ Sistema reiniciado exitosamente');
        
        res.json({
            success: true,
            message: 'Sistema reiniciado exitosamente. Nueva rifa disponible.'
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('❌ Error reiniciando sistema:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor: ' + error.message 
        });
    } finally {
        connection.release();
    }
};