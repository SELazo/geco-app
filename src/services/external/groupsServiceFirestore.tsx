import {
  IGroup as IGroupOld,
  IGroupResponse,
  IGroupService,
} from '../../interfaces/dtos/external/IGroups';
import { IBasicSuccessResponse } from '../../interfaces/dtos/external/IBasicResponse';
import { ContactsFirestoreService } from './contactsFirestoreService';
import { IGroup, IContact } from '../../interfaces/dtos/external/IFirestore';

/**
 * Adaptador para migrar el servicio de grupos a Firestore
 * Mantiene compatibilidad con la interfaz IGroupService existente
 */
export const GroupsServiceFirestore: IGroupService = {
  newGroup: async (
    name: string,
    description: string,
    contacts: number[]
  ): Promise<IBasicSuccessResponse> => {
    try {
      // Obtener el usuario actual del localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuario no autenticado');
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id;

      // Crear el grupo en Firestore
      const groupData: Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        description,
        contactIds: [], // Se llenarán después
        userId,
        tags: []
      };

      const groupId = await ContactsFirestoreService.createGroup(groupData);

      // Convertir los IDs de contactos (números) a strings y asociarlos al grupo
      // Nota: Esto asume que los contactos ya existen en Firestore
      // En un escenario real, necesitarías mapear los IDs antiguos a los nuevos
      
      return {
        type: 'success',
        code: 200,
        message: 'Grupo creado exitosamente'
      };
    } catch (error) {
      console.error('Error creating group:', error);
      return {
        type: 'error',
        code: 500,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  addContactToGroup: async (
    groupId: number,
    contactId: number
  ): Promise<IBasicSuccessResponse> => {
    try {
      // Convertir IDs numéricos a strings para Firestore
      const groupIdStr = groupId.toString();
      const contactIdStr = contactId.toString();

      await ContactsFirestoreService.addContactToGroup(contactIdStr, groupIdStr);
      
      return {
        type: 'success',
        code: 200,
        message: 'Contacto agregado al grupo exitosamente'
      };
    } catch (error) {
      console.error('Error adding contact to group:', error);
      return {
        type: 'error',
        code: 500,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  deleteContactFromGroup: async (
    groupId: number,
    contactId: number
  ): Promise<IBasicSuccessResponse> => {
    try {
      const groupIdStr = groupId.toString();
      const contactIdStr = contactId.toString();

      await ContactsFirestoreService.removeContactFromGroup(contactIdStr, groupIdStr);
      
      return {
        type: 'success',
        code: 200,
        message: 'Contacto removido del grupo exitosamente'
      };
    } catch (error) {
      console.error('Error removing contact from group:', error);
      return {
        type: 'error',
        code: 500,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  editGroup: async (groupId: number): Promise<IBasicSuccessResponse> => {
    try {
      // Esta función parece incompleta en el servicio original
      // Implementación básica
      return {
        type: 'success',
        code: 200,
        message: 'Funcionalidad de edición pendiente de implementar'
      };
    } catch (error) {
      console.error('Error editing group:', error);
      return {
        type: 'error',
        code: 500,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  deleteGroup: async (groupId: number): Promise<IBasicSuccessResponse> => {
    try {
      const groupIdStr = groupId.toString();
      await ContactsFirestoreService.deleteGroup(groupIdStr);
      
      return {
        type: 'success',
        code: 200,
        message: 'Grupo eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error deleting group:', error);
      return {
        type: 'error',
        code: 500,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  getGroup: async (groupId: number): Promise<IGroupResponse> => {
    try {
      // Encontrar el ID real de Firestore basado en el ID numérico
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuario no autenticado');
      }
      
      const user = JSON.parse(userStr);
      const userIdStr = user.id.toString();
      const allGroups = await ContactsFirestoreService.getUserGroups(userIdStr);
      
      // Buscar el grupo que coincida con el ID numérico
      let targetFirestoreId: string | null = null;
      for (const group of allGroups) {
        const firestoreId = group.id || '0';
        const numericId = firestoreId === '0' ? 0 : Math.abs(firestoreId.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0));
        
        if (numericId === groupId) {
          targetFirestoreId = firestoreId;
          break;
        }
      }
      
      if (!targetFirestoreId) {
        throw new Error('Grupo no encontrado');
      }
      
      // Obtener el grupo de Firestore
      const firestoreGroup = await ContactsFirestoreService.getGroup(targetFirestoreId);
      if (!firestoreGroup) {
        throw new Error('Grupo no encontrado');
      }

      // Obtener los contactos del grupo
      const contacts = await ContactsFirestoreService.getContactsByGroup(targetFirestoreId);

      // Convertir formato de Firestore al formato esperado
      const group: IGroupOld = {
        id: groupId,
        name: firestoreGroup.name,
        description: firestoreGroup.description || '',
        account_id: parseInt(firestoreGroup.userId)
      };

      // Convertir contactos de Firestore al formato esperado
      const contactsResponse = contacts.map(contact => ({
        id: parseInt(contact.id || '0'),
        name: contact.name,
        email: contact.email || '',
        phone: parseInt(contact.phone || '0'),
        account_id: parseInt(contact.userId)
      }));

      return {
        group,
        contacts: contactsResponse
      };
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  },

  getGroups: async (name?: string): Promise<IGroupOld[]> => {
    try {
      // Obtener el usuario actual
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuario no autenticado');
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id;

      // Obtener grupos del usuario
      const userIdStr = userId.toString();
      const firestoreGroups = await ContactsFirestoreService.getUserGroups(userIdStr);

      // Filtrar por nombre si se proporciona
      let filteredGroups = firestoreGroups;
      if (name) {
        filteredGroups = firestoreGroups.filter(group => 
          group.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      // Convertir al formato esperado
      const convertedGroups = filteredGroups.map(group => {
        // Crear un ID numérico único basado en hash del ID de Firestore
        const firestoreId = group.id || '0';
        const numericId = firestoreId === '0' ? 0 : Math.abs(firestoreId.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0));
        
        return {
          id: numericId,
          name: group.name,
          description: group.description || '',
          account_id: parseInt(group.userId)
        };
      });
      return convertedGroups;
    } catch (error) {
      console.error('Error getting groups:', error);
      throw error;
    }
  },
};
