const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuración
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Datos por defecto
const DEFAULT_DATA = {
  ads: [
    { 
      id: '1', 
      title: 'Promoción Verano 2024', 
      description: 'Descuentos especiales para la temporada de verano', 
      status: 'active',
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString()
    }
  ],
  contacts: [
    { 
      id: '1', 
      name: 'Juan Pérez', 
      email: 'juan@email.com', 
      phone: '+1234567890', 
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString() 
    }
  ],
  groups: [
    { 
      id: '1', 
      name: 'Clientes VIP', 
      description: 'Clientes más importantes', 
      contactCount: 1,
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString() 
    }
  ],
  users: [
    { 
      id: '1', 
      name: 'Admin', 
      email: 'admin@example.com', 
      password: 'admin123',
      role: 'admin',
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString() 
    }
  ],
  strategies: [
    { 
      id: '1', 
      name: 'Estrategia de Verano', 
      description: 'Campaña de verano 2024', 
      status: 'active',
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString() 
    }
  ]
};

let db = { ...DEFAULT_DATA };
let isInitialized = false;

/**
 * Inicializa el store, cargando datos desde el archivo si existe
 */
async function initialize() {
  if (isInitialized) return;
  
  try {
    // Crear directorio de datos si no existe
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      // Intentar cargar datos existentes
      const data = await fs.readFile(DATA_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('Datos cargados desde', DATA_FILE);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe, guardar datos por defecto
        console.log('Archivo no encontrado, creando con datos por defecto');
        await saveData();
      } else {
        throw error;
      }
    }
    
    isInitialized = true;
    console.log('Store inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el store:', error);
    throw error;
  }
}

/**
 * Guarda los datos actuales en el archivo
 */
async function saveData() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar datos:', error);
    throw error;
  }
}

/**
 * Crea un repositorio para una colección específica
 * @param {string} collection - Nombre de la colección
 * @returns {Object} Objeto con métodos CRUD
 */
function createRepository(collection) {
  return {
    /**
     * Obtiene todos los elementos de la colección
     * @param {Object} filter - Filtros opcionales
     * @returns {Promise<Array>} Lista de elementos
     */
    async list(filter = {}) {
      await initialize();
      let items = db[collection] || [];
      
      // Aplicar filtros si existen
      if (Object.keys(filter).length > 0) {
        items = items.filter(item => {
          return Object.entries(filter).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }
      
      return [...items]; // Devolver copia
    },
    
    /**
     * Obtiene un elemento por su ID
     * @param {string} id - ID del elemento
     * @returns {Promise<Object|null>} El elemento o null si no se encuentra
     */
    async getById(id) {
      await initialize();
      const item = (db[collection] || []).find(item => item.id === String(id));
      return item ? { ...item } : null;
    },
    
    /**
     * Crea un nuevo elemento
     * @param {Object} data - Datos del nuevo elemento
     * @returns {Promise<Object>} El elemento creado
     */
    async create(data) {
      await initialize();
      const now = new Date().toISOString();
      const newItem = {
        ...data,
        id: uuidv4(),
        create_date: now,
        update_date: now
      };
      
      if (!db[collection]) {
        db[collection] = [];
      }
      
      db[collection].push(newItem);
      await saveData();
      return { ...newItem };
    },
    
    /**
     * Actualiza un elemento existente
     * @param {string} id - ID del elemento a actualizar
     * @param {Object} data - Nuevos datos
     * @returns {Promise<Object|null>} El elemento actualizado o null si no se encuentra
     */
    async update(id, data) {
      await initialize();
      const index = (db[collection] || []).findIndex(item => item.id === String(id));
      
      if (index === -1) return null;
      
      const updatedItem = {
        ...db[collection][index],
        ...data,
        id: String(id), // Asegurar que el ID no cambie
        update_date: new Date().toISOString()
      };
      
      db[collection][index] = updatedItem;
      await saveData();
      return { ...updatedItem };
    },
    
    /**
     * Elimina un elemento
     * @param {string} id - ID del elemento a eliminar
     * @returns {Promise<boolean>} true si se eliminó, false si no se encontró
     */
    async delete(id) {
      await initialize();
      const index = (db[collection] || []).findIndex(item => item.id === String(id));
      
      if (index === -1) return false;
      
      db[collection].splice(index, 1);
      await saveData();
      return true;
    },
    
    /**
     * Busca un elemento que cumpla con los criterios
     * @param {Object} filter - Criterios de búsqueda
     * @returns {Promise<Object|null>} El primer elemento que cumple los criterios o null
     */
    async findOne(filter) {
      await initialize();
      if (!filter || Object.keys(filter).length === 0) return null;
      
      const item = (db[collection] || []).find(item => {
        return Object.entries(filter).every(([key, value]) => item[key] === value);
      });
      
      return item ? { ...item } : null;
    }
  };
}

// Crear repositorios
exports.contactsRepo = createRepository('contacts');
exports.groupsRepo = createRepository('groups');
exports.adsRepo = createRepository('ads');
exports.usersRepo = createRepository('users');
exports.strategiesRepo = createRepository('strategies');

// Inicializar al cargar el módulo
initialize().catch(console.error);

// Para testing: limpiar datos
exports._reset = async () => {
  db = { ...DEFAULT_DATA };
  await saveData();
  return true;
};

// Para testing: obtener datos crudos
exports._getRawData = () => ({ ...db });
