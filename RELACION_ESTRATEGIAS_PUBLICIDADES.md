# 🔗 Relación: Estrategias ↔ Publicidades

## 📊 Diagrama de Relación

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│   strategies        │         │  ads_by_strategy     │         │       ads           │
│   (Estrategias)     │         │  (Relación N:M)      │         │   (Publicidades)    │
├─────────────────────┤         ├──────────────────────┤         ├─────────────────────┤
│ id: 1               │◄───────┤ strategies_strategy_id│         │ id: 101             │
│ title: "Promo 2025" │        │ ads_ad_id             ├────────►│ title: "Pizza 2x1"  │
│ formType: "Contacto"│        │ add_date              │         │ description: "..."  │
│ userId: "82"        │        │ deleted_date: null    │         │ imageUrl: "..."     │
└─────────────────────┘        └──────────────────────┘         └─────────────────────┘
                                        ▲                                  ▲
                                        │                                  │
                                        │         ┌──────────────────────┐│
                                        │         │  ads_by_strategy     ││
                                        │         ├──────────────────────┤│
                                        └─────────┤ strategies_strategy_id││
                                                  │ ads_ad_id: 102       ├┘
                                                  │ add_date             │
                                                  │ deleted_date: null   │
                                                  └──────────────────────┘
                                                           ▼
                                                  ┌─────────────────────┐
                                                  │       ads           │
                                                  ├─────────────────────┤
                                                  │ id: 102             │
                                                  │ title: "Café"       │
                                                  │ description: "..."  │
                                                  │ imageUrl: "..."     │
                                                  └─────────────────────┘
```

---

## 💡 ¿Por qué Muchos-a-Muchos (N:M)?

### **Escenario Real:**

#### **Estrategia 1: "Promoción Verano"**
- Pizza 2x1 ✓
- Café Premium ✓
- Helados 30% OFF ✓

#### **Estrategia 2: "Navidad 2025"**
- Pizza 2x1 ✓ ← La misma publicidad
- Vino Tinto 2x1 ✓
- Postres Navideños ✓

#### **Estrategia 3: "Fin de Semana"**
- Pizza 2x1 ✓ ← La misma publicidad
- Bebidas Gratis ✓

**Resultado:** La publicidad "Pizza 2x1" está en **3 estrategias diferentes** 🎯

---

## 🔍 Consultas SQL Equivalentes

### **1. Ver publicidades de una estrategia:**
```sql
-- SQL tradicional
SELECT ads.*
FROM ads
JOIN ads_by_strategy ON ads.id = ads_by_strategy.ads_ad_id
WHERE ads_by_strategy.strategies_strategy_id = 1
  AND ads_by_strategy.deleted_date IS NULL;
```

```javascript
// Firestore (lo que hace el código ahora)
// Paso 1: Obtener relaciones
const relations = FirestoreService.readAll('ads_by_strategy', {
  where: [
    { field: 'strategies_strategy_id', operator: '==', value: 1 },
    { field: 'deleted_date', operator: '==', value: null }
  ]
});

// Paso 2: Obtener publicidades
const adIds = relations.map(r => r.ads_ad_id);
const ads = await Promise.all(
  adIds.map(id => AdsFirestoreService.getAd(id))
);
```

### **2. Ver estrategias de una publicidad:**
```sql
-- SQL tradicional
SELECT strategies.*
FROM strategies
JOIN ads_by_strategy ON strategies.id = ads_by_strategy.strategies_strategy_id
WHERE ads_by_strategy.ads_ad_id = 101
  AND ads_by_strategy.deleted_date IS NULL;
```

```javascript
// Firestore
const relations = FirestoreService.readAll('ads_by_strategy', {
  where: [
    { field: 'ads_ad_id', operator: '==', value: 101 },
    { field: 'deleted_date', operator: '==', value: null }
  ]
});

const strategyIds = relations.map(r => r.strategies_strategy_id);
const strategies = await Promise.all(
  strategyIds.map(id => StrategiesFirestoreService.getStrategy(id))
);
```

---

## 🎨 Ejemplo Real con Datos

### **Base de datos:**

#### **strategies:**
| id | title | formType |
|----|-------|----------|
| 1 | Promoción Verano | Contacto simple |
| 2 | Navidad 2025 | Pedido rápido |

#### **ads:**
| id | title | description |
|----|-------|-------------|
| 101 | Pizza 2x1 | Llevá dos pizzas... |
| 102 | Café Premium | Descubrí nuestro... |
| 103 | Vino Tinto 2x1 | Vino tinto... |

#### **ads_by_strategy:**
| strategies_strategy_id | ads_ad_id | deleted_date |
|------------------------|-----------|--------------|
| 1 | 101 | null |
| 1 | 102 | null |
| 2 | 101 | null |
| 2 | 103 | null |

---

### **Resultado de consultas:**

#### **"¿Qué publicidades tiene la Estrategia 1?"**
```javascript
// Consulta:
WHERE strategies_strategy_id = 1 AND deleted_date = null

