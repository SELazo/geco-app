# 🔒 Reglas de Seguridad de Firestore para Sistema Premium

## Reglas a Agregar en `firestore.rules`

Agrega estas reglas a tu archivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ======================================
    // COLECCIÓN: accounts
    // ======================================
    match /accounts/{accountId} {
      // Permitir lectura solo al dueño de la cuenta
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Permitir creación solo si el userId coincide con el usuario autenticado
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Permitir actualización solo al dueño
      // IMPORTANTE: Las Firebase Functions tienen permisos de admin, no se ven afectadas por estas reglas
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // No permitir eliminación desde el cliente (solo desde Functions si es necesario)
      allow delete: if false;
    }
    
    // ======================================
    // COLECCIÓN: premium
    // ======================================
    match /premium/{premiumId} {
      // Permitir lectura solo al dueño de la suscripción
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // NO permitir creación desde el cliente (solo desde webhook)
      allow create: if false;
      
      // NO permitir actualización desde el cliente (solo desde Functions)
      allow update: if false;
      
      // NO permitir eliminación desde el cliente
      allow delete: if false;
    }
    
    // ======================================
    // COLECCIÓN: strategies (Con límites)
    // ======================================
    match /strategies/{strategyId} {
      // Función auxiliar para verificar si el usuario es premium
      function isPremiumUser() {
        let accountQuery = get(/databases/$(database)/documents/accounts/$(request.auth.uid));
        return accountQuery.data.accountType == 'premium';
      }
      
      // Función auxiliar para contar estrategias del usuario
      function countUserStrategies() {
        return get(/databases/$(database)/documents/strategies)
                  .data.where('userId', '==', request.auth.uid).size();
      }
      
      // Permitir lectura solo de las propias estrategias
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Permitir creación solo si:
      // - Es premium (ilimitado), O
      // - Es free y tiene menos de 5 estrategias
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid &&
                       (isPremiumUser() || countUserStrategies() < 5);
      
      // Permitir actualización solo al dueño
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // Permitir eliminación solo al dueño
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // ======================================
    // COLECCIÓN: ads (Con límites)
    // ======================================
    match /ads/{adId} {
      function isPremiumUser() {
        let accountQuery = get(/databases/$(database)/documents/accounts/$(request.auth.uid));
        return accountQuery.data.accountType == 'premium';
      }
      
      function countUserAds() {
        return get(/databases/$(database)/documents/ads)
                  .data.where('userId', '==', request.auth.uid).size();
      }
      
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid &&
                       (isPremiumUser() || countUserAds() < 10);
      
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // ======================================
    // COLECCIÓN: contacts (Con límites)
    // ======================================
    match /contacts/{contactId} {
      function isPremiumUser() {
        let accountQuery = get(/databases/$(database)/documents/accounts/$(request.auth.uid));
        return accountQuery.data.accountType == 'premium';
      }
      
      function countUserContacts() {
        return get(/databases/$(database)/documents/contacts)
                  .data.where('userId', '==', request.auth.uid).size();
      }
      
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid &&
                       (isPremiumUser() || countUserContacts() < 50);
      
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // ======================================
    // COLECCIÓN: groups (Con límites)
    // ======================================
    match /groups/{groupId} {
      function isPremiumUser() {
        let accountQuery = get(/databases/$(database)/documents/accounts/$(request.auth.uid));
        return accountQuery.data.accountType == 'premium';
      }
      
      function countUserGroups() {
        return get(/databases/$(database)/documents/groups)
                  .data.where('userId', '==', request.auth.uid).size();
      }
      
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid &&
                       (isPremiumUser() || countUserGroups() < 3);
      
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## ⚠️ IMPORTANTE: Limitaciones de las Reglas de Firestore

Las reglas de Firestore tienen algunas limitaciones importantes:

### 1. No pueden contar documentos eficientemente

Las funciones `countUserStrategies()` que usamos arriba **no son eficientes** en producción porque:
- No pueden iterar sobre colecciones completas
- Tienen límite de 10 lecturas por regla
- Pueden ser lentas con muchos documentos

**Solución Recomendada:** Hacer la verificación de límites en el **frontend** usando `AccountService` (como en los ejemplos que te mostré).

Las reglas de Firestore son una **capa adicional de seguridad**, pero la lógica principal debe estar en el frontend.

---

## ✅ Enfoque Recomendado (El que implementamos)

### Verificación en Frontend

```typescript
// En tu componente React
const canCreate = await AccountService.canCreateStrategy(currentCount);

if (!canCreate) {
  // Mostrar modal
  return;
}

// Crear estrategia
await createStrategy(data);
```

### Reglas de Firestore Simples

```javascript
// Reglas más simples y eficientes
match /strategies/{strategyId} {
  allow read, write: if request.auth != null && 
                        request.resource.data.userId == request.auth.uid;
}
```

Esta combinación es:
- ✅ Más rápida
- ✅ Más confiable
- ✅ Mejor experiencia de usuario (feedback inmediato)
- ✅ Menos costosa (menos lecturas en Firestore)

---

## 🔐 Reglas de Firestore Recomendadas (Versión Simplificada)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Colección: accounts
    match /accounts/{accountId} {
      allow read, create, update: if request.auth != null && 
                                     request.resource.data.userId == request.auth.uid;
      allow delete: if false;
    }
    
    // Colección: premium
    match /premium/{premiumId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create, update, delete: if false; // Solo Functions
    }
    
    // Colección: strategies
    match /strategies/{strategyId} {
      allow read, create, update, delete: if request.auth != null && 
                                             request.resource.data.userId == request.auth.uid;
    }
    
    // Colección: ads
    match /ads/{adId} {
      allow read, create, update, delete: if request.auth != null && 
                                             request.resource.data.userId == request.auth.uid;
    }
    
    // Colección: contacts
    match /contacts/{contactId} {
      allow read, create, update, delete: if request.auth != null && 
                                             request.resource.data.userId == request.auth.uid;
    }
    
    // Colección: groups
    match /groups/{groupId} {
      allow read, create, update, delete: if request.auth != null && 
                                             request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📝 Aplicar las Reglas

### Método 1: Desde la Consola de Firebase

1. Ir a https://console.firebase.google.com
2. Seleccionar proyecto "geco-bf931"
3. Ir a Firestore Database → Reglas
4. Copiar y pegar las reglas
5. Click en "Publicar"

### Método 2: Desde el CLI

```bash
# Editar archivo firestore.rules
# Luego desplegar:
firebase deploy --only firestore:rules
```

---

## ✅ Resumen

### Lo que SÍ hacemos:
- ✅ Verificar límites en el **frontend** (AccountService)
- ✅ Mostrar modal cuando se alcanza el límite
- ✅ Proteger con reglas básicas de Firestore (solo acceso a propios documentos)

### Lo que NO hacemos:
- ❌ Verificar límites en reglas de Firestore (ineficiente)
- ❌ Contar documentos en reglas (límite de 10 lecturas)

### Seguridad Multi-capa:
1. **Frontend:** Verificación de límites + UX
2. **Firestore Rules:** Solo acceso a propios documentos
3. **Firebase Functions:** Lógica sensible (pagos, webhooks)

---

Esta es la arquitectura recomendada por Firebase y la más eficiente. 🚀
