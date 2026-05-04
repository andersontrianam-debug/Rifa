# 🎲 Sistema de Rifa Académica

Sistema completo para gestionar rifas académicas con **100 números (00 al 99)**, registro de estudiantes, reportes exportables y sorteo aleatorio.

Desarrollado por **TriRoa Dev Solutions** como proyecto para la materia Calidad de Software.

---

## 📋 Características

### Para Estudiantes
- ✅ Visualizar panel de números 10×10
- ✅ Identificar números disponibles (verdes) y ocupados (rojos)
- ✅ Seleccionar un número libre
- ✅ Registrarse con nombre, documento, programa y celular
- ✅ Recibir confirmación de registro

### Para Administradores
- ✅ Panel de números (solo visualización)
- ✅ Reporte de números libres
- ✅ Reporte de números ocupados con datos de estudiantes
- ✅ Exportación a **CSV** y **PDF**
- ✅ Generar sorteo aleatorio
- ✅ Historial de sorteos
- ✅ Reiniciar sistema para nueva rifa

### Reglas de Negocio
- ✅ Rango estricto: solo números 00-99
- ✅ Unicidad: un número = un estudiante
- ✅ Sorteo único: no se puede repetir sin reiniciar

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **Node.js** | Backend / Servidor |
| **Express** | API REST |
| **MySQL** | Base de datos relacional |
| **HTML5/CSS3** | Frontend / Interfaz de usuario |
| **JavaScript** | Lógica del cliente |

---

## 🚀 Instalación y configuración

### Requisitos previos
- Node.js (v14 o superior)
- MySQL Workbench (o cualquier cliente MySQL)
- Navegador web moderno

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/andersontrianam-debug/Rifa.git
cd Rifa


Paso 2: Instalar dependencias
bash
npm install

Paso 3: Configurar base de datos
Abre MySQL Workbench

Ejecuta el siguiente script SQL:

CREATE DATABASE IF NOT EXISTS rifa_db;
USE rifa_db;

CREATE TABLE numeros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero CHAR(2) NOT NULL UNIQUE,
    estado ENUM('libre', 'ocupado') DEFAULT 'libre',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    programa VARCHAR(50) NOT NULL,
    celular VARCHAR(15) NOT NULL,
    numero_id INT UNIQUE,
    registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (numero_id) REFERENCES numeros(id)
);

CREATE TABLE sorteos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_ganador CHAR(2) NOT NULL,
    estudiante_id INT NOT NULL,
    fecha_sorteo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
);

-- Insertar números 00-99
INSERT INTO numeros (numero) VALUES
('00'),('01'),('02'),('03'),('04'),('05'),('06'),('07'),('08'),('09'),
('10'),('11'),('12'),('13'),('14'),('15'),('16'),('17'),('18'),('19'),
('20'),('21'),('22'),('23'),('24'),('25'),('26'),('27'),('28'),('29'),
('30'),('31'),('32'),('33'),('34'),('35'),('36'),('37'),('38'),('39'),
('40'),('41'),('42'),('43'),('44'),('45'),('46'),('47'),('48'),('49'),
('50'),('51'),('52'),('53'),('54'),('55'),('56'),('57'),('58'),('59'),
('60'),('61'),('62'),('63'),('64'),('65'),('66'),('67'),('68'),('69'),
('70'),('71'),('72'),('73'),('74'),('75'),('76'),('77'),('78'),('79'),
('80'),('81'),('82'),('83'),('84'),('85'),('86'),('87'),('88'),('89'),
('90'),('91'),('92'),('93'),('94'),('95'),('96'),('97'),('98'),('99');

Paso 4: Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=rifa_db
DB_PORT=3306
PORT=3000

Paso 5: Iniciar el servidor

node backend/server.js

Paso 6: Abrir el sistema
Abre tu navegador en: http://localhost:3000
