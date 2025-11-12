# 🧪 Guía de Testing Local - Sistema Premium

## ✅ Lo que ya configuramos

1. ✅ Variables de entorno en `.env.development`
2. ✅ Rutas agregadas en `GPrivateRoutes.tsx`
3. ✅ Links agregados en:
   - Home page (estrella premium arriba a la derecha)
   - Perfil de usuario (botón "Cuenta Premium")

---

## 🚀 Pasos para Probar en Desarrollo Local

### 1️⃣ Iniciar el servidor de desarrollo

```bash
npm run dev
```

Esto iniciará la aplicación en: **http://localhost:5173**

---

### 2️⃣ Acceder a la aplicación

1. Abre tu navegador en: **http://localhost:5173**
2. Inicia sesión con tu cuenta de usuario

---

### 3️⃣ Formas de acceder a la página Premium

**Opción A: Desde el Home**
- En la esquina superior derecha, verás una **estrella ⭐**
- Click en la estrella → Te lleva a `/premium`

**Opción B: Desde el Perfil**
- Click en el ícono de usuario (arriba a la derecha)
- Click en el botón "Cuenta Premium"
- Te lleva a `/premium`

**Opción C: URL directa**
- Navega directamente a: **http://localhost:5173/premium**

---

## 🎨 Lo que verás en la página Premium

### Página Principal (`/premium`)

Verás:
- ✅ Título "Mejora tu experiencia"
- ✅ Comparación de planes:
  - **Plan FREE**: 5 estrategias, 10 publicidades, 50 contactos, 3 grupos
  - **Plan PREMIUM**: ∞ Ilimitado todo
- ✅ Precio: $1500/mes
- ✅ Botón "Obtener Premium - $1500"
- ✅ Beneficios adicionales

### Estado de la cuenta

La página mostrará automáticamente:
- Si eres **FREE**: Verás el botón de upgrade
- Si eres **PREMIUM**: Verás "¡Eres Premium!" con badge

---

## 🧪 Testing en Desarrollo (SIN Mercado Pago Real)

### ⚠️ IMPORTANTE para Testing Local

El botón "Obtener Premium" intentará crear una preferencia de pago, pero:

**PROBLEMA**: Las Firebase Functions NO están desplegadas aún, por lo que:
- ❌ El botón dará error al intentar crear la preferencia
- ❌ No podrás completar el flujo de pago real

### ✅ Lo que SÍ puedes probar en local:

1. **Navegación**:
   - ✅ Acceder a `/premium`
   - ✅ Ver la UI correctamente
   - ✅ Ver la comparación de planes
   - ✅ Ver que el diseño es responsive

2. **Verificación de estado**:
   - ✅ La página verifica automáticamente tu tipo de cuenta en Firestore
   - ✅ Si tienes un documento en `accounts` con `accountType: 'premium'`, verás el badge premium

3. **Hook de límites**:
   - ✅ Puedes probar el hook `usePremiumLimit` en tus componentes
   - ✅ Ver el modal de límite (si lo integras)

---

## 🎭 Simular Usuario Premium (Para Testing)

Si quieres probar cómo se ve la página para un usuario premium:

### Opción 1: Modificar Firestore manualmente

1. Ir a Firebase Console: https://console.firebase.google.com
2. Firestore Database
3. Buscar o crear colección `accounts`
4. Crear un documento con:
   ```json
   {
     "userId": "tu-firebase-uid",
     "accountType": "premium",
     "accountPrice": 1500,
     "premiumId": "test-premium-id",
     "createdAt": "timestamp",
     "updatedAt": "timestamp"
   }
   ```

5. Recargar la página `/premium`
6. Ahora verás "¡Eres Premium!"

### Opción 2: Modificar temporalmente el código

En `src/pages/user/GPremiumPage.tsx`, línea ~36:

