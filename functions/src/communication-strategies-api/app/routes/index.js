const express = require('express');
const router = express.Router();

// Array global para persistir estrategias en memoria durante la sesión del servidor
let strategiesDatabase = [
  {
    id: 1,
    name: 'Campaña Verano 2024',
    description: 'Estrategia de marketing para la temporada de verano',
    status: 'active',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-03-31'),
    targetGroups: ['Clientes VIP', 'Prospectos'],
    ads: ['Promoción Verano 2024', 'Descuentos Especiales'],
    frequency: 'weekly',
    totalSent: 1250,
    openRate: 23.5,
    clickRate: 8.2,
    create_date: new Date('2024-11-15').toISOString(),
    update_date: new Date('2024-11-20').toISOString()
  },
  {
    id: 2,
    name: 'Lanzamiento Producto X',
    description: 'Campaña de lanzamiento del nuevo producto',
    status: 'draft',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
    targetGroups: ['Early Adopters', 'Influencers'],
    ads: ['Teaser Producto X', 'Demo Interactiva'],
    frequency: 'daily',
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    create_date: new Date('2024-01-10').toISOString(),
    update_date: new Date('2024-01-15').toISOString()
  },
  {
    id: 3,
    name: 'Black Friday 2024',
    description: 'Estrategia especial para Black Friday',
    status: 'scheduled',
    startDate: new Date('2024-11-25'),
    endDate: new Date('2024-11-29'),
    targetGroups: ['Todos los clientes', 'Lista de espera'],
    ads: ['Ofertas Black Friday', 'Descuentos Limitados'],
    frequency: 'hourly',
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    create_date: new Date('2024-10-01').toISOString(),
    update_date: new Date('2024-10-15').toISOString()
  }
];

// Ruta base para probar
router.get('/', (req, res) => {
  res.send('Communication Strategies API funcionando');
});

// Ruta para ping
router.get('/ping', (req, res) => {
  res.json({ message: 'pong', service: 'communication-strategies-api' });
});

// ===== RUTAS DE ESTRATEGIAS DE COMUNICACIÓN =====

