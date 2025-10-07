/**
 * Script de prueba para verificar la conexión a Firestore Database
 * Prueba todas las interfaces y operaciones CRUD
 */

import { FirestoreService } from '../services/external/firestoreService';
import { StrategiesFirestoreService } from '../services/external/strategiesFirestoreService';
import { ContactsFirestoreService } from '../services/external/contactsFirestoreService';
import { 
  IStrategy, 
  IContact, 
  IGroup, 
  IAd, 
  IFormSubmission, 
  IAnalytics 
} from '../interfaces/dtos/external/IFirestore';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`${colors.cyan}${colors.bright}🧪 ${msg}${colors.reset}`),
  separator: () => console.log(`${colors.magenta}${'='.repeat(60)}${colors.reset}`)
};

class FirestoreConnectionTest {
  private testUserId = 'test-user-' + Date.now();
  private createdDocuments: { collection: string; id: string }[] = [];

  async runAllTests(): Promise<void> {
    log.title('INICIANDO PRUEBAS DE CONEXIÓN FIRESTORE DATABASE');
    log.separator();
    
    try {
      // Probar conexión básica
      await this.testBasicConnection();
      
      // Probar cada interfaz
      await this.testStrategyInterface();
      await this.testContactInterface();
      await this.testGroupInterface();
      await this.testAdInterface();
      await this.testFormSubmissionInterface();
      await this.testAnalyticsInterface();
      
      // Probar servicios especializados
      await this.testSpecializedServices();
      
      log.separator();
      log.success('TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
      
    } catch (error) {
      log.error(`Error general en las pruebas: ${error}`);
    } finally {
      // Limpiar datos de prueba
      await this.cleanup();
    }
  }

  private async testBasicConnection(): Promise<void> {
    log.title('1. PROBANDO CONEXIÓN BÁSICA');
    
    try {
      // Crear un documento de prueba
      const testData = { 
        message: 'Test connection', 
        timestamp: new Date(),
        userId: this.testUserId 
      };
      
      const docId = await FirestoreService.create('test-connection', testData);
      this.createdDocuments.push({ collection: 'test-connection', id: docId });
      
      log.success(`Documento de prueba creado con ID: ${docId}`);
      
      // Leer el documento
      const readDoc = await FirestoreService.readById('test-connection', docId);
      if (readDoc && readDoc.message === 'Test connection') {
        log.success('Lectura de documento exitosa');
      } else {
        throw new Error('Error en la lectura del documento');
      }
      
      // Actualizar el documento
      await FirestoreService.update('test-connection', docId, { 
        message: 'Updated test connection' 
      });
      log.success('Actualización de documento exitosa');
      
      // Verificar la actualización
      const updatedDoc = await FirestoreService.readById('test-connection', docId);
      if (updatedDoc && updatedDoc.message === 'Updated test connection') {
        log.success('Verificación de actualización exitosa');
      }
      
    } catch (error) {
      log.error(`Error en conexión básica: ${error}`);
      throw error;
    }
  }

  private async testStrategyInterface(): Promise<void> {
    log.title('2. PROBANDO INTERFAZ IStrategy');
    
    try {
      const strategyData: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Estrategia de Prueba',
        description: 'Descripción de prueba para verificar la conexión',
        ads: ['ad1', 'ad2'],
        groups: ['group1', 'group2'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        periodicity: 'daily',
        schedule: '09:00',
        enableForm: true,
        formType: 'Pedido rápido',
        formConfig: { requireName: true, requirePhone: true },
        status: 'draft',
        userId: this.testUserId
      };

      // Crear estrategia
      const strategyId = await StrategiesFirestoreService.createStrategy(strategyData);
      this.createdDocuments.push({ collection: 'strategies', id: strategyId });
      log.success(`Estrategia creada con ID: ${strategyId}`);

      // Leer estrategia
      const strategy = await StrategiesFirestoreService.getStrategy(strategyId);
      if (strategy && strategy.title === 'Estrategia de Prueba') {
        log.success('Lectura de estrategia exitosa');
      }

      // Actualizar estrategia
      await StrategiesFirestoreService.updateStrategy(strategyId, { 
        status: 'active',
        title: 'Estrategia de Prueba Actualizada'
      });
      log.success('Actualización de estrategia exitosa');

      // Obtener estrategias del usuario
      const userStrategies = await StrategiesFirestoreService.getUserStrategies(this.testUserId);
      if (userStrategies.length > 0) {
        log.success(`Obtenidas ${userStrategies.length} estrategias del usuario`);
      }

    } catch (error) {
      log.error(`Error en interfaz IStrategy: ${error}`);
      throw error;
    }
  }

  private async testContactInterface(): Promise<void> {
    log.title('3. PROBANDO INTERFAZ IContact');
    
    try {
      const contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Juan Pérez Test',
        email: 'juan.test@email.com',
        phone: '+54911234567',
        groups: [],
        tags: ['test', 'cliente'],
        userId: this.testUserId,
        status: 'active'
      };

      // Crear contacto
      const contactId = await ContactsFirestoreService.createContact(contactData);
      this.createdDocuments.push({ collection: 'contacts', id: contactId });
      log.success(`Contacto creado con ID: ${contactId}`);

      // Leer contacto
      const contact = await ContactsFirestoreService.getContact(contactId);
      if (contact && contact.name === 'Juan Pérez Test') {
        log.success('Lectura de contacto exitosa');
      }

      // Actualizar contacto
      await ContactsFirestoreService.updateContact(contactId, { 
        name: 'Juan Pérez Test Actualizado',
        tags: ['test', 'cliente', 'actualizado']
      });
      log.success('Actualización de contacto exitosa');

      // Obtener contactos del usuario
      const userContacts = await ContactsFirestoreService.getUserContacts(this.testUserId);
      if (userContacts.length > 0) {
        log.success(`Obtenidos ${userContacts.length} contactos del usuario`);
      }

    } catch (error) {
      log.error(`Error en interfaz IContact: ${error}`);
      throw error;
    }
  }