```typescript
// Original
const premium = await AccountService.isPremium();

// Para testing, forzar premium:
const premium = true; // <-- Cambiar temporalmente
```

---

## 🔍 Testing del Modal de Límites

Para probar el modal de límites SIN necesidad de Mercado Pago:

### 1. Crear un componente de testing

Crea `src/pages/test/TestPremiumModal.tsx`:

```tsx
import { useState } from 'react';
import { GPremiumLimitModal } from '../../components/GPremiumLimitModal';

export const TestPremiumModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ padding: '50px' }}>
      <h1>Testing Modal de Límite</h1>
      <button onClick={() => setIsOpen(true)}>
        Mostrar Modal
      </button>

      <GPremiumLimitModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        feature="strategies"
        currentCount={5}
        limit={5}
      />
    </div>
  );
};
```

### 2. Agregar ruta temporal

En `GPrivateRoutes.tsx`:

```tsx
import { TestPremiumModal } from '../pages/test/TestPremiumModal';

// Dentro de <Routes>:
<Route path="/test/modal" element={<TestPremiumModal />} />
```

### 3. Probar

Ir a: **http://localhost:5173/test/modal**

---

## 📊 Testing del AccountService

Para probar las verificaciones de límites:

### En la consola del navegador (F12):

```javascript
// Importar el servicio (si está expuesto globalmente)
// O probarlo desde un componente

// Verificar si es premium
const isPremium = await AccountService.isPremium();
console.log('¿Es premium?', isPremium);

// Obtener límites actuales
const limits = await AccountService.getCurrentLimits();
console.log('Límites:', limits);

// Verificar si puede crear estrategia
const canCreate = await AccountService.canCreateStrategy(3);
console.log('¿Puede crear?', canCreate);
```

---

## 🎨 Testing de Estilos

Prueba diferentes tamaños de pantalla:

1. **Desktop**: Vista normal
2. **Tablet**: Abre DevTools (F12) → Toggle device toolbar
3. **Mobile**: Cambia a vista móvil

Verifica:
- ✅ Los planes se adaptan (grid responsive)
- ✅ El modal se ve bien en móvil
- ✅ Botones tienen buen tamaño táctil
- ✅ Textos son legibles

---

## ⚡ Próximos Pasos (Después del Testing Local)

Cuando estés listo para testing real con Mercado Pago:

1. **Obtener Access Token de TEST**:
   - https://www.mercadopago.com.ar/developers/panel/credentials
   - Copiar el Access Token de **TEST** (no producción)

2. **Actualizar `.env.development`**:
   ```
   VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxx-xxxxxx-xxxxxx
   ```

3. **Desplegar Functions**:
   ```bash
   cd functions
   npm run build
   firebase deploy --only functions
   ```

4. **Configurar Webhook** en Mercado Pago

5. **Probar flujo completo** con tarjeta de prueba

---

## 🐛 Troubleshooting

### Error: "Usuario no autenticado"

- **Solución**: Asegúrate de estar logueado con Firebase Auth antes de ir a `/premium`

### Error: "Cannot read property 'accountType' of undefined"

- **Solución**: Crea un documento en la colección `accounts` para tu usuario

### La página se queda cargando

- **Solución**: Verifica que Firebase esté configurado correctamente en `.env.development`

### El modal no se ve

- **Solución**: Verifica que los estilos CSS estén importados correctamente

---

## ✅ Checklist de Testing Local

- [ ] Servidor de desarrollo iniciado (`npm run dev`)
- [ ] Puedes acceder a `/premium`
- [ ] Se ve la comparación de planes
- [ ] La estrella en el home lleva a premium
- [ ] El botón en perfil lleva a premium
- [ ] El diseño es responsive
- [ ] (Opcional) Modal de límite funciona
- [ ] (Opcional) Usuario premium se ve correctamente

---

¡Listo para testing! 🚀

**Siguiente paso**: Iniciar el servidor con `npm run dev` y probar la navegación.
