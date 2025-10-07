/**
 * Prueba rápida de conexión Firestore
 * Para ejecutar en la consola del navegador
 */

import { FirestoreService } from '../services/external/firestoreService';
import { StrategiesFirestoreService } from '../services/external/strategiesFirestoreService';
import { ContactsFirestoreService } from '../services/external/contactsFirestoreService';
import AdsFirestoreService from '../services/external/adsFirestoreService';
import FormSubmissionsFirestoreService from '../services/external/formSubmissionsFirestoreService';
import AnalyticsFirestoreService from '../services/external/analyticsFirestoreService';
import { IStrategy, IContact, IGroup, IAd, IFormSubmission, IAnalytics } from '../interfaces/dtos/external/IFirestore';

// Función para prueba rápida de conexión
const quickConnectionTest = async (): Promise<void> => {
  console.log('🔥 Iniciando prueba rápida de Firestore...');
  
  const testUserId = 'quick-test-' + Date.now();
  const createdDocs: { collection: string; id: string }[] = [];
  
  try {
    // 1. Prueba básica de conexión
    console.log('1️⃣ Probando conexión básica...');
    const testDoc = await FirestoreService.create('test-quick', {
      message: 'Quick test',
      timestamp: new Date(),
      userId: testUserId
    });
    createdDocs.push({ collection: 'test-quick', id: testDoc });
    console.log('✅ Conexión básica exitosa - ID:', testDoc);
    
    // 2. Prueba de estrategia
    console.log('2️⃣ Probando interfaz IStrategy...');
    const strategyData: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Estrategia Quick Test',
      description: 'Prueba rápida de estrategia',
      ads: [],
      groups: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      periodicity: 'daily',
      schedule: '10:00',
      status: 'draft',
      userId: testUserId
    };
    
    const strategyId = await StrategiesFirestoreService.createStrategy(strategyData);
    createdDocs.push({ collection: 'strategies', id: strategyId });
    console.log('✅ Estrategia creada - ID:', strategyId);
    
    // 3. Prueba de contacto
    console.log('3️⃣ Probando interfaz IContact...');
    const contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Test Contact',
      email: 'test@quicktest.com',
      phone: '+1234567890',
      groups: [],
      userId: testUserId,
      status: 'active'
    };
    
    const contactId = await ContactsFirestoreService.createContact(contactData);
    createdDocs.push({ collection: 'contacts', id: contactId });
    console.log('✅ Contacto creado - ID:', contactId);
    
    // 4. Prueba de grupo
    console.log('4️⃣ Probando interfaz IGroup...');
    const groupData: Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Quick Test Group',
      description: 'Grupo de prueba rápida',
      contactIds: [contactId],
      userId: testUserId
    };
    
    const groupId = await ContactsFirestoreService.createGroup(groupData);
    createdDocs.push({ collection: 'groups', id: groupId });
    console.log('✅ Grupo creado - ID:', groupId);
    
    // 5. Prueba de lectura
    console.log('5️⃣ Probando operaciones de lectura...');
    const readStrategy = await StrategiesFirestoreService.getStrategy(strategyId);
    const readContact = await ContactsFirestoreService.getContact(contactId);
    const userStrategies = await StrategiesFirestoreService.getUserStrategies(testUserId);
    
    console.log('✅ Lectura exitosa:', {
      strategy: readStrategy?.title,
      contact: readContact?.name,
      userStrategiesCount: userStrategies.length
    });
    
    // 6. Prueba de actualización
    console.log('6️⃣ Probando operaciones de actualización...');
    await StrategiesFirestoreService.updateStrategy(strategyId, { 
      status: 'active',
      title: 'Estrategia Quick Test - Actualizada'
    });
    await ContactsFirestoreService.updateContact(contactId, {
      name: 'Test Contact - Updated'
    });
    console.log('✅ Actualizaciones exitosas');
    
    // 7. Prueba de consultas avanzadas
    console.log('7️⃣ Probando consultas avanzadas...');
    const activeStrategies = await StrategiesFirestoreService.getActiveStrategies(testUserId);
    const contactStats = await ContactsFirestoreService.getContactsStats(testUserId);
    
    console.log('✅ Consultas avanzadas exitosas:', {
      activeStrategies: activeStrategies.length,
      contactStats
    });
    
    console.log('🎉 TODAS LAS PRUEBAS EXITOSAS!');
    console.log('📊 Resumen:', {
      documentosCreados: createdDocs.length,
      interfacesProbadas: ['IStrategy', 'IContact', 'IGroup'],
      operacionesProbadas: ['Create', 'Read', 'Update', 'Query']
    });
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    throw error;
  } finally {
    // Limpiar documentos de prueba
    console.log('🧹 Limpiando documentos de prueba...');
    for (const doc of createdDocs) {
      try {
        await FirestoreService.delete(doc.collection, doc.id);
        console.log(`✅ Eliminado: ${doc.collection}/${doc.id}`);
      } catch (error) {
        console.warn(`⚠️ No se pudo eliminar: ${doc.collection}/${doc.id}`, error);
      }
    }
    console.log('🏁 Limpieza completada');
  }
};

