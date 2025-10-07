/**
 * Ejemplos de uso de los servicios de Firestore
 * Este archivo muestra cómo usar los servicios CRUD en tu aplicación GECO
 */

import { StrategiesFirestoreService } from '../services/external/strategiesFirestoreService';
import { ContactsFirestoreService } from '../services/external/contactsFirestoreService';
import { FirestoreService } from '../services/external/firestoreService';
import { IStrategy, IContact, IGroup } from '../interfaces/dtos/external/IFirestore';

// ========== EJEMPLOS DE ESTRATEGIAS ==========

export const strategyExamples = {
  // Crear una nueva estrategia
  async createNewStrategy(userId: string) {
    const newStrategy: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Campaña de Verano 2024',
      description: 'Promoción especial para productos de verano',
      ads: ['ad1', 'ad2'], // IDs de anuncios
      groups: ['group1', 'group2'], // IDs de grupos
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      periodicity: 'weekly',
      schedule: '09:00',
      enableForm: true,
      formType: 'Pedido rápido',
      formConfig: {
        requireName: true,
        requirePhone: true,
      },
      status: 'draft',
      userId: userId,
    };

    try {
      const strategyId = await StrategiesFirestoreService.createStrategy(newStrategy);
      console.log('Estrategia creada con ID:', strategyId);
      return strategyId;
    } catch (error) {
      console.error('Error al crear estrategia:', error);
      throw error;
    }
  },

  // Obtener estrategias de un usuario
  async getUserStrategies(userId: string) {
    try {
      const strategies = await StrategiesFirestoreService.getUserStrategies(userId);
      console.log('Estrategias del usuario:', strategies);
      return strategies;
    } catch (error) {
      console.error('Error al obtener estrategias:', error);
      throw error;
    }
  },

  // Actualizar una estrategia
  async updateStrategy(strategyId: string) {
    try {
      await StrategiesFirestoreService.updateStrategy(strategyId, {
        title: 'Campaña de Verano 2024 - Actualizada',
        status: 'active',
      });
      console.log('Estrategia actualizada');
    } catch (error) {
      console.error('Error al actualizar estrategia:', error);
      throw error;
    }
  },

  // Buscar estrategias activas
  async getActiveStrategies(userId: string) {
    try {
      const activeStrategies = await StrategiesFirestoreService.getActiveStrategies(userId);
      console.log('Estrategias activas:', activeStrategies);
      return activeStrategies;
    } catch (error) {
      console.error('Error al obtener estrategias activas:', error);
      throw error;
    }
  },
};

// ========== EJEMPLOS DE CONTACTOS ==========

export const contactExamples = {
  // Crear un nuevo contacto
  async createNewContact(userId: string) {
    const newContact: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+54911234567',
      groups: [], // Se agregará a grupos después
      tags: ['cliente', 'premium'],
      userId: userId,
      status: 'active',
    };

    try {
      const contactId = await ContactsFirestoreService.createContact(newContact);
      console.log('Contacto creado con ID:', contactId);
      return contactId;
    } catch (error) {
      console.error('Error al crear contacto:', error);
      throw error;
    }
  },

  // Crear un grupo
  async createNewGroup(userId: string) {
    const newGroup: Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Clientes Premium',
      description: 'Grupo de clientes con membresía premium',
      contactIds: [],
      userId: userId,
      color: '#FFD700',
      tags: ['premium', 'vip'],
    };

    try {
      const groupId = await ContactsFirestoreService.createGroup(newGroup);
      console.log('Grupo creado con ID:', groupId);
      return groupId;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  },

  // Agregar contacto a grupo
  async addContactToGroup(contactId: string, groupId: string) {
    try {
      await ContactsFirestoreService.addContactToGroup(contactId, groupId);
      console.log('Contacto agregado al grupo');
    } catch (error) {
      console.error('Error al agregar contacto al grupo:', error);
      throw error;
    }
  },

  // Buscar contactos
  async searchContacts(userId: string, searchTerm: string) {
    try {
      const contacts = await ContactsFirestoreService.searchContacts(userId, searchTerm);
      console.log('Contactos encontrados:', contacts);
      return contacts;
    } catch (error) {
      console.error('Error al buscar contactos:', error);
      throw error;
    }
  },

  // Obtener estadísticas de contactos
  async getContactsStats(userId: string) {
    try {
      const stats = await ContactsFirestoreService.getContactsStats(userId);
      console.log('Estadísticas de contactos:', stats);
      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },
};

