const express = require('express');
const router = express.Router();

// Arrays globales para persistir contactos y grupos en memoria durante la sesión del servidor
let contactsDatabase = [
  { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '+1234567890', create_date: new Date().toISOString(), update_date: new Date().toISOString() },
  { id: 2, name: 'María García', email: 'maria@email.com', phone: '+0987654321', create_date: new Date().toISOString(), update_date: new Date().toISOString() },
  { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '+1122334455', create_date: new Date().toISOString(), update_date: new Date().toISOString() }
];

let groupsDatabase = [
  { id: 1, name: 'Clientes VIP', description: 'Clientes más importantes', contactCount: 15, create_date: new Date().toISOString(), update_date: new Date().toISOString() },
  { id: 2, name: 'Prospectos', description: 'Contactos potenciales', contactCount: 8, create_date: new Date().toISOString(), update_date: new Date().toISOString() },
  { id: 3, name: 'Equipo', description: 'Miembros del equipo', contactCount: 5, create_date: new Date().toISOString(), update_date: new Date().toISOString() }
];

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
router.get('/contacts', (req, res) => {
  try {
    console.log('GET /contacts - Devolviendo', contactsDatabase.length, 'contactos');
    // Devolver el array global directamente
    res.json(contactsDatabase);
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /contacts/:id - Obtener contacto específico
router.get('/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const mockContact = {
      id: parseInt(id),
      name: `Contacto ${id}`,
      email: `contacto${id}@email.com`,
      phone: `+123456789${id}`,
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString()
    };
    res.json({ success: true, data: mockContact });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /directories/contacts - Crear nuevo contacto
router.post('/directories/contacts', (req, res) => {
  try {
    const { name, email, phone, groupId } = req.body;
    if (name && email) {
      const newContact = {
        id: Date.now(),
        name,
        email,
        phone: phone || '',
        groupId: groupId || null,
        create_date: new Date().toISOString(),
        update_date: new Date().toISOString()
      };
      
      // Agregar el nuevo contacto al array global para persistencia
      contactsDatabase.push(newContact);
      console.log('Nuevo contacto agregado. Total contactos:', contactsDatabase.length);
      
      res.json({ success: true, data: newContact, message: 'Contacto creado exitosamente' });
    } else {
      res.status(400).json({ success: false, error: { message: 'Nombre y email son requeridos' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// PUT /contacts/:id - Editar contacto
router.put('/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedContact = {
      id: parseInt(id),
      name: name || `Contacto ${id}`,
      email: email || `contacto${id}@email.com`,
      phone: phone || `+123456789${id}`,
      update_date: new Date().toISOString()
    };
    res.json({ success: true, data: updatedContact, message: 'Contacto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// DELETE /contacts/:id - Eliminar contacto
router.delete('/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const contactId = parseInt(id);
    
    // Buscar el índice del contacto a eliminar
    const contactIndex = contactsDatabase.findIndex(contact => contact.id === contactId);
    
    if (contactIndex !== -1) {
      // Eliminar el contacto del array
      const deletedContact = contactsDatabase.splice(contactIndex, 1)[0];
      console.log(`Contacto eliminado: ${deletedContact.name}. Total contactos restantes:`, contactsDatabase.length);
      res.json({ success: true, message: `Contacto ${deletedContact.name} eliminado exitosamente` });
    } else {
      res.status(404).json({ success: false, error: { message: `Contacto con ID ${id} no encontrado` } });
    }
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// ===== RUTAS DE GRUPOS =====

// GET /groups - Obtener lista de grupos
router.get('/groups', (req, res) => {
  try {
    console.log('GET /groups - Devolviendo', groupsDatabase.length, 'grupos');
    // Devolver el array global directamente
    res.json(groupsDatabase);
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// GET /groups/:id - Obtener grupo específico
router.get('/groups/:id', (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    
    // Buscar el grupo en el array global
    const group = groupsDatabase.find(g => g.id === groupId);
    
    if (group) {
      // Agregar contactos relacionados al grupo (simulado por ahora)
      const groupWithContacts = {
        ...group,
        contacts: contactsDatabase.filter(contact => contact.groupId === groupId) || []
      };
      
      console.log(`GET /groups/${id} - Grupo encontrado:`, group.name);
      res.json({ success: true, data: groupWithContacts });
    } else {
      console.log(`GET /groups/${id} - Grupo no encontrado`);
      res.status(404).json({ success: false, error: { message: `Grupo con ID ${id} no encontrado` } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /directories/groups - Crear nuevo grupo
router.post('/directories/groups', (req, res) => {
  try {
    const { name, description } = req.body;
    if (name) {
      const newGroup = {
        id: Date.now(),
        name,
        description: description || '',
        contactCount: 0,
        create_date: new Date().toISOString(),
        update_date: new Date().toISOString()
      };
      
      // Agregar el nuevo grupo al array global para persistencia
      groupsDatabase.push(newGroup);
      console.log('Nuevo grupo agregado. Total grupos:', groupsDatabase.length);
      
      res.json({ success: true, data: newGroup, message: 'Grupo creado exitosamente' });
    } else {
      res.status(400).json({ success: false, error: { message: 'Nombre del grupo es requerido' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// PUT /groups/:id - Editar grupo
router.put('/groups/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedGroup = {
      id: parseInt(id),
      name: name || `Grupo ${id}`,
      description: description || `Descripción del grupo ${id}`,
      update_date: new Date().toISOString()
    };
    res.json({ success: true, data: updatedGroup, message: 'Grupo actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// DELETE /groups/:id - Eliminar grupo
router.delete('/groups/:id', (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    
    // Buscar el índice del grupo a eliminar
    const groupIndex = groupsDatabase.findIndex(group => group.id === groupId);
    
    if (groupIndex !== -1) {
      // Eliminar el grupo del array
      const deletedGroup = groupsDatabase.splice(groupIndex, 1)[0];
      console.log(`Grupo eliminado: ${deletedGroup.name}. Total grupos restantes:`, groupsDatabase.length);
      res.json({ success: true, message: `Grupo ${deletedGroup.name} eliminado exitosamente` });
    } else {
      res.status(404).json({ success: false, error: { message: `Grupo con ID ${id} no encontrado` } });
    }
  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// POST /groups/:groupId/contacts/:contactId - Agregar contacto a grupo
router.post('/groups/:groupId/contacts/:contactId', (req, res) => {
  try {
    const { groupId, contactId } = req.params;
    res.json({ 
      success: true, 
      message: `Contacto ${contactId} agregado al grupo ${groupId} exitosamente` 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

// DELETE /groups/:groupId/contacts/:contactId - Remover contacto de grupo
router.delete('/groups/:groupId/contacts/:contactId', (req, res) => {
  try {
    const { groupId, contactId } = req.params;
    res.json({ 
      success: true, 
      message: `Contacto ${contactId} removido del grupo ${groupId} exitosamente` 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Error interno del servidor' } });
  }
});

module.exports = router;
