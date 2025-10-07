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

// Hook específico para anuncios
export const useAds = (userId: string, autoLoad = true) => {
  const hook = useFirestore('ads', { autoLoad, dependencies: [userId] });
  
  const loadUserAds = useCallback(async () => {
    return hook.findBy('userId', '==', userId);
  }, [hook.findBy, userId]);

  const loadActiveAds = useCallback(async () => {
    return hook.loadAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }, [hook.loadAll, userId]);

  const loadAdsByStatus = useCallback(async (status: 'draft' | 'active' | 'archived') => {
    return hook.loadAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: status }
      ],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    });
  }, [hook.loadAll, userId]);

  useEffect(() => {
    if (autoLoad && userId) {
      loadUserAds();
    }
  }, [autoLoad, userId, loadUserAds]);

  return {
    ...hook,
    loadUserAds,
    loadActiveAds,
    loadAdsByStatus,
  };
};

// Hook específico para envíos de formularios
export const useFormSubmissions = (strategyId: string, autoLoad = true) => {
  const hook = useFirestore('form-submissions', { autoLoad, dependencies: [strategyId] });
  
  const loadSubmissionsByStrategy = useCallback(async () => {
    return hook.findBy('strategyId', '==', strategyId);
  }, [hook.findBy, strategyId]);

  const loadPendingSubmissions = useCallback(async () => {
    return hook.loadAll({
      where: [
        { field: 'strategyId', operator: '==', value: strategyId },
        { field: 'processed', operator: '==', value: false }
      ],
      orderBy: [{ field: 'submittedAt', direction: 'asc' }]
    });
  }, [hook.loadAll, strategyId]);

  const loadProcessedSubmissions = useCallback(async () => {
    return hook.loadAll({
      where: [
        { field: 'strategyId', operator: '==', value: strategyId },
        { field: 'processed', operator: '==', value: true }
      ],
      orderBy: [{ field: 'submittedAt', direction: 'desc' }]
    });
  }, [hook.loadAll, strategyId]);

  useEffect(() => {
    if (autoLoad && strategyId) {
      loadSubmissionsByStrategy();
    }
  }, [autoLoad, strategyId, loadSubmissionsByStrategy]);

  return {
    ...hook,
    loadSubmissionsByStrategy,
    loadPendingSubmissions,
    loadProcessedSubmissions,
  };
};

// Hook específico para analytics
export const useAnalytics = (userId: string, autoLoad = true) => {
  const hook = useFirestore('analytics', { autoLoad, dependencies: [userId] });
  
  const loadUserAnalytics = useCallback(async () => {
    return hook.findBy('userId', '==', userId);
  }, [hook.findBy, userId]);

  const loadAnalyticsByType = useCallback(async (type: 'view' | 'click' | 'conversion' | 'form_submission') => {
    return hook.loadAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'type', operator: '==', value: type }
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    });
  }, [hook.loadAll, userId]);

  const loadAnalyticsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    return hook.loadAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'timestamp', operator: '>=', value: startDate },
        { field: 'timestamp', operator: '<=', value: endDate }
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    });
  }, [hook.loadAll, userId]);

  useEffect(() => {
    if (autoLoad && userId) {
      loadUserAnalytics();
    }
  }, [autoLoad, userId, loadUserAnalytics]);

  return {
    ...hook,
    loadUserAnalytics,
    loadAnalyticsByType,
    loadAnalyticsByDateRange,
  };
};

export default useFirestore;
