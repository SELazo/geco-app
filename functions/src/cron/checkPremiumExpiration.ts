import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Función programada que se ejecuta diariamente a las 00:00 UTC
 * Verifica las suscripciones premium vencidas y las revierte a free
 * 
 * Para configurar en Firebase:
 * firebase functions:config:set cron.timezone="America/Argentina/Buenos_Aires"
 */
export const checkPremiumExpiration = functions.pubsub
  .schedule('0 0 * * *') // Ejecutar todos los días a las 00:00 UTC
  .timeZone('America/Argentina/Buenos_Aires') // Zona horaria de Argentina
  .onRun(async (context) => {
    console.log('🕐 Iniciando verificación de suscripciones premium vencidas...');

    try {
      const now = admin.firestore.Timestamp.now();
      
      // Buscar todas las suscripciones premium activas que hayan vencido
      const expiredPremiumsSnapshot = await db.collection('premium')
        .where('status', '==', 'active')
        .where('endDate', '<', now)
        .get();

      console.log(`📊 Encontradas ${expiredPremiumsSnapshot.size} suscripciones vencidas`);

      if (expiredPremiumsSnapshot.empty) {
        console.log('✅ No hay suscripciones vencidas');
        return null;
      }

      // Procesar cada suscripción vencida
      const batch = db.batch();
      const expiredUserIds: string[] = [];

      for (const premiumDoc of expiredPremiumsSnapshot.docs) {
        const premium = premiumDoc.data();
        const userId = premium.userId;
        const premiumId = premiumDoc.id;

        console.log(`⏰ Expirando suscripción premium para usuario: ${userId}`);

        // Marcar premium como expirado
        batch.update(premiumDoc.ref, {
          status: 'expired',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Buscar y actualizar la cuenta del usuario
        const accountsSnapshot = await db.collection('accounts')
          .where('premiumId', '==', premiumId)
          .limit(1)
          .get();

        if (!accountsSnapshot.empty) {
          const accountDoc = accountsSnapshot.docs[0];
          batch.update(accountDoc.ref, {
            accountType: 'free',
            accountPrice: 0,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          expiredUserIds.push(userId);
          console.log(`✅ Cuenta revertida a free para usuario: ${userId}`);
        }
      }

      // Ejecutar todas las actualizaciones en batch
      await batch.commit();

      console.log(`✅ Procesadas ${expiredUserIds.length} suscripciones vencidas`);
      console.log('Usuarios afectados:', expiredUserIds);

      // Opcional: Enviar notificaciones por email a los usuarios
      for (const userId of expiredUserIds) {
        try {
          const userRecord = await admin.auth().getUser(userId);
          if (userRecord.email) {
            // Aquí podrías integrar un servicio de email
            console.log(`📧 Notificar vencimiento a: ${userRecord.email}`);
          }
        } catch (error) {
          console.error(`❌ Error notificando a usuario ${userId}:`, error);
        }
      }

      return { processed: expiredUserIds.length, userIds: expiredUserIds };

    } catch (error) {
      console.error('❌ Error verificando suscripciones vencidas:', error);
      throw error;
    }
  });

/**
 * Función HTTP para verificar manualmente el vencimiento (útil para testing)
 * Endpoint: GET /checkPremiumExpirationManual
 */
export const checkPremiumExpirationManual = functions.https.onRequest(async (req, res) => {
  try {
    console.log('🕐 Verificación manual de suscripciones vencidas...');

    const now = admin.firestore.Timestamp.now();
    
    const expiredPremiumsSnapshot = await db.collection('premium')
      .where('status', '==', 'active')
      .where('endDate', '<', now)
      .get();

    console.log(`📊 Encontradas ${expiredPremiumsSnapshot.size} suscripciones vencidas`);

    if (expiredPremiumsSnapshot.empty) {
      return res.status(200).json({ message: 'No hay suscripciones vencidas', count: 0 });
    }

    const batch = db.batch();
    const results = [];

    for (const premiumDoc of expiredPremiumsSnapshot.docs) {
      const premium = premiumDoc.data();
      const userId = premium.userId;
      const premiumId = premiumDoc.id;

      batch.update(premiumDoc.ref, {
        status: 'expired',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const accountsSnapshot = await db.collection('accounts')
        .where('premiumId', '==', premiumId)
        .limit(1)
        .get();

      if (!accountsSnapshot.empty) {
        const accountDoc = accountsSnapshot.docs[0];
        batch.update(accountDoc.ref, {
          accountType: 'free',
          accountPrice: 0,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        results.push({
          userId,
          premiumId,
          accountId: accountDoc.id,
          endDate: premium.endDate.toDate()
        });
      }
    }

    await batch.commit();

    return res.status(200).json({
      message: 'Suscripciones procesadas exitosamente',
      count: results.length,
      results
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return res.status(500).json({ error: error.message });
  }
});
