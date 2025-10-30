# 🚀 Flujo Completo: Estrategia Pública en GECO

## 📊 Tablas en Firestore (gecodb)

### 1. **`strategies`** - Estrategias creadas
```javascript
strategies/
  └─ strategy_1
       ├─ title: "Estrategia #1 - Lanzamiento de Productos"  // ← Aparece arriba
       ├─ formType: "Contacto simple"
       ├─ formConfig: {}
       ├─ userId: "82"
       └─ status: "active"
```

### 2. **`ads`** - Publicidades creadas
```javascript
ads/
  └─ ad_xyz
       ├─ id: "ad_xyz"
       ├─ title: "Pizza Especial 2x1"           // ← Título de la publicidad
       ├─ description: "Llevá dos pizzas..."    // ← Descripción
       ├─ content:
       │    └─ imageUrl: "data:image/jpeg;base64,..."  // ← Imagen
       └─ userId: "82"
```

### 3. **`ads_by_strategy`** - Relación muchos-a-muchos ⭐
```javascript
ads_by_strategy/
  ├─ doc_1
  │    ├─ strategies_strategy_id: 1        // ← ID de la estrategia
  │    ├─ ads_ad_id: 101                   // ← ID de la publicidad
  │    ├─ add_date: Timestamp
  │    └─ deleted_date: null               // ← null = activa
  │
  └─ doc_2
       ├─ strategies_strategy_id: 1
       ├─ ads_ad_id: 102
       ├─ add_date: Timestamp
       └─ deleted_date: null
```

**¿Por qué esta tabla?**
- ✅ Una estrategia puede tener MUCHAS publicidades
- ✅ Una publicidad puede estar en MUCHAS estrategias
- ✅ Permite soft delete (desasociar sin borrar)
- ✅ Permite agregar metadata (orden, fecha, etc.)

### 4. **`forms`** - Respuestas de clientes
```javascript
forms/
  └─ response_abc123
       ├─ form_id: 1                   // ← ID de la estrategia
       ├─ name: "Héctor Hugo"          // ← Nombre del cliente
       ├─ phone: "+54 351 1123123"     // ← Teléfono
       ├─ description: "Me interesa..." // ← Mensaje
       └─ add_date_form: Timestamp
```

---

## 🔄 Flujo Completo (Automático)

```
Usuario visita: https://geco-bf931.web.app/public/strategy/1
    ↓
1. 🔍 Consulta strategies/1
   └─ Obtiene: title, formType
    ↓
2. 🔗 Consulta ads_by_strategy
   └─ WHERE strategies_strategy_id = 1 AND deleted_date = null
   └─ Obtiene: IDs de publicidades asociadas
    ↓
3. 🔍 Consulta ads (con IDs del paso 2)
   └─ Obtiene: title, description, imageUrl de cada publicidad
    ↓
3. 📺 Muestra en pantalla:
   ┌─────────────────────────────────────────┐
   │ Estrategia #1 - Lanzamiento de Productos │  ← strategies.title
   ├─────────────────────────────────────────┤
   │  ┌──────────────┐                       │
   │  │  [IMAGEN]    │  ← ads.imageUrl       │
   │  │  Pizza 2x1   │  ← ads.title          │
   │  │  Llevá dos.. │  ← ads.description    │
   │  └──────────────┘                       │
   │       ← → (carrusel)                    │
   ├─────────────────────────────────────────┤
   │  Contacto simple                        │  ← strategies.formType
   │  Nombre: [____]                         │
   │  Teléfono: [____]                       │
   │  Mensaje: [____]                        │
   │       [Enviar]                          │
   └─────────────────────────────────────────┘
    ↓
4. 💾 Cliente llena y envía formulario
   └─ Guarda en forms:
       ├─ form_id: 1 (ID de la estrategia)
       ├─ name: "Héctor Hugo"
       ├─ phone: "+54 351 1123123"
       ├─ description: "Me interesa..."
       └─ add_date_form: Timestamp
```