// GET /strategies - Obtener lista de estrategias
router.get('/strategies', (req, res) => {
  try {
    console.log('GET /strategies - Devolviendo', strategiesDatabase.length, 'estrategias');
    // Devolver el array global directamente
    res.json(strategiesDatabase);
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /strategies/:id - Obtener estrategia específica
router.get('/strategies/:id', (req, res) => {
  try {
    const { id } = req.params;
    const mockStrategy = {
      id: parseInt(id),
      name: `Estrategia ${id}`,
      description: `Descripción de la estrategia ${id}`,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días después
      targetGroups: ['Grupo 1', 'Grupo 2'],
      ads: [`Publicidad ${id}`],
      frequency: 'weekly',
      schedule: {
        days: ['monday', 'wednesday', 'friday'],
        time: '10:00',
        timezone: 'America/Argentina/Buenos_Aires'
      },
      analytics: {
        totalSent: Math.floor(Math.random() * 2000) + 500,
        delivered: Math.floor(Math.random() * 1800) + 450,
        opened: Math.floor(Math.random() * 1200) + 300,
        clicked: Math.floor(Math.random() * 200) + 50,
        openRate: (Math.random() * 30 + 40).toFixed(1), // 40-70%
        clickRate: (Math.random() * 10 + 5).toFixed(1)   // 5-15%
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    res.json({ success: true, data: mockStrategy });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /strategies - Crear nueva estrategia
router.post('/strategies', (req, res) => {
  try {
    console.log('POST /strategies - Request body:', req.body); // Debug log
    const { name, start_date, end_date, periodicity, schedule, ads, groups } = req.body;
    if (name && ads && groups) {
      const newStrategy = {
        id: Date.now(),
        name,
        description: `Estrategia de comunicación: ${name}`,
        targetGroups: Array.isArray(groups) ? groups : [groups],
        ads: Array.isArray(ads) ? ads : [ads],
        frequency: periodicity || 'weekly',
        startDate: start_date ? new Date(start_date) : new Date(),
        endDate: end_date ? new Date(end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        schedule: schedule || {
          days: ['monday', 'wednesday', 'friday'],
          time: '10:00',
          timezone: 'America/Argentina/Buenos_Aires'
        },
        status: 'draft',
        totalSent: 0,
        openRate: 0,
        clickRate: 0,
        create_date: new Date().toISOString(),
        update_date: new Date().toISOString()
      };
      
      // Agregar la nueva estrategia al array global para persistencia
      strategiesDatabase.push(newStrategy);
      console.log('Nueva estrategia agregada. Total estrategias:', strategiesDatabase.length);
      
      res.json({ success: true, data: newStrategy, message: 'Estrategia creada exitosamente' });
    } else {
      res.status(400).json({ 
        success: false, 
        error: { message: 'Nombre, publicidades y grupos son requeridos' } 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// PUT /strategies/:id - Editar estrategia
router.put('/strategies/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, targetGroups, ads, frequency, startDate, endDate, schedule, status } = req.body;
    const updatedStrategy = {
      id: parseInt(id),
      name: name || `Estrategia ${id}`,
      description: description || `Descripción de la estrategia ${id}`,
      targetGroups: targetGroups || ['Grupo 1'],
      ads: ads || [`Publicidad ${id}`],
      frequency: frequency || 'weekly',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      schedule: schedule || {
        days: ['monday', 'wednesday', 'friday'],
        time: '10:00',
        timezone: 'America/Argentina/Buenos_Aires'
      },
      status: status || 'draft',
      updatedAt: new Date()
    };
    res.json({ success: true, data: updatedStrategy, message: 'Estrategia actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// DELETE /strategies/:id - Eliminar estrategia
router.delete('/strategies/:id', (req, res) => {
  try {
    const { id } = req.params;
    const strategyId = parseInt(id);
    
    // Buscar el índice de la estrategia a eliminar
    const strategyIndex = strategiesDatabase.findIndex(strategy => strategy.id === strategyId);
    
    if (strategyIndex !== -1) {
      // Eliminar la estrategia del array
      const deletedStrategy = strategiesDatabase.splice(strategyIndex, 1)[0];
      console.log(`Estrategia eliminada: ${deletedStrategy.name}. Total estrategias restantes:`, strategiesDatabase.length);
      res.json({ success: true, message: `Estrategia ${deletedStrategy.name} eliminada exitosamente` });
    } else {
      res.status(404).json({ success: false, error: { message: `Estrategia con ID ${id} no encontrada` } });
    }
  } catch (error) {
    console.error('Error al eliminar estrategia:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /strategies/:id/send - Enviar estrategia
router.post('/strategies/:id/send', (req, res) => {
  try {
    const { id } = req.params;
    const { immediate, testMode } = req.body;
    
    const sendResult = {
      strategyId: parseInt(id),
      status: immediate ? 'sent' : 'scheduled',
      testMode: testMode || false,
      sentAt: immediate ? new Date() : null,
      scheduledFor: immediate ? null : new Date(Date.now() + 60 * 60 * 1000), // 1 hora después
      recipients: testMode ? 1 : Math.floor(Math.random() * 500) + 100,
      estimatedDelivery: new Date(Date.now() + (immediate ? 5 : 65) * 60 * 1000)
    };
    
    if (immediate) {
      res.json({ 
        success: true, 
        data: sendResult,
        message: testMode ? 'Estrategia enviada en modo prueba' : `Estrategia enviada a ${sendResult.recipients} contactos`
      });
    } else {
      res.json({ 
        success: true, 
        data: sendResult,
        message: `Estrategia programada para ${sendResult.scheduledFor.toLocaleString()}`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /strategies/:id/analytics - Obtener analíticas de estrategia
router.get('/strategies/:id/analytics', (req, res) => {
  try {
    const { id } = req.params;
    const mockAnalytics = {
      strategyId: parseInt(id),
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      },
      summary: {
        totalSent: Math.floor(Math.random() * 2000) + 500,
        delivered: Math.floor(Math.random() * 1800) + 450,
        opened: Math.floor(Math.random() * 1200) + 300,
        clicked: Math.floor(Math.random() * 200) + 50,
        bounced: Math.floor(Math.random() * 50) + 10,
        unsubscribed: Math.floor(Math.random() * 20) + 2
      },
      rates: {
        deliveryRate: (Math.random() * 5 + 93).toFixed(1),  // 93-98%
        openRate: (Math.random() * 30 + 40).toFixed(1),     // 40-70%
        clickRate: (Math.random() * 10 + 5).toFixed(1),     // 5-15%
        bounceRate: (Math.random() * 3 + 1).toFixed(1),     // 1-4%
        unsubscribeRate: (Math.random() * 1 + 0.5).toFixed(1) // 0.5-1.5%
      },
      timeline: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        sent: Math.floor(Math.random() * 100) + 50,
        opened: Math.floor(Math.random() * 60) + 20,
        clicked: Math.floor(Math.random() * 15) + 5
      })),
      topPerformingAds: [
        { adId: 1, title: 'Promoción Especial', openRate: 72.5, clickRate: 15.2 },
        { adId: 2, title: 'Nuevo Producto', openRate: 68.3, clickRate: 12.8 },
        { adId: 3, title: 'Descuento Limitado', openRate: 65.1, clickRate: 11.4 }
      ]
    };
    res.json({ success: true, data: mockAnalytics });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

module.exports = router;