// ========== EJEMPLOS DE OPERACIONES GENERALES ==========

export const generalExamples = {
  // Crear cualquier documento
  async createDocument(collectionName: string, data: any) {
    try {
      const docId = await FirestoreService.create(collectionName, data);
      console.log(`Documento creado en ${collectionName} con ID:`, docId);
      return docId;
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  },

  // Leer todos los documentos con filtros
  async readWithFilters(collectionName: string, userId: string) {
    try {
      const documents = await FirestoreService.readAll(collectionName, {
        where: [
          { field: 'userId', operator: '==', value: userId },
          { field: 'status', operator: '==', value: 'active' }
        ],
        orderBy: [{ field: 'createdAt', direction: 'desc' }],
        limit: 10,
      });
      console.log('Documentos filtrados:', documents);
      return documents;
    } catch (error) {
      console.error('Error al leer documentos:', error);
      throw error;
    }
  },

  // Actualizar documento
  async updateDocument(collectionName: string, documentId: string, updates: any) {
    try {
      await FirestoreService.update(collectionName, documentId, updates);
      console.log('Documento actualizado');
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      throw error;
    }
  },

  // Eliminar documento
  async deleteDocument(collectionName: string, documentId: string) {
    try {
      await FirestoreService.delete(collectionName, documentId);
      console.log('Documento eliminado');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      throw error;
    }
  },
};

// ========== EJEMPLO DE USO EN COMPONENTE REACT ==========

export const reactComponentExample = `
// Ejemplo de cómo usar en un componente React
import React, { useState, useEffect } from 'react';
import { StrategiesFirestoreService } from '../services/external/strategiesFirestoreService';
import { IStrategy } from '../interfaces/dtos/external/IFirestore';

export const StrategiesPage = () => {
  const [strategies, setStrategies] = useState<IStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = 'user123'; // Obtener del contexto de autenticación

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const userStrategies = await StrategiesFirestoreService.getUserStrategies(userId);
      setStrategies(userStrategies);
    } catch (error) {
      console.error('Error loading strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStrategy = async (strategyData: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newStrategyId = await StrategiesFirestoreService.createStrategy(strategyData);
      await loadStrategies(); // Recargar la lista
      return newStrategyId;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }
  };

  const updateStrategy = async (strategyId: string, updates: Partial<IStrategy>) => {
    try {
      await StrategiesFirestoreService.updateStrategy(strategyId, updates);
      await loadStrategies(); // Recargar la lista
    } catch (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }
  };

  const deleteStrategy = async (strategyId: string) => {
    try {
      await StrategiesFirestoreService.deleteStrategy(strategyId);
      await loadStrategies(); // Recargar la lista
    } catch (error) {
      console.error('Error deleting strategy:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Cargando estrategias...</div>;
  }

  return (
    <div>
      <h1>Mis Estrategias</h1>
      {strategies.map(strategy => (
        <div key={strategy.id}>
          <h3>{strategy.title}</h3>
          <p>Estado: {strategy.status}</p>
          <button onClick={() => updateStrategy(strategy.id!, { status: 'active' })}>
            Activar
          </button>
          <button onClick={() => deleteStrategy(strategy.id!)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};
`;

export default {
  strategyExamples,
  contactExamples,
  generalExamples,
  reactComponentExample,
};