// Resultado:
[
  { id: 101, title: "Pizza 2x1", description: "..." },
  { id: 102, title: "Café Premium", description: "..." }
]
```

#### **"¿En qué estrategias está la Publicidad 101 (Pizza)?"**
```javascript
// Consulta:
WHERE ads_ad_id = 101 AND deleted_date = null

// Resultado:
[
  { id: 1, title: "Promoción Verano", formType: "Contacto simple" },
  { id: 2, title: "Navidad 2025", formType: "Pedido rápido" }
]
```

---

## 🔄 Flujo en tu UI (según la imagen)

### **Paso: "Publicidades" en crear estrategia**

```
┌──────────────────────────────────────┐
│  Crear nueva Estrategia              │
│  Paso 4 de 6: Publicidades           │
├──────────────────────────────────────┤
│                                      │
│  Seleccioná las publicidades:       │
│                                      │
│  ☑ Pizza 2x1                 [×]    │ ← ads.title
│  ☑ Café Premium              [×]    │ ← ads.title
│  ☐ Helados 30% OFF           [×]    │
│  ☐ Vino Tinto 2x1            [×]    │
│                                      │
│     [Atrás]            [Siguiente]   │
└──────────────────────────────────────┘

Al hacer clic en "Siguiente":
↓
Se crean documentos en ads_by_strategy:
- doc1: { strategies_strategy_id: 1, ads_ad_id: 101, deleted_date: null }
- doc2: { strategies_strategy_id: 1, ads_ad_id: 102, deleted_date: null }
```

---

## ✅ Ventajas de esta Estructura

| Característica | Sin ads_by_strategy | Con ads_by_strategy |
|----------------|---------------------|---------------------|
| **Reutilizar publicidad** | ❌ Hay que duplicar | ✅ Se reutiliza |
| **Desasociar sin borrar** | ❌ Borrado permanente | ✅ Soft delete (deleted_date) |
| **Metadata adicional** | ❌ No se puede | ✅ Fecha, orden, prioridad |
| **Consultas flexibles** | ❌ Limitadas | ✅ Bidireccionales |
| **Histórico** | ❌ Se pierde | ✅ Se mantiene |

---

## 🗑️ Soft Delete

**¿Qué pasa al desasociar una publicidad?**

```javascript
// No se borra, se marca como eliminada:
{
  strategies_strategy_id: 1,
  ads_ad_id: 101,
  add_date: Timestamp(2025, 8, 15),
  deleted_date: Timestamp(2025, 10, 20)  // ← Fecha de desasociación
}

// La consulta la ignora:
WHERE deleted_date = null  // ← Solo trae las activas
```

**Ventajas:**
- ✅ Mantiene histórico
- ✅ Se puede "revertir" poniendo `deleted_date = null`
- ✅ Análisis de qué publicidades se usaron

---

## 📝 Código Actualizado

### **GPublicStrategyPage.tsx:**

```typescript
// 1. Cargar estrategia
const strategy = await StrategiesFirestoreService.getStrategy(id);

// 2. Obtener relaciones de ads_by_strategy
const relations = await FirestoreService.readAll('ads_by_strategy', {
  where: [
    { field: 'strategies_strategy_id', operator: '==', value: parseInt(id, 10) },
    { field: 'deleted_date', operator: '==', value: null }
  ]
});

// 3. Obtener IDs de publicidades
const adIds = relations.map(rel => String(rel.ads_ad_id));

// 4. Cargar publicidades
const adsPromises = adIds.map(adId => AdsFirestoreService.getAd(adId));
const ads = await Promise.all(adsPromises);

// 5. Mostrar en pantalla
setServerStrategy({
  name: strategy.title,
  ads: ads,
  form_type: strategy.formType
});
```

---

## 🎯 Resumen

### **Estructura:**
```
strategies (1) ←→ (N) ads_by_strategy (N) ←→ (1) ads
```

### **Relación:**
- Una estrategia tiene MUCHAS publicidades
- Una publicidad está en MUCHAS estrategias
- La tabla `ads_by_strategy` conecta ambas

### **Beneficios:**
- ✅ Flexibilidad
- ✅ Reutilización
- ✅ Soft delete
- ✅ Histórico
- ✅ Metadata adicional

### **Lo que hace tu código ahora:**
1. Consulta `strategies` para obtener info de la estrategia
2. Consulta `ads_by_strategy` para obtener IDs de publicidades asociadas
3. Consulta `ads` para obtener detalles de cada publicidad
4. Muestra todo en la página pública
5. Guarda respuestas del formulario en `forms`

**¡Sistema completo y robusto!** 🚀
