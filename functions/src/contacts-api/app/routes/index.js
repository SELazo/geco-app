const express = require('express');
const router = express.Router();
const { contactsRepo, groupsRepo } = require('../../../shared/inMemoryStore');

// Ruta base para probar
router.get('/', (req, res) => {
  res.send('Contacts API funcionando');
});

// Ruta para ping
router.get('/ping', (req, res) => {
  res.json({ message: 'pong', service: 'contacts-api' });
});

// ===== RUTAS DE CONTACTOS =====

// GET /contacts - Obtener lista de contactos
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await contactsRepo.list();
    console.log('GET /contacts - Devolviendo', contacts.length, 'contactos');
    res.json(contacts);
  } catch (error) {
    console.error('Error en GET /contacts:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /contacts/:id - Obtener contacto específico
router.get('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsRepo.getById(id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Contacto con ID ${id} no encontrado` } 
      });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error en GET /contacts/:id:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /directories/contacts - Crear nuevo contacto
router.post('/directories/contacts', async (req, res) => {
  try {
    const { name, email, phone, groupId } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Nombre y email son requeridos' } 
      });
    }
    
    // Verificar si el grupo existe si se proporciona groupId
    if (groupId) {
      const group = await groupsRepo.getById(groupId);
      if (!group) {
        return res.status(400).json({ 
          success: false, 
          error: { message: `El grupo con ID ${groupId} no existe` } 
        });
      }
    }
    
    const newContact = await contactsRepo.create({
      name,
      email,
      phone: phone || '',
      groupId: groupId || null
    });
    
    console.log('Nuevo contacto creado con ID:', newContact.id);
    res.status(201).json({ 
      success: true, 
      data: newContact, 
      message: 'Contacto creado exitosamente' 
    });
  } catch (error) {
    console.error('Error en POST /directories/contacts:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al crear el contacto' } 
    });
  }
});

// PUT /contacts/:id - Editar contacto
router.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, groupId } = req.body;
    
    // Verificar si el contacto existe
    const existingContact = await contactsRepo.getById(id);
    if (!existingContact) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Contacto con ID ${id} no encontrado` } 
      });
    }
    
    // Verificar si el grupo existe si se proporciona groupId
    if (groupId) {
      const group = await groupsRepo.getById(groupId);
      if (!group) {
        return res.status(400).json({ 
          success: false, 
          error: { message: `El grupo con ID ${groupId} no existe` } 
        });
      }
    }
    
    // Actualizar solo los campos proporcionados
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (groupId !== undefined) updateData.groupId = groupId;
    
    const updatedContact = await contactsRepo.update(id, updateData);
    
    if (!updatedContact) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al actualizar el contacto' } 
      });
    }
    
    res.json({ 
      success: true, 
      data: updatedContact, 
      message: 'Contacto actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error en PUT /contacts/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al actualizar el contacto' } 
    });
  }
});

// DELETE /contacts/:id - Eliminar contacto
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el contacto existe
    const contact = await contactsRepo.getById(id);
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Contacto con ID ${id} no encontrado` } 
      });
    }
    
    const success = await contactsRepo.delete(id);
    
    if (!success) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al eliminar el contacto' } 
      });
    }
    
    console.log(`Contacto eliminado: ${contact.name}`);
    res.json({ 
      success: true, 
      message: `Contacto "${contact.name}" eliminado exitosamente` 
    });
  } catch (error) {
    console.error('Error en DELETE /contacts/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al eliminar el contacto' } 
    });
  }
});

// ===== RUTAS DE GRUPOS =====

// GET /groups - Obtener lista de grupos
router.get('/groups', async (req, res) => {
  try {
    const groups = await groupsRepo.list();
    console.log('GET /groups - Devolviendo', groups.length, 'grupos');
    res.json(groups);
  } catch (error) {
    console.error('Error en GET /groups:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /groups/:id - Obtener grupo específico con sus contactos
router.get('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const group = await groupsRepo.getById(id);
    
    if (!group) {
      console.log(`GET /groups/${id} - Grupo no encontrado`);
      return res.status(404).json({ 
        success: false, 
        error: { message: `Grupo con ID ${id} no encontrado` } 
      });
    }
    
    // Obtener contactos de este grupo
    const contacts = await contactsRepo.list({ groupId: id });
    
    // Crear respuesta con grupo y sus contactos
    const groupWithContacts = {
      ...group,
      contacts: contacts || [],
      contactCount: contacts.length
    };
    
    console.log(`GET /groups/${id} - Grupo encontrado:`, group.name);
    res.json({ success: true, data: groupWithContacts });
  } catch (error) {
    console.error(`Error en GET /groups/${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error interno del servidor' } 
    });
  }
});

// POST /directories/groups - Crear nuevo grupo
router.post('/directories/groups', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Nombre del grupo es requerido' } 
      });
    }
    
    // Verificar si ya existe un grupo con el mismo nombre
    const existingGroup = await groupsRepo.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Ya existe un grupo con este nombre' } 
      });
    }
    
    const newGroup = await groupsRepo.create({
      name,
      description: description || '',
      contactCount: 0
    });
    
    console.log('Nuevo grupo creado con ID:', newGroup.id);
    res.status(201).json({ 
      success: true, 
      data: newGroup, 
      message: 'Grupo creado exitosamente' 
    });
  } catch (error) {
    console.error('Error en POST /directories/groups:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al crear el grupo' } 
    });
  }
});

// PUT /groups/:id - Editar grupo
router.put('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Verificar si el grupo existe
    const existingGroup = await groupsRepo.getById(id);
    if (!existingGroup) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Grupo con ID ${id} no encontrado` } 
      });
    }
    
    // Verificar si ya existe otro grupo con el mismo nombre
    if (name && name !== existingGroup.name) {
      const groupWithSameName = await groupsRepo.findOne({ name });
      if (groupWithSameName && groupWithSameName.id !== id) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Ya existe otro grupo con este nombre' } 
        });
      }
    }
    
    // Actualizar solo los campos proporcionados
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    
    const updatedGroup = await groupsRepo.update(id, updateData);
    
    if (!updatedGroup) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al actualizar el grupo' } 
      });
    }
    
    // Obtener la cuenta actualizada de contactos
    const contacts = await contactsRepo.list({ groupId: id });
    updatedGroup.contactCount = contacts.length;
    
    res.json({ 
      success: true, 
      data: updatedGroup, 
      message: 'Grupo actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error en PUT /groups/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al actualizar el grupo' } 
    });
  }
});