// Función para probar una interfaz específica
const testSpecificInterface = async (interfaceName: string): Promise<void> => {
  const testUserId = 'interface-test-' + Date.now();
  
  console.log(`🔍 Probando interfaz: ${interfaceName}`);
  
  try {
    switch (interfaceName.toLowerCase()) {
      case 'strategy':
      case 'istrategy':
        const strategyData: Omit<IStrategy, 'id' | 'createdAt' | 'updatedAt'> = {
          title: 'Test Strategy Interface',
          ads: [],
          groups: [],
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          periodicity: 'weekly',
          schedule: '14:00',
          status: 'draft',
          userId: testUserId
        };
        
        const strategyId = await StrategiesFirestoreService.createStrategy(strategyData);
        console.log('✅ IStrategy - Creación exitosa:', strategyId);
        
        const strategy = await StrategiesFirestoreService.getStrategy(strategyId);
        console.log('✅ IStrategy - Lectura exitosa:', strategy?.title);
        
        await StrategiesFirestoreService.updateStrategy(strategyId, { status: 'active' });
        console.log('✅ IStrategy - Actualización exitosa');
        
        await StrategiesFirestoreService.deleteStrategy(strategyId);
        console.log('✅ IStrategy - Eliminación exitosa');
        break;
        
      case 'contact':
      case 'icontact':
        const contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
          name: 'Test Contact Interface',
          email: 'test.interface@test.com',
          groups: [],
          userId: testUserId,
          status: 'active'
        };
        
        const contactId = await ContactsFirestoreService.createContact(contactData);
        console.log('✅ IContact - Creación exitosa:', contactId);
        
        const contact = await ContactsFirestoreService.getContact(contactId);
        console.log('✅ IContact - Lectura exitosa:', contact?.name);
        
        await ContactsFirestoreService.updateContact(contactId, { name: 'Updated Test Contact' });
        console.log('✅ IContact - Actualización exitosa');
        
        await ContactsFirestoreService.deleteContact(contactId);
        console.log('✅ IContact - Eliminación exitosa');
        break;
        
      default:
        console.warn('⚠️ Interfaz no reconocida. Interfaces disponibles: strategy, contact');
    }
  } catch (error) {
    console.error(`❌ Error probando ${interfaceName}:`, error);
    throw error;
  }
};

// Función para verificar configuración
const checkFirestoreConfig = (): void => {
  console.log('🔧 Verificando configuración de Firestore...');
  
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  
  console.log('📋 Configuración actual:', config);
  
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ Todas las variables de entorno están configuradas');
  } else {
    console.warn('⚠️ Variables de entorno faltantes:', missingVars);
  }
};

// Exportar funciones para uso en consola
(window as any).quickConnectionTest = quickConnectionTest;
(window as any).testSpecificInterface = testSpecificInterface;
(window as any).checkFirestoreConfig = checkFirestoreConfig;

console.log('🚀 Funciones de prueba Firestore cargadas:');
console.log('- quickConnectionTest() - Prueba completa rápida');
console.log('- testSpecificInterface("strategy") - Prueba interfaz específica');
console.log('- checkFirestoreConfig() - Verificar configuración');

export { quickConnectionTest, testSpecificInterface, checkFirestoreConfig };
