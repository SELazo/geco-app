const express = require('express');
const router = express.Router();

// Array global para persistir publicidades en memoria durante la sesión del servidor
let adsDatabase = [
  {
    id: 1,
    title: 'Promoción Verano 2024',
    description: 'Descuentos especiales para la temporada de verano',
    imageUrl: '/assets/ad1.jpg',
    size: '1080x1080',
    status: 'active',
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Lanzamiento Nuevo Producto',
    description: 'Presentamos nuestro producto revolucionario',
    imageUrl: '/assets/ad2.jpg',
    size: '1200x628',
    status: 'draft',
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Oferta Especial Black Friday',
    description: 'No te pierdas nuestras ofertas exclusivas',
    imageUrl: '/assets/ad3.jpg',
    size: '1080x1920',
    status: 'active',
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString()
  }
];

// Ruta base para probar
router.get('/', (req, res) => {
  res.send('Ads API funcionando');
});

// Ruta para ping
router.get('/ping', (req, res) => {
  res.json({ message: 'pong', service: 'ads-api' });
});

// ===== RUTAS DE PUBLICIDADES =====

// GET /ads - Obtener lista de publicidades
router.get('/ads', (req, res) => {
  try {
    console.log('GET /ads - Devolviendo', adsDatabase.length, 'publicidades');
    // Devolver el array global directamente
    res.json(adsDatabase);
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /ads/:id - Obtener publicidad específica
router.get('/ads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const mockAd = {
      id: parseInt(id),
      title: `Publicidad ${id}`,
      description: `Descripción de la publicidad ${id}`,
      imageUrl: `/assets/ad${id}.jpg`,
      size: '1080x1080',
      status: 'active',
      targetAudience: 'General',
      budget: 500,
      impressions: Math.floor(Math.random() * 10000) + 1000,
      clicks: Math.floor(Math.random() * 500) + 50,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    res.json({ success: true, data: mockAd });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /ads - Crear nueva publicidad
router.post('/ads', (req, res) => {
  try {
    const { title, description, size, targetAudience, budget } = req.body;
    if (title && description) {
      const newAd = {
        id: Date.now(),
        title,
        description,
        size: size || '1080x1080',
        targetAudience: targetAudience || 'General',
        budget: budget || 0,
        status: 'draft',
        imageUrl: null,
        impressions: 0,
        clicks: 0,
        create_date: new Date().toISOString(),
        update_date: new Date().toISOString()
      };
      
      // Agregar la nueva publicidad al array global para persistencia
      adsDatabase.push(newAd);
      console.log('Nueva publicidad agregada. Total publicidades:', adsDatabase.length);
      
      res.json({ success: true, data: newAd, message: 'Publicidad creada exitosamente' });
    } else {
      res.status(400).json({ success: false, error: { message: 'Título y descripción son requeridos' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// PUT /ads/:id - Editar publicidad
router.put('/ads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, size, targetAudience, budget, status } = req.body;
    const updatedAd = {
      id: parseInt(id),
      title: title || `Publicidad ${id}`,
      description: description || `Descripción de la publicidad ${id}`,
      size: size || '1080x1080',
      targetAudience: targetAudience || 'General',
      budget: budget || 0,
      status: status || 'draft',
      updatedAt: new Date()
    };
    res.json({ success: true, data: updatedAd, message: 'Publicidad actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// DELETE /ads/:id - Eliminar publicidad
router.delete('/ads/:id', (req, res) => {
  try {
    const { id } = req.params;
    const adId = parseInt(id);
    
    // Buscar el índice de la publicidad a eliminar
    const adIndex = adsDatabase.findIndex(ad => ad.id === adId);
    
    if (adIndex !== -1) {
      // Eliminar la publicidad del array
      const deletedAd = adsDatabase.splice(adIndex, 1)[0];
      console.log(`Publicidad eliminada: ${deletedAd.title}. Total publicidades restantes:`, adsDatabase.length);
      res.json({ success: true, message: `Publicidad ${deletedAd.title} eliminada exitosamente` });
    } else {
      res.status(404).json({ success: false, error: { message: `Publicidad con ID ${id} no encontrada` } });
    }
  } catch (error) {
    console.error('Error al eliminar publicidad:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// ===== RUTAS DE IMÁGENES =====

// POST /ads/:id/upload-image-chunk - Subir imagen por chunks
router.post('/ads/:id/upload-image-chunk', (req, res) => {
  try {
    const { id } = req.params;
    const { chunkIndex, totalChunks, fileName } = req.body;
    
    // Simular subida de chunk
    const chunkInfo = {
      adId: parseInt(id),
      chunkIndex: parseInt(chunkIndex) || 0,
      totalChunks: parseInt(totalChunks) || 1,
      fileName: fileName || 'image.jpg',
      uploadedAt: new Date()
    };
    
    // Simular que es el último chunk
    if (chunkIndex === totalChunks - 1) {
      res.json({ 
        success: true, 
        data: chunkInfo,
        message: 'Imagen subida completamente',
        imageUrl: `/assets/ads/${id}/${fileName}`,
        completed: true
      });
    } else {
      res.json({ 
        success: true, 
        data: chunkInfo,
        message: `Chunk ${chunkIndex + 1}/${totalChunks} subido exitosamente`,
        completed: false
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /ads/:id/image - Obtener imagen de publicidad
router.get('/ads/:id/image', (req, res) => {
  try {
    const { id } = req.params;
    // Simular respuesta de imagen
    const imageInfo = {
      adId: parseInt(id),
      imageUrl: `/assets/ads/${id}/image.jpg`,
      fileName: 'image.jpg',
      size: '1080x1080',
      fileSize: '245KB',
      uploadedAt: new Date()
    };
    res.json({ success: true, data: imageInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

module.exports = router;
