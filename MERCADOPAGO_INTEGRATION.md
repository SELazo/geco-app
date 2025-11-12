# 💳 Integración de Mercado Pago - Sistema de Suscripción Premium

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#1-configuración-inicial)
2. [Configurar Credenciales](#2-configurar-credenciales)
3. [Desplegar Firebase Functions](#3-desplegar-firebase-functions)
4. [Configurar Rutas Frontend](#4-configurar-rutas-frontend)
5. [Configurar Webhook en Mercado Pago](#5-configurar-webhook-en-mercado-pago)
6. [Uso en la Aplicación](#6-uso-en-la-aplicación)
7. [Testing](#7-testing)
8. [Verificación Manual](#8-verificación-manual)

---

## 1. Configuración Inicial

### 1.1. Credenciales de Mercado Pago

1. Ve a https://www.mercadopago.com.ar/developers/panel/credentials
2. Copia tu **Access Token** (usa el de prueba primero)
3. Guarda las credenciales de forma segura

### 1.2. Instalar Dependencias (Ya instaladas)

```bash
cd functions
npm install mercadopago
```

---

## 2. Configurar Credenciales

### Opción A: Usar Firebase Config (Recomendado para producción)

```bash
# Configurar access token de Mercado Pago
firebase functions:config:set mercadopago.access_token="TU_ACCESS_TOKEN_AQUI"

# Configurar URL de la app
firebase functions:config:set app.url="https://geco-bf931.web.app"

# Ver configuración actual
firebase functions:config:get
```

### Opción B: Variables de entorno (Para desarrollo local)

Crea un archivo `.env` en la carpeta `functions`:

```env
MERCADOPAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
APP_URL=http://localhost:5173
```

⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` a Git. Ya está en `.gitignore`.

---

## 3. Desplegar Firebase Functions

### 3.1. Compilar TypeScript

```bash
cd functions
npm run build
```

### 3.2. Desplegar Functions

```bash
# Desplegar todas las functions
firebase deploy --only functions

# O desplegar functions específicas
firebase deploy --only functions:createPremiumPreference,functions:mercadoPagoWebhook,functions:checkPremiumExpiration
```

### 3.3. Verificar Deploy

Deberías ver en la consola:

```
✔ functions[createPremiumPreference(us-central1)] Successful create operation
✔ functions[mercadoPagoWebhook(us-central1)] Successful create operation
✔ functions[checkPremiumExpiration(us-central1)] Successful create operation
```

Las URLs serán:
- `https://us-central1-geco-bf931.cloudfunctions.net/createPremiumPreference`
- `https://us-central1-geco-bf931.cloudfunctions.net/mercadoPagoWebhook`
- `https://us-central1-geco-bf931.cloudfunctions.net/checkPremiumExpiration`

---

## 4. Configurar Rutas Frontend

### 4.1. Agregar rutas en tu Router

Edita `src/routes/GPrivateRoutes.tsx` o tu archivo de rutas principal:

```typescript
import { GPremiumPage } from '../pages/user/GPremiumPage';
import { GPremiumSuccessPage } from '../pages/user/GPremiumSuccessPage';
import { GPremiumFailurePage } from '../pages/user/GPremiumFailurePage';
import { GPremiumPendingPage } from '../pages/user/GPremiumPendingPage';

// Dentro de tus routes:
<Route path="/premium" element={<GPremiumPage />} />
<Route path="/premium/success" element={<GPremiumSuccessPage />} />
<Route path="/premium/failure" element={<GPremiumFailurePage />} />
<Route path="/premium/pending" element={<GPremiumPendingPage />} />
```

### 4.2. Agregar link en tu menú/navbar

```jsx
<Link to="/premium">
  <button>Cuenta Premium</button>
</Link>
```

---

## 5. Configurar Webhook en Mercado Pago

### 5.1. Ir al Panel de Desarrolladores

1. Ve a https://www.mercadopago.com.ar/developers/panel/notifications/webhooks
2. Click en "Configurar notificaciones"

### 5.2. Agregar URL del Webhook

**URL:** `https://us-central1-geco-bf931.cloudfunctions.net/mercadoPagoWebhook`

**Eventos a escuchar:**
- ✅ Pagos (payment)
- ✅ Planes de suscripción (plan)
- ✅ Suscripciones (subscription)

### 5.3. Guardar y Verificar

Mercado Pago enviará un request de prueba. Si tu función está desplegada, debería responder con `200 OK`.

---

## 6. Uso en la Aplicación

### 6.1. Verificar Límites al Crear Estrategia

Ejemplo en `GStrategyResumePage.tsx`:

```typescript
import { AccountService } from '../../services/external/accountService';

const handleSubmit = async () => {
  // Verificar si puede crear más estrategias
  const canCreate = await AccountService.canCreateStrategy(currentStrategiesCount);
  
  if (!canCreate) {
    const message = AccountService.getLimitMessage('strategies');
    alert(message);
    
    // Redirigir a página premium
    navigate('/premium');
    return;
  }

  // Continuar con la creación...
};
```

### 6.2. Mostrar Badge Premium

```typescript
import { AccountService } from '../../services/external/accountService';

const MyComponent = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      const premium = await AccountService.isPremium();
      setIsPremium(premium);
    };
    checkPremium();
  }, []);

  return (
    <div>
      {isPremium && <span>✨ PREMIUM</span>}
    </div>
  );
};
```

### 6.3. Obtener Límites Actuales

```typescript
const limits = await AccountService.getCurrentLimits();

console.log(limits);
// {
//   strategies: 5 (o -1 si es ilimitado),
//   images: 10 (o -1 si es ilimitado),
//   contacts: 50 (o -1 si es ilimitado),
//   groups: 3 (o -1 si es ilimitado)
// }
```

---

## 7. Testing

### 7.1. Usar Cuenta de Prueba de Mercado Pago

Mercado Pago proporciona tarjetas de prueba:

**Tarjeta APROBADA:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Tarjeta RECHAZADA:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Fecha: Cualquier fecha futura

### 7.2. Flujo de Testing

1. **Ir a la página Premium:**
   ```
   http://localhost:5173/premium
   ```

2. **Click en "Obtener Premium"**
   - Se creará la preferencia
   - Se redirigirá a Mercado Pago (modo sandbox)

3. **Completar el pago con tarjeta de prueba**
   - Usar los datos de la tarjeta de prueba
   - Confirmar el pago

4. **Verificar redirección:**
   - Debería volver a `/premium/success`
   - El webhook procesa el pago en background

5. **Verificar en Firestore:**
   - Colección `premium`: Debe aparecer un nuevo documento
   - Colección `accounts`: El `accountType` debe ser `'premium'`

6. **Verificar en la app:**
   - Ir a `/premium` nuevamente
   - Debería ver "¡Eres Premium!"

---

## 8. Verificación Manual

### 8.1. Verificar Vencimientos Manualmente

Puedes ejecutar la verificación de vencimientos sin esperar al cron:

```bash
curl https://us-central1-geco-bf931.cloudfunctions.net/checkPremiumExpirationManual
```

O desde el navegador:
```
https://us-central1-geco-bf931.cloudfunctions.net/checkPremiumExpirationManual
```

### 8.2. Ver Logs de Firebase

```bash
firebase functions:log --only createPremiumPreference
firebase functions:log --only mercadoPagoWebhook
firebase functions:log --only checkPremiumExpiration
```

### 8.3. Testing del Webhook Localmente

Para probar el webhook localmente, usa Firebase Emulators:

```bash
cd functions
npm run serve
```

Luego puedes simular una notificación:

```bash
curl -X POST http://localhost:5001/geco-bf931/us-central1/mercadoPagoWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "12345",
    "type": "payment",
    "data": { "id": "67890" }
  }'
```

---

## 🎯 Flujo Completo

### Usuario FREE → PREMIUM

1. Usuario entra a `/premium`
2. Ve plan FREE (5 estrategias) vs PREMIUM (ilimitado)
3. Click en "Obtener Premium - $1500"
4. Se ejecuta `createPremiumPreference` (Firebase Function)
5. Se redirige a Mercado Pago
6. Usuario completa el pago
7. Mercado Pago llama al webhook `mercadoPagoWebhook`
8. Webhook crea documento en `premium` collection
9. Webhook actualiza `accounts` → `accountType: 'premium'`
10. Usuario es redirigido a `/premium/success`
11. Usuario puede usar funciones ilimitadas

### Verificación Diaria Automática

1. Cada día a las 00:00 (Argentina) se ejecuta `checkPremiumExpiration`
2. Busca suscripciones con `endDate` < hoy
3. Marca suscripción como `status: 'expired'`
4. Actualiza cuenta → `accountType: 'free'`
5. Usuario vuelve a tener límites FREE

---

## 🛠️ Troubleshooting

### Problema: "Usuario no autenticado"

**Solución:** Asegúrate de que el usuario esté logueado con Firebase Auth antes de llamar a `createPremiumPreference`.

### Problema: Webhook no recibe notificaciones

**Solución:** 
1. Verifica que la URL del webhook esté correctamente configurada en Mercado Pago
2. Verifica que la función esté desplegada: `firebase functions:list`
3. Revisa los logs: `firebase functions:log --only mercadoPagoWebhook`

### Problema: Pago aprobado pero cuenta sigue siendo FREE

**Solución:**
1. Revisa los logs del webhook para ver si hubo errores
2. Verifica en Firestore si se creó el documento en `premium`
3. Verifica que el `accountId` en metadata coincida con el de Firestore

### Problema: Tarjeta de prueba no funciona

**Solución:** Asegúrate de estar usando el Access Token de **PRUEBA** (no el de producción) en Firebase Config.

---

## 📊 Estructura de Firestore

### Colección: `accounts`

```json
{
  "accountId": "ABC123",
  "accountPrice": 1500,
  "accountType": "premium",
  "premiumId": "XYZ789",
  "userId": "firebase_user_uid",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Colección: `premium`

```json
{
  "userId": "firebase_user_uid",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-31T00:00:00Z",
  "paidDate": "2025-01-01T00:00:00Z",
  "price": 1500,
  "status": "active",
  "mercadoPagoPaymentId": "123456789",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

## 🚀 Pasar a Producción

### 1. Cambiar a Credenciales de Producción

```bash
firebase functions:config:set mercadopago.access_token="TU_ACCESS_TOKEN_PRODUCCION"
```

### 2. Actualizar URL de la App

```bash
firebase functions:config:set app.url="https://geco-bf931.web.app"
```

### 3. Redesplegar Functions

```bash
firebase deploy --only functions
```

### 4. Actualizar Webhook en Mercado Pago

Cambiar la URL del webhook a la de producción.

### 5. Testing en Producción

Realizar una compra real con una tarjeta verdadera para verificar que todo funciona.

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de Firebase Functions
2. Verifica la configuración en Mercado Pago
3. Consulta la documentación oficial: https://www.mercadopago.com.ar/developers

---

## ✅ Checklist de Implementación

- [ ] Credenciales de Mercado Pago configuradas
- [ ] Firebase Functions desplegadas
- [ ] Webhook configurado en Mercado Pago
- [ ] Rutas agregadas al router de React
- [ ] Link "Cuenta Premium" agregado al menú
- [ ] Testing con tarjeta de prueba exitoso
- [ ] Verificación de límites implementada en estrategias
- [ ] Verificación de límites implementada en publicidades
- [ ] Verificación de límites implementada en contactos
- [ ] Función de verificación diaria activa
- [ ] Testing completo del flujo

---

¡Implementación completa! 🎉
