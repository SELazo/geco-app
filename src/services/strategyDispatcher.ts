import { StrategiesFirestoreService } from './external/strategiesFirestoreService';
import { ContactsFirestoreService } from './external/contactsFirestoreService';
import WhatsAppService from './external/whatsappService';
import { IStrategy, IChannel } from '../interfaces/dtos/external/IFirestore';
import { environment } from '../environment/environment';

type ChannelHandler = (channel: IChannel, contact: any, strategy: IStrategy) => Promise<void>;

export class StrategyDispatcher {
  private static instance: StrategyDispatcher;
  private channelHandlers: Record<string, ChannelHandler> = {};
  private isProcessing = false;

  private constructor() {
    this.initializeHandlers();
  }

  public static getInstance(): StrategyDispatcher {
    if (!StrategyDispatcher.instance) {
      StrategyDispatcher.instance = new StrategyDispatcher();
    }
    return StrategyDispatcher.instance;
  }

  private initializeHandlers() {
    // Manejador para WhatsApp
    this.channelHandlers['whatsapp'] = async (channel, contact, strategy) => {
      // Verificar que la estrategia tenga un ID válido
      if (!strategy?.id) {
        console.error('La estrategia no tiene un ID válido');
        return;
      }
      
      // Verificar que el contacto tenga un número de teléfono válido
      const phoneNumber = contact.phone;
      if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim() === '') {
        const errorMessage = `Contacto ${contact.id} no tiene un número de teléfono válido`;
        console.warn(errorMessage);
        await this.updateChannelStatus(strategy.id, channel, 'failed', errorMessage);
        return;
      }

      const whatsapp = WhatsAppService.getInstance();
      
      try {
        // Actualizar estado a "enviando"
        await this.updateChannelStatus(strategy.id, channel, 'sending');

        if (channel.templateId) {
          // Enviar plantilla
          await whatsapp.sendTemplateMessage(
            phoneNumber,
            channel.templateId,
            'es', // Idioma por defecto
            this.prepareTemplateComponents(channel.content, contact)
          );
        } else if (channel.content?.text) {
          // Enviar mensaje de texto simple
          await whatsapp.sendTextMessage(
            contact.phone,
            this.replacePlaceholders(channel.content.text, contact)
          );
        }

        // Actualizar estado a "enviado"
        await this.updateChannelStatus(strategy.id, channel, 'sent');
      } catch (error: any) {
        console.error(`Error enviando mensaje a ${contact.phone}:`, error);
        await this.updateChannelStatus(strategy.id, channel, 'failed', error.message);
      }
    };