---

## 📝 Código Actualizado

### **GPublicStrategyPage.tsx**

#### **1. Imports agregados:**
```typescript
import { StrategiesFirestoreService } from '../../services/external/strategiesFirestoreService';
import { AdsFirestoreService } from '../../services/external/adsFirestoreService';
import { FirestoreService } from '../../services/external/firestoreService';
import { IStrategy, IAd } from '../../interfaces/dtos/external/IFirestore';
```

#### **2. Carga de estrategia y publicidades (useEffect):**
```typescript
useEffect(() => {
  const fetchStrategy = async () => {
    // 1. Cargar estrategia
    const strategy = await StrategiesFirestoreService.getStrategy(id);
    
    // 2. Cargar publicidades asociadas
    const adsPromises = strategy.ads.map(adId => 
      AdsFirestoreService.getAd(String(adId))
    );
    const adsResults = await Promise.all(adsPromises);
    
    // 3. Guardar en estado para mostrar
    setServerStrategy({
      name: strategy.title,       // ← Título de la estrategia
      ads: loadedAds,             // ← Publicidades con imágenes
      form_type: strategy.formType // ← Tipo de formulario
    });
  };
  
  fetchStrategy();
}, [params.id]);
```

#### **3. Envío del formulario (onSubmit):**
```typescript
onSubmit={handleSubmit(async (data) => {
  try {
    // Preparar datos
    const formData = {
      form_id: parseInt(params.id || '0', 10), // ← ID de la estrategia
      name: data.name || '',
      phone: `${data.country_code} ${data.phone}`,
      description: data.message || data.comments || '',
      add_date_form: new Date()
    };
    
    // Guardar en Firestore
    await FirestoreService.create('forms', formData);
    
    // Mostrar mensaje de éxito
    setSnackMsg('¡Gracias! Tu mensaje ha sido enviado.');
    setSnackOpen(true);
    reset({ country_code: data.country_code });
  } catch (error) {
    console.error('❌ Error:', error);
    setSnackMsg('Error al enviar el formulario.');
  }
})}
```

---

## 🎯 Logs en Consola

### **Carga de la página:**
```
🔍 Cargando estrategia pública: 1
✅ Estrategia cargada: Estrategia #1 - Lanzamiento de Productos
📋 IDs de publicidades: ["ad_xyz", "ad_abc"]
✅ 2 publicidades cargadas
```

### **Envío del formulario:**
```
📝 Guardando respuesta en Firestore...
📝 Datos del formulario: {name: "Héctor Hugo", phone: "3511123123", ...}
💾 Guardando en forms: {form_id: 1, name: "Héctor Hugo", ...}
✅ Respuesta guardada exitosamente
```

---

## 🗂️ Vista en Firebase Console

### **Ver estrategias:**
```
https://console.firebase.google.com/project/geco-bf931/firestore
→ gecodb → strategies
```

### **Ver publicidades:**
```
https://console.firebase.google.com/project/geco-bf931/firestore
→ gecodb → ads
```

### **Ver respuestas de clientes:**
```
https://console.firebase.google.com/project/geco-bf931/firestore
→ gecodb → forms
```

---

## ✅ Ejemplo Real

### **Si tienes esta estrategia en Firestore:**

**strategies/1:**
```json
{
  "title": "Estrategia #1 - Lanzamiento de Productos",
  "ads": ["ad_xyz"],
  "formType": "Contacto simple",
  "userId": "82"
}
```

**ads/ad_xyz:**
```json
{
  "title": "Pizza Especial 2x1",
  "description": "Llevá dos pizzas grandes por el precio de una",
  "content": {
    "imageUrl": "data:image/jpeg;base64,/9j/4AAQ..."
  }
}
```

### **El cliente verá:**

