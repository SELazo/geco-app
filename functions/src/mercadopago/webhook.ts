import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { paymentClient } from '../config/mercadopago.config';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Webhook para recibir notificaciones de Mercado Pago
 * Se ejecuta cuando un pago cambia de estado
 */
export const mercadoPagoWebhook = functions.https.onRequest(async (req, res) => {
  try {
    console.log('📨 Webhook recibido de Mercado Pago');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    // Mercado Pago puede enviar el ID en query o body
    const paymentId = req.query.id || req.query['data.id'] || req.body?.data?.id;
    const topic = req.query.topic || req.body?.type;

    if (!paymentId || !topic) {
      console.warn('⚠️ Notificación sin paymentId o topic');
      return res.status(200).send('OK'); // Responder 200 para que MP no reintente
    }

    // Solo procesar notificaciones de pagos
    if (topic !== 'payment') {
      console.log('ℹ️ Notificación ignorada, topic:', topic);
      return res.status(200).send('OK');
    }

    console.log('🔍 Procesando pago ID:', paymentId);

    // Obtener información del pago desde Mercado Pago
    const payment = await paymentClient.get({ id: String(paymentId) });

    console.log('💳 Estado del pago:', payment.status);
    console.log('💳 Metadata:', payment.metadata);

    // Verificar que el pago fue aprobado
    if (payment.status !== 'approved') {
      console.log('⏳ Pago no aprobado aún, estado:', payment.status);
      return res.status(200).send('OK');
    }

    // Obtener metadata del pago
    const accountId = payment.external_reference;
    const userId = payment.metadata?.user_id || payment.metadata?.userId;

    if (!accountId || !userId) {
      console.error('❌ Pago sin accountId o userId en metadata');
      return res.status(200).send('OK');
    }

    console.log('✅ Pago aprobado para cuenta:', accountId, 'usuario:', userId);

    // Verificar si ya procesamos este pago
    const existingPremium = await db.collection('premium')
      .where('mercadoPagoPaymentId', '==', String(paymentId))
      .limit(1)
      .get();

    if (!existingPremium.empty) {
      console.log('ℹ️ Pago ya procesado anteriormente');
      return res.status(200).send('OK');
    }

    // Calcular fechas de suscripción (30 días)
    const now = new Date();
    const startDate = now;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30); // 30 días de suscripción

    // Crear documento en colección premium
    const premiumRef = await db.collection('premium').add({
      userId: userId,
      startDate: admin.firestore.Timestamp.fromDate(startDate),
      endDate: admin.firestore.Timestamp.fromDate(endDate),
      paidDate: admin.firestore.Timestamp.fromDate(now),
      price: payment.transaction_amount || 1500,
      status: 'active',
      mercadoPagoPaymentId: String(paymentId),
      mercadoPagoSubscriptionId: payment.metadata?.preapproval_id || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Premium creado:', premiumRef.id);

    // Actualizar cuenta del usuario
    await db.collection('accounts').doc(accountId).update({
      accountType: 'premium',
      accountPrice: payment.transaction_amount || 1500,
      premiumId: premiumRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Cuenta actualizada a premium');

    // Opcional: Enviar notificación al usuario
    try {
      const userRecord = await admin.auth().getUser(userId);
      if (userRecord.email) {
        // Aquí podrías enviar un email de confirmación
        console.log('📧 Email de confirmación pendiente para:', userRecord.email);
      }
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
    }

    return res.status(200).json({ success: true, premiumId: premiumRef.id });

  } catch (error: any) {
    console.error('❌ Error procesando webhook:', error);
    // Importante: siempre responder 200 para que Mercado Pago no reintente constantemente
    return res.status(200).json({ success: false, error: error.message });
  }
});
