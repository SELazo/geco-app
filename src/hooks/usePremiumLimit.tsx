import { useState, useCallback } from 'react';
import { AccountService } from '../services/external/accountService';

/**
 * Hook personalizado para manejar límites de cuenta Premium/Free
 */
export const usePremiumLimit = () => {
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{
    feature: 'strategies' | 'images' | 'contacts' | 'groups';
    currentCount: number;
    limit: number;
  } | null>(null);

  /**
   * Verifica si el usuario puede crear una estrategia
   * @param currentCount Número actual de estrategias del usuario
   * @returns true si puede crear, false si alcanzó el límite
   */
  const canCreateStrategy = useCallback(async (currentCount: number): Promise<boolean> => {
    const can = await AccountService.canCreateStrategy(currentCount);
    
    if (!can) {
      const limits = await AccountService.getCurrentLimits();
      setLimitInfo({
        feature: 'strategies',
        currentCount,
        limit: limits.strategies
      });
      setIsLimitModalOpen(true);
      return false;
    }
    
    return true;
  }, []);

  /**
   * Verifica si el usuario puede crear una imagen/publicidad
   * @param currentCount Número actual de imágenes del usuario
   */
  const canCreateImage = useCallback(async (currentCount: number): Promise<boolean> => {
    const can = await AccountService.canCreateImage(currentCount);
    
    if (!can) {
      const limits = await AccountService.getCurrentLimits();
      setLimitInfo({
        feature: 'images',
        currentCount,
        limit: limits.images
      });
      setIsLimitModalOpen(true);
      return false;
    }
    
    return true;
  }, []);

  /**
   * Verifica si el usuario puede crear un contacto
   * @param currentCount Número actual de contactos del usuario
   */
  const canCreateContact = useCallback(async (currentCount: number): Promise<boolean> => {
    const can = await AccountService.canCreateContact(currentCount);
    
    if (!can) {
      const limits = await AccountService.getCurrentLimits();
      setLimitInfo({
        feature: 'contacts',
        currentCount,
        limit: limits.contacts
      });
      setIsLimitModalOpen(true);
      return false;
    }
    
    return true;
  }, []);

  /**
   * Verifica si el usuario puede crear un grupo
   * @param currentCount Número actual de grupos del usuario
   */
  const canCreateGroup = useCallback(async (currentCount: number): Promise<boolean> => {
    const can = await AccountService.canCreateGroup(currentCount);
    
    if (!can) {
      const limits = await AccountService.getCurrentLimits();
      setLimitInfo({
        feature: 'groups',
        currentCount,
        limit: limits.groups
      });
      setIsLimitModalOpen(true);
      return false;
    }
    
    return true;
  }, []);

  /**
   * Obtiene los límites actuales del usuario
   */
  const getCurrentLimits = useCallback(async () => {
    return await AccountService.getCurrentLimits();
  }, []);

  /**
   * Verifica si el usuario es premium
   */
  const isPremium = useCallback(async () => {
    return await AccountService.isPremium();
  }, []);

  /**
   * Cierra el modal de límite
   */
  const closeLimitModal = useCallback(() => {
    setIsLimitModalOpen(false);
    setLimitInfo(null);
  }, []);

  return {
    // Estados
    isLimitModalOpen,
    limitInfo,
    
    // Métodos de verificación
    canCreateStrategy,
    canCreateImage,
    canCreateContact,
    canCreateGroup,
    
    // Métodos auxiliares
    getCurrentLimits,
    isPremium,
    closeLimitModal
  };
};