    // Puedes agregar más manejadores para otros canales aquí
    // this.channelHandlers['email'] = async (channel, contact) => { ... };
    // this.channelHandlers['sms'] = async (channel, contact) => { ... };
  }

  public async dispatchStrategy(strategyId: string): Promise<void> {
    if (this.isProcessing) {
      console.warn('Ya hay una estrategia en proceso');
      return;
    }

    try {
      this.isProcessing = true;
      const strategy = await StrategiesFirestoreService.getStrategy(strategyId);
      
      if (!strategy) {
        throw new Error(`Estrategia con ID ${strategyId} no encontrada`);
      }

      // Verificar si es momento de ejecutar la estrategia
      if (!this.shouldExecuteStrategy(strategy)) {
        return;
      }

      // Obtener todos los contactos de los grupos seleccionados
      const contacts = await this.getContactsFromGroups(strategy.groups);
      
      // Actualizar estadísticas
      await this.updateStrategyMetadata(strategyId, {
        totalRecipients: contacts.length,
        sentCount: 0,
        failedCount: 0,
        lastRun: new Date()
      });

      // Procesar cada canal de la estrategia
      for (const channel of strategy.channels) {
        const handler = this.channelHandlers[channel.type];
        if (!handler) {
          console.warn(`No hay manejador para el canal: ${channel.type}`);
          continue;
        }

        // Procesar cada contacto para este canal
        for (const contact of contacts) {
          await handler(channel, contact, strategy);
          
          // Actualizar contadores
          const status = channel.status || 'failed';
          const update: any = {};
          
          if (status === 'sent') {
            update.$inc = { 'metadata.sentCount': 1 };
          } else {
            update.$inc = { 'metadata.failedCount': 1 };
          }
          
          await StrategiesFirestoreService.updateStrategy(strategyId, update);
        }
      }

      // Actualizar estado de la estrategia
      const nextRun = this.calculateNextRun(strategy);
      await StrategiesFirestoreService.updateStrategy(strategyId, {
        status: 'completed',
        metadata: {
          ...strategy.metadata,  // Mantener los valores existentes de metadata
          nextRun: nextRun
        }
      });

    } catch (error) {
      console.error('Error en el despachador de estrategias:', error);
      // Get the current strategy to preserve its metadata
      const currentStrategy = await StrategiesFirestoreService.getStrategy(strategyId);
      if (currentStrategy) {
        await StrategiesFirestoreService.updateStrategy(strategyId, {
          status: 'paused',
          metadata: {
            ...(currentStrategy.metadata || {}),  // Preserve existing metadata if it exists
            error: error instanceof Error ? error.message : String(error)
          }
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  public async getContactsFromGroups(groupIds: string[]): Promise<any[]> {
    const allContacts: any[] = [];
    const uniqueContacts = new Set<string>();
    
    for (const groupId of groupIds) {
      const contacts = await ContactsFirestoreService.getContactsByGroup(groupId);
      
      for (const contact of contacts) {
        if (contact.id && !uniqueContacts.has(contact.id)) {
          uniqueContacts.add(contact.id);
          allContacts.push(contact);
        }
      }
    }

    return allContacts;
  }

  private prepareTemplateComponents(content: any, contact: any): any[] {
    const components = [];

    // Componente de cuerpo (texto)
    if (content.text) {
      components.push({
        type: 'body',
        parameters: [
          { type: 'text', text: this.replacePlaceholders(content.text, contact) }
        ]
      });
    }

    // Aquí podrías agregar más tipos de componentes (header, buttons, etc.)
    
    return components;
  }

  private replacePlaceholders(text: string, data: any): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      return data[key.trim()] || match;
    });
  }

  private shouldExecuteStrategy(strategy: IStrategy): boolean {
    const now = new Date();
    
    // Verificar si ya pasó la fecha de finalización
    if (strategy.endDate && new Date(strategy.endDate) < now) {
      return false;
    }

    // Verificar si es la primera ejecución
    if (!strategy.metadata?.lastRun) {
      return new Date(strategy.startDate) <= now;
    }

    // Verificar periodicidad
    const lastRun = new Date(strategy.metadata.lastRun);
    const nextRun = this.calculateNextRun(strategy);
    
    return nextRun <= now;
  }

  private calculateNextRun(strategy: IStrategy): Date {
    const now = new Date();
    const [hours, minutes] = strategy.schedule.split(':').map(Number);
    let nextRun = new Date();
    
    // Establecer la hora programada
    nextRun.setHours(hours, minutes, 0, 0);

    // Si ya pasó la hora de hoy, programar para el próximo día/semana/mes
    if (nextRun <= now) {
      switch (strategy.periodicity) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
        // 'once' no necesita hacer nada más
      }
    }

    return nextRun;
  }

  private async updateChannelStatus(
    strategyId: string, 
    channel: IChannel, 
    status: 'pending' | 'sending' | 'sent' | 'failed',
    error?: string
  ): Promise<void> {
    channel.status = status;
    channel.sentAt = status === 'sent' ? new Date() : channel.sentAt;
    
    if (error) {
      channel.metadata = channel.metadata || {};
      channel.metadata.error = error;
    }

    await StrategiesFirestoreService.updateStrategy(strategyId, {
      channels: [channel] // Actualizar solo el canal modificado
    });
  }

  private async updateStrategyMetadata(
    strategyId: string, 
    updates: Record<string, any>
  ): Promise<void> {
    await StrategiesFirestoreService.updateStrategy(strategyId, {
      metadata: {
        ...updates,
        updatedAt: new Date()
      }
    });
  }
}

export default StrategyDispatcher.getInstance();