// DELETE /groups/:id - Eliminar grupo
router.delete('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el grupo existe
    const group = await groupsRepo.getById(id);
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        error: { message: `Grupo con ID ${id} no encontrado` } 
      });
    }
    
    // Obtener contactos que pertenecen a este grupo
    const contactsInGroup = await contactsRepo.list({ groupId: id });
    
    // Actualizar contactos para eliminar la referencia al grupo
    await Promise.all(
      contactsInGroup.map(contact => 
        contactsRepo.update(contact.id, { groupId: null })
      )
    );
    
    // Eliminar el grupo
    const success = await groupsRepo.delete(id);
    
    if (!success) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al eliminar el grupo' } 
      });
    }
    
    console.log(`Grupo eliminado: ${group.name}`);
    res.json({ 
      success: true, 
      message: `Grupo "${group.name}" eliminado exitosamente` 
    });
  } catch (error) {
    console.error('Error en DELETE /groups/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al eliminar el grupo' } 
    });
  }
});

// POST /groups/:groupId/contacts/:contactId - Agregar contacto a grupo
router.post('/groups/:groupId/contacts/:contactId', async (req, res) => {
  try {
    const { groupId, contactId } = req.params;
    
    // Verificar si el contacto existe
    const contact = await contactsRepo.getById(contactId);
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Contacto no encontrado' } 
      });
    }
    
    // Verificar si el grupo existe
    const group = await groupsRepo.getById(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Grupo no encontrado' } 
      });
    }
    
    // Actualizar el contacto con el nuevo grupo
    const updatedContact = await contactsRepo.update(contactId, {
      groupId: groupId,
      update_date: new Date().toISOString()
    });
    
    if (!updatedContact) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al actualizar el contacto' } 
      });
    }
    
    // Obtener la cuenta actualizada de contactos en el grupo
    const contactsInGroup = await contactsRepo.list({ groupId });
    
    // Actualizar el contador de contactos en el grupo
    await groupsRepo.update(groupId, {
      contactCount: contactsInGroup.length,
      update_date: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      data: { 
        contact: { 
          id: updatedContact.id, 
          name: updatedContact.name, 
          groupId: updatedContact.groupId 
        },
        group: { 
          id: group.id, 
          name: group.name, 
          contactCount: contactsInGroup.length 
        }
      },
      message: `Contacto "${updatedContact.name}" agregado al grupo "${group.name}"`
    });
  } catch (error) {
    console.error('Error en POST /groups/:groupId/contacts/:contactId:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al agregar contacto al grupo' } 
    });
  }
});

// DELETE /groups/:groupId/contacts/:contactId - Remover contacto de grupo
router.delete('/groups/:groupId/contacts/:contactId', async (req, res) => {
  try {
    const { groupId, contactId } = req.params;
    
    // Verificar si el contacto existe
    const contact = await contactsRepo.getById(contactId);
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Contacto no encontrado' } 
      });
    }
    
    // Verificar si el grupo existe
    const group = await groupsRepo.getById(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Grupo no encontrado' } 
      });
    }
    
    // Verificar si el contacto pertenece al grupo
    if (contact.groupId !== groupId) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'El contacto no pertenece a este grupo' } 
      });
    }
    
    // Eliminar la referencia al grupo en el contacto
    const updatedContact = await contactsRepo.update(contactId, {
      groupId: null,
      update_date: new Date().toISOString()
    });
    
    if (!updatedContact) {
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Error al actualizar el contacto' } 
      });
    }
    
    // Obtener la cuenta actualizada de contactos en el grupo
    const contactsInGroup = await contactsRepo.list({ groupId });
    
    // Actualizar el contador de contactos en el grupo
    await groupsRepo.update(groupId, {
      contactCount: contactsInGroup.length,
      update_date: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      data: { 
        contact: { 
          id: updatedContact.id, 
          name: updatedContact.name, 
          groupId: updatedContact.groupId 
        },
        group: { 
          id: group.id, 
          name: group.name, 
          contactCount: contactsInGroup.length 
        }
      },
      message: `Contacto "${updatedContact.name}" removido del grupo "${group.name}"`
    });
  } catch (error) {
    console.error('Error en DELETE /groups/:groupId/contacts/:contactId:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Error al remover contacto del grupo' } 
    });
  }
});

module.exports = router;
