const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { strategiesRepo } = require('../../../shared/inMemoryStore');

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
router.get('/strategies', async (req, res) => {
  try {
    const strategies = await strategiesRepo.list();
    console.log('GET /strategies - Devolviendo', strategies.length, 'estrategias');
    res.json({ success: true, data: strategies });
  } catch (error) {
    console.error('Error en GET /strategies:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al obtener las estrategias' } 
    });
  }
});

// GET /strategies/:id - Obtener estrategia específica
router.get('/strategies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const strategy = await strategiesRepo.getById(id);
    
    if (!strategy) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Estrategia con ID ${id} no encontrada` } 
      });
    }
    
    res.json({ success: true, data: strategy });
  } catch (error) {
    console.error('Error en GET /strategies/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al obtener la estrategia' } 
    });
  }
});

// POST /strategies - Crear nueva estrategia
router.post('/strategies', async (req, res) => {
  try {
    console.log('POST /strategies - Request body:', req.body);
    const { name, start_date, end_date, periodicity, schedule, ads, groups, description, status } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: { message: 'El nombre de la estrategia es requerido' }
      });
    }
    
    if (!ads || (Array.isArray(ads) && ads.length === 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe incluir al menos una publicidad' }
      });
    }
    
    if (!groups || (Array.isArray(groups) && groups.length === 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe incluir al menos un grupo objetivo' }
      });
    }
    
    const newStrategy = {
      id: uuidv4(),
      name,
      description: description || `Estrategia de comunicación: ${name}`,
      targetGroups: Array.isArray(groups) ? groups : [groups],
      ads: Array.isArray(ads) ? ads : [ads],
      frequency: periodicity || 'weekly',
      startDate: start_date ? new Date(start_date).toISOString() : new Date().toISOString(),
      endDate: end_date ? new Date(end_date).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      schedule: schedule || {
        days: ['monday', 'wednesday', 'friday'],
        time: '10:00',
        timezone: 'America/Argentina/Buenos_Aires'
      },
      status: status || 'draft',
      totalSent: 0,
      openRate: 0,
      clickRate: 0,
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString()
    };
    
    const createdStrategy = await strategiesRepo.create(newStrategy);
    console.log('Nueva estrategia creada con ID:', createdStrategy.id);
    
    res.status(201).json({ 
      success: true, 
      data: createdStrategy, 
      message: 'Estrategia creada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error en POST /strategies:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al crear la estrategia' } 
    });
  }
});

// PUT /strategies/:id - Editar estrategia
router.put('/strategies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, targetGroups, ads, frequency, startDate, endDate, schedule, status } = req.body;
    
    // Verificar si la estrategia existe
    const existingStrategy = await strategiesRepo.getById(id);
    if (!existingStrategy) {
      return res.status(404).json({
        success: false,
        error: { message: `Estrategia con ID ${id} no encontrada` }
      });
    }
    
    // Validaciones básicas
    if (name && typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'El nombre debe ser una cadena de texto' }
      });
    }
    
    // Preparar los datos actualizados
    const updates = {
      ...existingStrategy,
      name: name || existingStrategy.name,
      description: description !== undefined ? description : existingStrategy.description,
      targetGroups: targetGroups || existingStrategy.targetGroups,
      ads: ads || existingStrategy.ads,
      frequency: frequency || existingStrategy.frequency,
      startDate: startDate ? new Date(startDate).toISOString() : existingStrategy.startDate,
      endDate: endDate ? new Date(endDate).toISOString() : existingStrategy.endDate,
      schedule: schedule || existingStrategy.schedule,
      status: status || existingStrategy.status,
      update_date: new Date().toISOString()
    };
    
    // Actualizar la estrategia
    const updatedStrategy = await strategiesRepo.update(id, updates);
    
    res.json({ 
      success: true, 
      data: updatedStrategy, 
      message: 'Estrategia actualizada exitosamente' 
    });
    
  } catch (error) {
    console.error('Error en PUT /strategies/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al actualizar la estrategia' } 
    });
  }
});

// DELETE /strategies/:id - Eliminar estrategia
router.delete('/strategies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la estrategia existe
    const strategy = await strategiesRepo.getById(id);
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: { message: `Estrategia con ID ${id} no encontrada` }
      });
    }
    
    // Eliminar la estrategia
    await strategiesRepo.delete(id);
    console.log(`Estrategia eliminada: ${strategy.name}`);
    
    res.json({ 
      success: true, 
      message: `Estrategia "${strategy.name}" eliminada exitosamente` 
    });
    
  } catch (error) {
    console.error('Error en DELETE /strategies/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al eliminar la estrategia' } 
    });
  }
});

// POST /strategies/:id/send - Enviar estrategia
router.post('/strategies/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { immediate = false, testMode = false } = req.body;
    
    // Verificar si la estrategia existe
    const strategy = await strategiesRepo.getById(id);
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: { message: `Estrategia con ID ${id} no encontrada` }
      });
    }
    
    // Verificar que la estrategia esté en un estado válido para enviar
    if (strategy.status === 'sent' || strategy.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: { 
          message: `No se puede enviar una estrategia con estado "${strategy.status}"` 
        }
      });
    }
    
    // Actualizar el estado de la estrategia
    const updates = {
      ...strategy,
      status: immediate ? 'sent' : 'scheduled',
      sendDate: immediate ? new Date().toISOString() : null,
      scheduledFor: immediate ? null : new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora después
      update_date: new Date().toISOString()
    };
    
    await strategiesRepo.update(id, updates);
    
    // Simular envío (en un entorno real, aquí se integraría con un servicio de envío)
    const sendResult = {
      strategyId: id,
      status: immediate ? 'sent' : 'scheduled',
      testMode,
      sentAt: immediate ? new Date().toISOString() : null,
      scheduledFor: immediate ? null : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      recipients: testMode ? 1 : Math.floor(Math.random() * 500) + 100,
      estimatedDelivery: immediate 
        ? new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutos después
        : new Date(Date.now() + 65 * 60 * 1000).toISOString() // 1 hora y 5 minutos después
    };
    
    const message = testMode 
      ? 'Estrategia enviada en modo prueba' 
      : immediate 
        ? `Estrategia enviada a ${sendResult.recipients} contactos`
        : `Estrategia programada para ${new Date(sendResult.scheduledFor).toLocaleString()}`;
    
    res.json({ 
      success: true, 
      data: sendResult,
      message
    });
    
  } catch (error) {
    console.error('Error en POST /strategies/:id/send:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al enviar la estrategia' } 
    });
  }
});

// GET /strategies/:id/analytics - Obtener analíticas de estrategia
router.get('/strategies/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la estrategia existe
    const strategy = await strategiesRepo.getById(id);
    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: { message: `Estrategia con ID ${id} no encontrada` }
      });
    }
    
    // Generar datos de analíticas simuladas
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Si la estrategia no ha sido enviada, no hay analíticas
    if (strategy.status === 'draft' || !strategy.sendDate) {
      return res.json({
        success: true,
        data: {
          strategyId: id,
          period: {
            startDate: null,
            endDate: null
          },
          summary: {
            totalSent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            unsubscribed: 0
          },
          rates: {
            deliveryRate: 0,
            openRate: 0,
            clickRate: 0,
            bounceRate: 0,
            unsubscribeRate: 0
          },
          timeline: [],
          topPerformingAds: []
        }
      });
    }
    
    // Generar datos simulados pero consistentes basados en el ID de la estrategia
    // para que sean los mismos en cada solicitud para la misma estrategia
    const seed = parseInt(id.replace(/[^0-9]/g, '')) || 0;
    const random = (min, max) => {
      const num = Math.sin(seed + 1) * 10000;
      return Math.floor((num - Math.floor(num)) * (max - min + 1)) + min;
    };
    
    const totalSent = random(500, 2500);
    const delivered = Math.floor(totalSent * (0.93 + random(0, 5) / 100)); // 93-98%
    const opened = Math.floor(delivered * (0.4 + random(0, 30) / 100)); // 40-70%
    const clicked = Math.floor(opened * (0.05 + random(0, 10) / 100)); // 5-15%
    const bounced = Math.floor(totalSent * (0.01 + random(0, 3) / 100)); // 1-4%
    const unsubscribed = Math.floor(opened * (0.005 + random(0, 1) / 100)); // 0.5-1.5%
    
    // Generar timeline de los últimos 7 días
    const timeline = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - i));
      
      const daySent = Math.floor((totalSent / 7) * (0.8 + Math.random() * 0.4));
      const dayDelivered = Math.floor(daySent * (0.93 + Math.random() * 0.05));
      const dayOpened = Math.floor(dayDelivered * (0.4 + Math.random() * 0.3));
      const dayClicked = Math.floor(dayOpened * (0.05 + Math.random() * 0.1));
      
      return {
        date: date.toISOString().split('T')[0],
        sent: daySent,
        delivered: dayDelivered,
        opened: dayOpened,
        clicked: dayClicked
      };
    });
    
    // Generar datos de publicidades
    const adTitles = [
      'Promoción Especial',
      'Nuevo Producto',
      'Descuento Limitado',
      'Oferta Exclusiva',
      'Lanzamiento',
      'Invitación Especial'
    ];
    
    const topPerformingAds = adTitles.slice(0, 3).map((title, index) => ({
      adId: index + 1,
      title,
      openRate: 60 + random(0, 25), // 60-85%
      clickRate: 5 + random(0, 15)   // 5-20%
    }));
    
    // Ordenar por mejor rendimiento (openRate * clickRate)
    topPerformingAds.sort((a, b) => (b.openRate * b.clickRate) - (a.openRate * a.clickRate));
    
    const analyticsData = {
      strategyId: id,
      period: {
        startDate: thirtyDaysAgo.toISOString(),
        endDate: now.toISOString()
      },
      summary: {
        totalSent,
        delivered,
        opened,
        clicked,
        bounced,
        unsubscribed
      },
      rates: {
        deliveryRate: ((delivered / totalSent) * 100).toFixed(1),
        openRate: ((opened / delivered) * 100).toFixed(1),
        clickRate: ((clicked / opened) * 100).toFixed(1),
        bounceRate: ((bounced / totalSent) * 100).toFixed(1),
        unsubscribeRate: ((unsubscribed / opened) * 100).toFixed(1)
      },
      timeline,
      topPerformingAds
    };
    
    res.json({ success: true, data: analyticsData });
    
  } catch (error) {
    console.error('Error en GET /strategies/:id/analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor al obtener las analíticas' } 
    });
  }
});

module.exports = router;
