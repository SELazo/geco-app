const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { initStore } = require('../../../shared/inMemoryStore');

// Inicializar el store con datos por defecto si es necesario
const initializeService = async () => {
  try {
    await initStore();
    console.log('Communication Strategies API: Store inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el store:', error);
    // No detenemos la ejecución, pero registramos el error
  }
};

// Inicializar el store al cargar el módulo
initializeService();

const router = express.Router();

// Configuración de middleware
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Rutas de la API
router.use(routes);

// Middleware para manejo de errores
router.use((err, req, res, next) => {
  console.error('Error en Communication Strategies API:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

module.exports = router;