```
┌───────────────────────────────────────────────┐
│ Estrategia #1 - Lanzamiento de Productos     │
├───────────────────────────────────────────────┤
│  ┌────────────────────────────┐              │
│  │   [Imagen de la pizza]     │              │
│  │   🍕 Pizza Especial 2x1    │              │
│  │   Llevá dos pizzas...      │              │
│  └────────────────────────────┘              │
├───────────────────────────────────────────────┤
│  Contacto simple                              │
│  Nombre: [Héctor Hugo]                        │
│  Teléfono: [+54] [351 1123123]                │
│  Mensaje: [Me interesa conocer más...]       │
│           [Enviar]                            │
└───────────────────────────────────────────────┘
```

### **Al enviar, se guarda en forms:**

```json
{
  "form_id": 1,
  "name": "Héctor Hugo",
  "phone": "+54 351 1123123",
  "description": "Me interesa conocer más sobre esta promoción",
  "add_date_form": Timestamp(2025, 9, 28, 22, 30, 0)
}
```

---

## 🚦 Fallback Automático

Si la estrategia no existe en Firestore, automáticamente usa datos mock para desarrollo:

```typescript
if (!strategy) {
  console.error('❌ Estrategia no encontrada:', id);
  // Fallback a mock
  const numId = parseInt(id, 10);
  setServerStrategy(mockPublicStrategy(numId));
}
```

Esto permite desarrollo y testing sin necesidad de datos reales.

---

## 📋 Requisitos Previos

Para que funcione, necesitas:

1. ✅ **Estrategia en Firestore** (`strategies` colección)
   - Con campo `title`
   - Con campo `ads` (array de IDs)
   - Con campo `formType`

2. ✅ **Publicidades en Firestore** (`ads` colección)
   - Con campo `title`
   - Con campo `description`
   - Con campo `content.imageUrl`

3. ✅ **Tabla forms creada** (se crea automáticamente al enviar primer formulario)

---

## 🎨 Tipos de Formularios Soportados

Según `strategies.formType`:

1. **"Contacto simple"** → Nombre, Teléfono, Mensaje
2. **"Pedido rápido"** → Nombre, Teléfono, Mensaje  
3. **"Reservas / turnos"** → Servicio, Fecha, Hora, Nombre, Teléfono
4. **"Catálogo"** → Categoría, Cantidad, Nombre, Teléfono, Comentarios

---

## 🔗 URLs de Prueba

```
Estrategia 1: https://geco-bf931.web.app/public/strategy/1
Estrategia 2: https://geco-bf931.web.app/public/strategy/2
Estrategia ABC: https://geco-bf931.web.app/public/strategy/abc123
```

**El ID puede ser:**
- ✅ Numérico: `/public/strategy/1`
- ✅ String: `/public/strategy/abc123xyz`
- ✅ Cualquier ID de Firestore

---

## 📊 Resumen del Sistema

| Tabla | Propósito | Quién crea | Cuándo |
|-------|-----------|------------|--------|
| `strategies` | Estrategias de marketing | Usuario (tú) | Al crear estrategia |
| `ads` | Publicidades | Usuario (tú) | Al crear publicidad |
| `forms` | Respuestas de clientes | Cliente (visitante) | Al enviar formulario |

---

## ✨ Funcionalidad Completa

✅ **Carga automática** de estrategia desde Firestore
✅ **Carga automática** de publicidades asociadas
✅ **Muestra imágenes** reales (base64 desde Firestore)
✅ **Carrusel funcional** con múltiples publicidades
✅ **Formulario dinámico** según tipo configurado
✅ **Guardado automático** en tabla `forms`
✅ **Fallback a mock** si no existe en Firestore
✅ **Logs detallados** para debugging

---

## 🚀 Deploy

**URL:** https://geco-bf931.web.app

**Estado:** ✅ Listo para usar

**Próximos pasos:**
1. Crear estrategias en Firestore
2. Crear publicidades en Firestore
3. Compartir URL `/public/strategy/:id`
4. Ver respuestas en Firebase Console → `forms`
