const express = require('express');
const router = express.Router();
const { adsRepo } = require('../../../shared/inMemoryStore');

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
router.get('/ads', async (req, res) => {
  try {
    const ads = await adsRepo.list();
    console.log('GET /ads - Devolviendo', ads.length, 'publicidades');
    res.json(ads);
  } catch (error) {
    console.error('Error en GET /ads:', error);
    res.status(500).json({ success: false, error: { message: 'Error al obtener las publicidades' } });
  }
});

// GET /ads/:id - Obtener publicidad específica
router.get('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await adsRepo.getById(id);
    
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Publicidad con ID ${id} no encontrada` } 
      });
    }
    
    res.json({ success: true, data: ad });
  } catch (error) {
    console.error(`Error en GET /ads/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al obtener la publicidad' } 
    });
  }
});

// POST /ads - Crear nueva publicidad
router.post('/ads', async (req, res) => {
  try {
    const { title, description, size, targetAudience, budget } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Título y descripción son requeridos' } 
      });
    }
    
    // Verificar si ya existe una publicidad con el mismo título
    const existingAd = await adsRepo.findOne({ title });
    if (existingAd) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Ya existe una publicidad con este título' } 
      });
    }
    
    const newAd = await adsRepo.create({
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
    });
    
    console.log('Nueva publicidad creada con ID:', newAd.id);
    
    res.status(201).json({ 
      success: true, 
      data: newAd, 
      message: 'Publicidad creada exitosamente' 
    });
  } catch (error) {
    console.error('Error en POST /ads:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al crear la publicidad' } 
    });
  }
});

// PUT /ads/:id - Editar publicidad
router.put('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, size, targetAudience, budget, status, imageUrl } = req.body;
    
    // Verificar si la publicidad existe
    const existingAd = await adsRepo.getById(id);
    if (!existingAd) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Publicidad con ID ${id} no encontrada` } 
      });
    }
    
    // Verificar si ya existe otra publicidad con el mismo título
    if (title && title !== existingAd.title) {
      const adWithSameTitle = await adsRepo.findOne({ title });
      if (adWithSameTitle && adWithSameTitle.id !== id) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Ya existe una publicidad con este título' } 
        });
      }
    }
    
    // Actualizar solo los campos proporcionados
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (size !== undefined) updateData.size = size;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (budget !== undefined) updateData.budget = budget;
    if (status !== undefined) updateData.status = status;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    
    // Actualizar la fecha de modificación
    updateData.update_date = new Date().toISOString();
    
    const updatedAd = await adsRepo.update(id, updateData);
    
    if (!updatedAd) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al actualizar la publicidad' } 
      });
    }
    
    res.json({ 
      success: true, 
      data: updatedAd, 
      message: 'Publicidad actualizada exitosamente' 
    });
  } catch (error) {
    console.error(`Error en PUT /ads/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al actualizar la publicidad' } 
    });
  }
});

// DELETE /ads/:id - Eliminar publicidad
router.delete('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la publicidad existe
    const ad = await adsRepo.getById(id);
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Publicidad con ID ${id} no encontrada` } 
      });
    }
    
    // Eliminar la publicidad
    const success = await adsRepo.delete(id);
    
    if (!success) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al eliminar la publicidad' } 
      });
    }
    
    console.log(`Publicidad eliminada: ${ad.title}`);
    res.json({ 
      success: true, 
      message: `Publicidad "${ad.title}" eliminada exitosamente` 
    });
  } catch (error) {
    console.error(`Error en DELETE /ads/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al eliminar la publicidad' } 
    });
  }
});

// ===== RUTAS DE IMÁGENES =====

// POST /ads/:id/upload-image-chunk - Subir imagen por chunks
router.post('/ads/:id/upload-image-chunk', async (req, res) => {
  try {
    const { id } = req.params;
    const { chunkIndex, totalChunks, fileName } = req.body;
    
    // Verificar si la publicidad existe
    const ad = await adsRepo.getById(id);
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Publicidad con ID ${id} no encontrada` } 
      });
    }
    
    // Simular subida de chunk
    const chunkInfo = {
      adId: id,
      chunkIndex: parseInt(chunkIndex) || 0,
      totalChunks: parseInt(totalChunks) || 1,
      fileName: fileName || 'image.jpg',
      uploadedAt: new Date()
    };
    
    // Simular que es el último chunk
    if (chunkIndex === totalChunks - 1) {
      // Actualizar la URL de la imagen en la publicidad
      const imageUrl = `/assets/ads/${id}/${fileName || 'image.jpg'}`;
      await adsRepo.update(id, { 
        imageUrl,
        update_date: new Date().toISOString() 
      });
      
      res.json({ 
        success: true, 
        data: { ...chunkInfo, imageUrl },
        message: 'Imagen subida completamente',
        completed: true
      });
    } else {
      res.json({ 
        success: true, 
        data: chunkInfo,
        message: `Chunk ${parseInt(chunkIndex) + 1}/${parseInt(totalChunks) || 1} subido exitosamente`,
        completed: false
      });
    }
  } catch (error) {
    console.error('Error en POST /ads/:id/upload-image-chunk:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al subir el chunk de la imagen' } 
    });
  }
});

// GET /ads/:id/image - Obtener imagen de publicidad
router.get('/ads/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener la publicidad
    const ad = await adsRepo.getById(id);
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Publicidad con ID ${id} no encontrada` } 
      });
    }
    
    if (!ad.imageUrl) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Esta publicidad no tiene una imagen asociada' } 
      });
    }
    
    // Simular información de la imagen
    const imageInfo = {
      adId: id,
      imageUrl: ad.imageUrl,
      fileName: ad.imageUrl.split('/').pop() || 'image.jpg',
      size: ad.size || '1080x1080',
      fileSize: '245KB',
      uploadedAt: ad.update_date || new Date().toISOString()
    };
    
    res.json({ success: true, data: imageInfo });
  } catch (error) {
    console.error(`Error en GET /ads/${req.params.id}/image:`, error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al obtener la imagen de la publicidad' } 
    });
  }
});

module.exports = router;
