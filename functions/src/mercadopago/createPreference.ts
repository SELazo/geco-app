import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { preferenceClient, SUCCESS_URL, FAILURE_URL, PENDING_URL } from '../config/mercadopago.config';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Crea una preferencia de pago en Mercado Pago para suscripción Premium
 * Endpoint: POST /createPremiumPreference
 * Body: { userId: string }
 */
export const createPremiumPreference = functions.https.onCall(async (data, context) => {
  try {
    // Verificar autenticación
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
    }

    const userId = context.auth.uid;
    console.log('🎯 Creando preferencia de pago para usuario:', userId);

    // Verificar si el usuario ya tiene una cuenta
    const accountsSnapshot = await db.collection('accounts')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    let accountId: string;
    
    if (accountsSnapshot.empty) {
      // Crear nueva cuenta
      const newAccountRef = await db.collection('accounts').add({
        accountPrice: 0,
        accountType: 'free',
        userId: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      accountId = newAccountRef.id;
      console.log('✅ Cuenta creada:', accountId);
    } else {
      accountId = accountsSnapshot.docs[0].id;
      const account = accountsSnapshot.docs[0].data();
      
      // Verificar si ya es premium activo
      if (account.accountType === 'premium' && account.premiumId) {
        const premiumDoc = await db.collection('premium').doc(account.premiumId).get();
        if (premiumDoc.exists) {
          const premium = premiumDoc.data();
          if (premium && premium.endDate && premium.endDate.toDate() > new Date()) {
            throw new functions.https.HttpsError('already-exists', 'Ya tienes una suscripción premium activa');
          }
        }
      }
    }

    // Obtener información del usuario para el pago
    const userRecord = await admin.auth().getUser(userId);
    const userEmail = userRecord.email || '';
    const userName = userRecord.displayName || 'Usuario GECO';

    // Crear preferencia de pago en Mercado Pago
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: 'premium_monthly',
            title: 'GECO - Suscripción Premium Mensual',
            description: 'Acceso ilimitado a todas las funciones de GECO',
            quantity: 1,
            unit_price: 1500, // $1500 pesos
            currency_id: 'ARS',
          }
        ],
        payer: {
          email: userEmail,
          name: userName,
        },
        back_urls: {
          success: SUCCESS_URL,
          failure: FAILURE_URL,
          pending: PENDING_URL,
        },
        auto_return: 'approved',
        external_reference: accountId, // Guardamos el accountId para identificar luego
        notification_url: `https://us-central1-geco-bf931.cloudfunctions.net/mercadoPagoWebhook`, // Webhook URL
        metadata: {
          userId: userId,
          accountId: accountId,
          type: 'premium_subscription'
        }
      }
    });

    console.log('✅ Preferencia creada:', preference.id);

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    };

  } catch (error: any) {
    console.error('❌ Error creando preferencia:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', error.message || 'Error al crear preferencia de pago');
  }
});
