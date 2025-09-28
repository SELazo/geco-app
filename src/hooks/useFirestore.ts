import { useState, useEffect, useCallback } from 'react';
import { FirestoreService, FirestoreQueryOptions } from '../services/external/firestoreService';

interface UseFirestoreOptions {
  autoLoad?: boolean;
  dependencies?: any[];
}

export const useFirestore = <T = any>(
  collectionName: string,
  options: UseFirestoreOptions = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoLoad = false, dependencies = [] } = options;

  // Cargar todos los documentos
  const loadAll = useCallback(async (queryOptions?: FirestoreQueryOptions) => {
    try {
      setLoading(true);
      setError(null);
      const documents = await FirestoreService.readAll(collectionName, queryOptions);
      setData(documents);
      return documents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading documents:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // Cargar un documento por ID
  const loadById = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const document = await FirestoreService.readById(collectionName, documentId);
      return document;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // Crear un nuevo documento
  const create = useCallback(async (documentData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newDocId = await FirestoreService.create(collectionName, documentData);
      
      // Recargar los datos si autoLoad está habilitado
      if (autoLoad) {
        await loadAll();
      }
      
      return newDocId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, autoLoad, loadAll]);

  // Actualizar un documento
  const update = useCallback(async (
    documentId: string, 
    updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      setLoading(true);
      setError(null);
      await FirestoreService.update(collectionName, documentId, updates);
      
      // Recargar los datos si autoLoad está habilitado
      if (autoLoad) {
        await loadAll();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error updating document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, autoLoad, loadAll]);

  // Eliminar un documento
  const remove = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await FirestoreService.delete(collectionName, documentId);
      
      // Recargar los datos si autoLoad está habilitado
      if (autoLoad) {
        await loadAll();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error deleting document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, autoLoad, loadAll]);

  // Buscar documentos
  const findBy = useCallback(async (
    field: string, 
    operator: any, 
    value: any
  ) => {
    try {
      setLoading(true);
      setError(null);
      const documents = await FirestoreService.findBy(collectionName, field, operator, value);
      
      if (autoLoad) {
        setData(documents);
      }
      
      return documents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error finding documents:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName, autoLoad]);

  // Verificar si existe un documento
  const exists = useCallback(async (documentId: string) => {
    try {
      return await FirestoreService.exists(collectionName, documentId);
    } catch (err) {
      console.error('Error checking document existence:', err);
      throw err;
    }
  }, [collectionName]);

  // Contar documentos
  const count = useCallback(async (queryOptions?: FirestoreQueryOptions) => {
    try {
      return await FirestoreService.count(collectionName, queryOptions);
    } catch (err) {
      console.error('Error counting documents:', err);
      throw err;
    }
  }, [collectionName]);

  // Auto-cargar datos si está habilitado
  useEffect(() => {
    if (autoLoad) {
      loadAll();
    }
  }, [autoLoad, loadAll, ...dependencies]);

  return {
    data,
    loading,
    error,
    loadAll,
    loadById,
    create,
    update,
    remove,
    findBy,
    exists,
    count,
    refresh: loadAll,
  };
};

// Hook específico para estrategias
export const useStrategies = (userId: string, autoLoad = true) => {
  const hook = useFirestore('strategies', { autoLoad, dependencies: [userId] });
  
  const loadUserStrategies = useCallback(async () => {
    return hook.findBy('userId', '==', userId);
  }, [hook.findBy, userId]);

  const loadActiveStrategies = useCallback(async () => {
    return hook.loadAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }, [hook.loadAll, userId]);

  useEffect(() => {
    if (autoLoad && userId) {
      loadUserStrategies();
    }
  }, [autoLoad, userId, loadUserStrategies]);

  return {
    ...hook,
    loadUserStrategies,
    loadActiveStrategies,
  };
};

// Hook específico para contactos
export const useContacts = (userId: string, autoLoad = true) => {
  const hook = useFirestore('contacts', { autoLoad, dependencies: [userId] });
  
  const loadUserContacts = useCallback(async () => {
    return hook.findBy('userId', '==', userId);
  }, [hook.findBy, userId]);

  const loadActiveContacts = useCallback(async () => {
    return hook.loadAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: [{ field: 'name', direction: 'asc' }]
    });
  }, [hook.loadAll, userId]);

  useEffect(() => {
    if (autoLoad && userId) {
      loadUserContacts();
    }
  }, [autoLoad, userId, loadUserContacts]);

  return {
    ...hook,
    loadUserContacts,
    loadActiveContacts,
  };
};

export default useFirestore;
