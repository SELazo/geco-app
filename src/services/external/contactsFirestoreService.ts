import { FirestoreService } from './firestoreService';
import { IContact, IGroup } from '../../interfaces/dtos/external/IFirestore';

export class ContactsFirestoreService {
  private static readonly CONTACTS_COLLECTION = 'contacts';
  private static readonly GROUPS_COLLECTION = 'groups';

  // ========== CONTACTS ==========
  
  /**
   * Crear un nuevo contacto
   */
  static async createContact(contact: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirestoreService.create(this.CONTACTS_COLLECTION, contact);
  }

  /**
   * Obtener un contacto por ID
   */
  static async getContact(contactId: string): Promise<IContact | null> {
    return FirestoreService.readById(this.CONTACTS_COLLECTION, contactId);
  }

  /**
   * Obtener todos los contactos de un usuario
   */
  static async getUserContacts(userId: string): Promise<IContact[]> {
    try {
      console.log('🔍 Buscando contactos para usuario:', userId);
      
      if (!userId) {
        console.error('❌ Error: userId no proporcionado');
        throw new Error('Se requiere un ID de usuario válido');
      }

      const contacts = await FirestoreService.findBy(this.CONTACTS_COLLECTION, 'userId', '==', userId);
      console.log(`✅ Se encontraron ${contacts.length} contactos para el usuario ${userId}`);
      
      return contacts;
    } catch (error) {
      console.error('❌ Error en getUserContacts:', error);
      // Devolver un array vacío en lugar de lanzar el error
      return [];
    }
  }

  /**
   * Obtener contactos activos de un usuario
   */
  static async getActiveContacts(userId: string): Promise<IContact[]> {
    try {
      console.log('🔍 Buscando contactos activos para usuario:', userId);
      
      if (!userId) {
        console.error('❌ Error: userId no proporcionado');
        return [];
      }

      const contacts = await FirestoreService.readAll(this.CONTACTS_COLLECTION, {
        where: [
          { field: 'userId', operator: '==', value: userId },
          { field: 'status', operator: '==', value: 'active' }
        ],
        orderBy: [{ field: 'name', direction: 'asc' }]
      });
      
      console.log(`✅ Se encontraron ${contacts.length} contactos activos para el usuario ${userId}`);
      return contacts;
    } catch (error) {
      console.error('❌ Error en getActiveContacts:', error);
      return [];
    }
  }

  /**
   * Actualizar un contacto
   */
  static async updateContact(
    contactId: string, 
    updates: Partial<Omit<IContact, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return FirestoreService.update(this.CONTACTS_COLLECTION, contactId, updates);
  }

  /**
   * Eliminar un contacto
   */
  static async deleteContact(contactId: string): Promise<void> {
    return FirestoreService.delete(this.CONTACTS_COLLECTION, contactId);
  }

  /**
   * Buscar contactos por nombre o email
   */
  static async searchContacts(userId: string, searchTerm: string): Promise<IContact[]> {
    const allContacts = await this.getUserContacts(userId);
    return allContacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  /**
   * Obtener contactos por grupo
   */
  static async getContactsByGroup(groupId: string): Promise<IContact[]> {
    return FirestoreService.findBy(this.CONTACTS_COLLECTION, 'groups', 'array-contains', groupId);
  }

  /**
   * Agregar contacto a un grupo
   */
  static async addContactToGroup(contactId: string, groupId: string): Promise<void> {
    const contact = await this.getContact(contactId);
    if (contact && !contact.groups.includes(groupId)) {
      const updatedGroups = [...contact.groups, groupId];
      await this.updateContact(contactId, { groups: updatedGroups });
    }
  }

  /**
   * Remover contacto de un grupo
   */
  static async removeContactFromGroup(contactId: string, groupId: string): Promise<void> {
    const contact = await this.getContact(contactId);
    if (contact) {
      const updatedGroups = contact.groups.filter(id => id !== groupId);
      await this.updateContact(contactId, { groups: updatedGroups });
    }
  }

  // ========== GROUPS ==========

  /**
   * Crear un nuevo grupo
   */
  static async createGroup(group: Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirestoreService.create(this.GROUPS_COLLECTION, group);
  }

  /**
   * Obtener un grupo por ID
   */
  static async getGroup(groupId: string): Promise<IGroup | null> {
    return FirestoreService.readById(this.GROUPS_COLLECTION, groupId);
  }

  /**
   * Obtener todos los grupos de un usuario
   */
  static async getUserGroups(userId: string): Promise<IGroup[]> {
    return FirestoreService.findBy(this.GROUPS_COLLECTION, 'userId', '==', userId);
  }

  /**
   * Actualizar un grupo
   */
  static async updateGroup(
    groupId: string, 
    updates: Partial<Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return FirestoreService.update(this.GROUPS_COLLECTION, groupId, updates);
  }

  /**
   * Eliminar un grupo
   */
  static async deleteGroup(groupId: string): Promise<void> {
    // Primero remover el grupo de todos los contactos
    const contacts = await this.getContactsByGroup(groupId);
    for (const contact of contacts) {
      await this.removeContactFromGroup(contact.id!, groupId);
    }
    
    // Luego eliminar el grupo
    return FirestoreService.delete(this.GROUPS_COLLECTION, groupId);
  }

  /**
   * Obtener estadísticas de contactos
   */
  static async getContactsStats(userId: string) {
    const contacts = await this.getUserContacts(userId);
    const groups = await this.getUserGroups(userId);
    
    return {
      totalContacts: contacts.length,
      activeContacts: contacts.filter(c => c.status === 'active').length,
      inactiveContacts: contacts.filter(c => c.status === 'inactive').length,
      blockedContacts: contacts.filter(c => c.status === 'blocked').length,
      totalGroups: groups.length,
      contactsWithEmail: contacts.filter(c => c.email).length,
      contactsWithPhone: contacts.filter(c => c.phone).length,
    };
  }
}

export default ContactsFirestoreService;