  private async testGroupInterface(): Promise<void> {
    log.title('4. PROBANDO INTERFAZ IGroup');
    
    try {
      const groupData: Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Grupo de Prueba',
        description: 'Grupo para testing de conexión Firestore',
        contactIds: [],
        userId: this.testUserId,
        color: '#FF5722',
        tags: ['test', 'grupo']
      };

      // Crear grupo
      const groupId = await ContactsFirestoreService.createGroup(groupData);
      this.createdDocuments.push({ collection: 'groups', id: groupId });
      log.success(`Grupo creado con ID: ${groupId}`);

      // Leer grupo
      const group = await ContactsFirestoreService.getGroup(groupId);
      if (group && group.name === 'Grupo de Prueba') {
        log.success('Lectura de grupo exitosa');
      }

      // Actualizar grupo
      await ContactsFirestoreService.updateGroup(groupId, { 
        name: 'Grupo de Prueba Actualizado',
        color: '#4CAF50'
      });
      log.success('Actualización de grupo exitosa');

      // Obtener grupos del usuario
      const userGroups = await ContactsFirestoreService.getUserGroups(this.testUserId);
      if (userGroups.length > 0) {
        log.success(`Obtenidos ${userGroups.length} grupos del usuario`);
      }

    } catch (error) {
      log.error(`Error en interfaz IGroup: ${error}`);
      throw error;
    }
  }

  private async testAdInterface(): Promise<void> {
    log.title('5. PROBANDO INTERFAZ IAd');
    
    try {
      const adData: Omit<IAd, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Anuncio de Prueba',
        description: 'Descripción del anuncio de prueba',
        content: {
          titleAd: 'Título del Anuncio',
          textAd: 'Texto del anuncio de prueba',
          imageUrl: 'https://example.com/test-image.jpg'
        },
        template: 'template-1',
        palette: 'palette-blue',
        size: 'medium',
        userId: this.testUserId,
        status: 'draft'
      };

      // Crear anuncio
      const adId = await FirestoreService.create('ads', adData);
      this.createdDocuments.push({ collection: 'ads', id: adId });
      log.success(`Anuncio creado con ID: ${adId}`);

      // Leer anuncio
      const ad = await FirestoreService.readById('ads', adId);
      if (ad && ad.title === 'Anuncio de Prueba') {
        log.success('Lectura de anuncio exitosa');
      }

      // Actualizar anuncio
      await FirestoreService.update('ads', adId, { 
        status: 'active',
        title: 'Anuncio de Prueba Actualizado'
      });
      log.success('Actualización de anuncio exitosa');

      // Buscar anuncios del usuario
      const userAds = await FirestoreService.findBy('ads', 'userId', '==', this.testUserId);
      if (userAds.length > 0) {
        log.success(`Encontrados ${userAds.length} anuncios del usuario`);
      }

    } catch (error) {
      log.error(`Error en interfaz IAd: ${error}`);
      throw error;
    }
  }

  private async testFormSubmissionInterface(): Promise<void> {
    log.title('6. PROBANDO INTERFAZ IFormSubmission');
    
    try {
      const formSubmissionData: Omit<IFormSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
        strategyId: 'strategy-test-id',
        formType: 'Pedido rápido',
        data: {
          producto: 'Producto de prueba',
          cantidad: 2,
          comentarios: 'Comentarios de prueba'
        },
        contactInfo: {
          name: 'Cliente Test',
          email: 'cliente.test@email.com',
          phone: '+54911111111'
        },
        submittedAt: new Date(),
        processed: false
      };

      // Crear envío de formulario
      const submissionId = await FirestoreService.create('form-submissions', formSubmissionData);
      this.createdDocuments.push({ collection: 'form-submissions', id: submissionId });
      log.success(`Envío de formulario creado con ID: ${submissionId}`);

      // Leer envío
      const submission = await FirestoreService.readById('form-submissions', submissionId);
      if (submission && submission.formType === 'Pedido rápido') {
        log.success('Lectura de envío de formulario exitosa');
      }

      // Actualizar envío
      await FirestoreService.update('form-submissions', submissionId, { 
        processed: true
      });
      log.success('Actualización de envío de formulario exitosa');

      // Buscar envíos por estrategia
      const strategySubmissions = await FirestoreService.findBy(
        'form-submissions', 
        'strategyId', 
        '==', 
        'strategy-test-id'
      );
      if (strategySubmissions.length > 0) {
        log.success(`Encontrados ${strategySubmissions.length} envíos para la estrategia`);
      }

    } catch (error) {
      log.error(`Error en interfaz IFormSubmission: ${error}`);
      throw error;
    }
  }

  private async testAnalyticsInterface(): Promise<void> {
    log.title('7. PROBANDO INTERFAZ IAnalytics');
    
    try {
      const analyticsData: Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'> = {
        strategyId: 'strategy-test-id',
        adId: 'ad-test-id',
        type: 'view',
        timestamp: new Date(),
        metadata: {
          source: 'web',
          device: 'desktop',
          location: 'Argentina'
        },
        userId: this.testUserId
      };

      // Crear registro de analytics
      const analyticsId = await FirestoreService.create('analytics', analyticsData);
      this.createdDocuments.push({ collection: 'analytics', id: analyticsId });
      log.success(`Registro de analytics creado con ID: ${analyticsId}`);

      // Leer registro
      const analytics = await FirestoreService.readById('analytics', analyticsId);
      if (analytics && analytics.type === 'view') {
        log.success('Lectura de analytics exitosa');
      }

      // Crear más registros para pruebas de consulta
      const clickData = { ...analyticsData, type: 'click' as const };
      const clickId = await FirestoreService.create('analytics', clickData);
      this.createdDocuments.push({ collection: 'analytics', id: clickId });

      // Buscar analytics por usuario
      const userAnalytics = await FirestoreService.findBy('analytics', 'userId', '==', this.testUserId);
      if (userAnalytics.length >= 2) {
        log.success(`Encontrados ${userAnalytics.length} registros de analytics del usuario`);
      }

      // Buscar por tipo
      const viewAnalytics = await FirestoreService.readAll('analytics', {
        where: [
          { field: 'userId', operator: '==', value: this.testUserId },
          { field: 'type', operator: '==', value: 'view' }
        ]
      });
      log.success(`Encontrados ${viewAnalytics.length} registros de tipo 'view'`);

    } catch (error) {
      log.error(`Error en interfaz IAnalytics: ${error}`);
      throw error;
    }
  }

  private async testSpecializedServices(): Promise<void> {
    log.title('8. PROBANDO SERVICIOS ESPECIALIZADOS');
    
    try {
      // Probar estadísticas de contactos
      const contactStats = await ContactsFirestoreService.getContactsStats(this.testUserId);
      log.success(`Estadísticas de contactos obtenidas: ${JSON.stringify(contactStats)}`);

      // Probar búsqueda de estrategias activas
      const activeStrategies = await StrategiesFirestoreService.getActiveStrategies(this.testUserId);
      log.success(`Estrategias activas encontradas: ${activeStrategies.length}`);

      // Probar búsqueda de contactos
      const searchResults = await ContactsFirestoreService.searchContacts(this.testUserId, 'Juan');
      log.success(`Resultados de búsqueda de contactos: ${searchResults.length}`);

      // Probar conteo de documentos
      const strategiesCount = await FirestoreService.count('strategies', {
        where: [{ field: 'userId', operator: '==', value: this.testUserId }]
      });
      log.success(`Total de estrategias del usuario: ${strategiesCount}`);

    } catch (error) {
      log.error(`Error en servicios especializados: ${error}`);
      throw error;
    }
  }

  private async cleanup(): Promise<void> {
    log.title('9. LIMPIANDO DATOS DE PRUEBA');
    
    let cleanedCount = 0;
    for (const doc of this.createdDocuments) {
      try {
        await FirestoreService.delete(doc.collection, doc.id);
        cleanedCount++;
      } catch (error) {
        log.warning(`No se pudo eliminar ${doc.collection}/${doc.id}: ${error}`);
      }
    }
    
    log.success(`Limpieza completada: ${cleanedCount}/${this.createdDocuments.length} documentos eliminados`);
  }
}

// Función para ejecutar las pruebas
export const runFirestoreTests = async (): Promise<void> => {
  const tester = new FirestoreConnectionTest();
  await tester.runAllTests();
};

// Ejecutar automáticamente si se llama directamente
if (typeof window === 'undefined') {
  // Estamos en Node.js, ejecutar las pruebas
  runFirestoreTests().catch(console.error);
}

export default FirestoreConnectionTest;
