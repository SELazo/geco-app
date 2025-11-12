# 💡 Ejemplos de Uso del Sistema Premium

## 📋 Contenidos
1. [Uso en Creación de Estrategias](#1-uso-en-creación-de-estrategias)
2. [Uso en Creación de Publicidades](#2-uso-en-creación-de-publicidades)
3. [Uso en Creación de Contactos](#3-uso-en-creación-de-contactos)
4. [Uso en Creación de Grupos](#4-uso-en-creación-de-grupos)
5. [Mostrar Badge Premium en el Perfil](#5-mostrar-badge-premium-en-el-perfil)

---

## 1. Uso en Creación de Estrategias

### En `GStrategyResumePage.tsx`:

```typescript
import { usePremiumLimit } from '../../../hooks/usePremiumLimit';
import { GPremiumLimitModal } from '../../../components/GPremiumLimitModal';
import { StrategiesFirestoreService } from '../../../services/external/strategiesFirestoreService';

export const GStrategyResumePage = () => {
  // ... otros estados

  // Hook de límites premium
  const {
    isLimitModalOpen,
    limitInfo,
    canCreateStrategy,
    closeLimitModal
  } = usePremiumLimit();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      // 1️⃣ Obtener el número actual de estrategias del usuario
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuario no autenticado');
      }
      
      const user = JSON.parse(userStr);
      const userId = String(user.id);

      // Obtener estrategias actuales del usuario
      const currentStrategies = await StrategiesFirestoreService.getUserStrategies(userId);
      const currentCount = currentStrategies.length;

      console.log(`📊 Usuario tiene ${currentCount} estrategias`);

      // 2️⃣ Verificar si puede crear más estrategias
      const canCreate = await canCreateStrategy(currentCount);

      if (!canCreate) {
        setLoading(false);
        // El modal se abrirá automáticamente gracias al hook
        return; // No continuar con la creación
      }

      // 3️⃣ Si puede crear, continuar con el flujo normal
      console.log('✅ Usuario puede crear estrategia');

      // ... resto del código de creación de estrategia
      const strategyData = {
        // ... tus datos
      };

      await StrategiesFirestoreService.createStrategy(strategyData);

      // Navegar a página de éxito
      navigate('/strategy/create/success');

    } catch (error) {
      console.error('❌ Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="geco-strategy-resume">
      {/* ... tu UI existente */}

      <form onSubmit={handleSubmit}>
        {/* ... campos del formulario */}
        
        <GSubmitButton
          loading={loading}
          text="Crear Estrategia"
        />
      </form>

      {/* Modal de límite */}
      {isLimitModalOpen && limitInfo && (
        <GPremiumLimitModal
          isOpen={isLimitModalOpen}
          onClose={closeLimitModal}
          feature={limitInfo.feature}
          currentCount={limitInfo.currentCount}
          limit={limitInfo.limit}
        />
      )}
    </div>
  );
};
```

---

## 2. Uso en Creación de Publicidades

### En `GAdIdentificationPage.tsx`:

```typescript
import { usePremiumLimit } from '../../../hooks/usePremiumLimit';
import { GPremiumLimitModal } from '../../../components/GPremiumLimitModal';
import { AdsFirestoreService } from '../../../services/external/adsFirestoreService';

export const GAdIdentificationPage = () => {
  const {
    isLimitModalOpen,
    limitInfo,
    canCreateImage,
    closeLimitModal
  } = usePremiumLimit();

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Obtener usuario
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Usuario no autenticado');
      
      const user = JSON.parse(userStr);
      const userId = String(user.id);

      // Obtener publicidades actuales
      const currentAds = await AdsFirestoreService.getUserAds(userId);
      const currentCount = currentAds.length;

      console.log(`🎨 Usuario tiene ${currentCount} publicidades`);

      // Verificar límite
      const canCreate = await canCreateImage(currentCount);

      if (!canCreate) {
        setLoading(false);
        return;
      }

      // Crear publicidad
      const adData = {
        title: data.titleHelper,
        description: data.descriptionHelper,
        // ... resto de datos
      };

      await AdsFirestoreService.createAd(adData);

      navigate('/ads/success');

    } catch (error) {
      console.error('❌ Error:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... tu UI */}

      {isLimitModalOpen && limitInfo && (
        <GPremiumLimitModal
          isOpen={isLimitModalOpen}
          onClose={closeLimitModal}
          feature={limitInfo.feature}
          currentCount={limitInfo.currentCount}
          limit={limitInfo.limit}
        />
      )}
    </div>
  );
};
```

---

## 3. Uso en Creación de Contactos

### En `GAddContactPage.tsx`:

```typescript
import { usePremiumLimit } from '../../../hooks/usePremiumLimit';
import { GPremiumLimitModal } from '../../../components/GPremiumLimitModal';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';

export const GAddContactPage = () => {
  const {
    isLimitModalOpen,
    limitInfo,
    canCreateContact,
    closeLimitModal
  } = usePremiumLimit();

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Obtener usuario
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Usuario no autenticado');
      
      const user = JSON.parse(userStr);
      const userId = String(user.id);

      // Obtener contactos actuales
      const currentContacts = await ContactsFirestoreService.getUserContacts(userId);
      const currentCount = currentContacts.length;

      console.log(`📇 Usuario tiene ${currentCount} contactos`);

      // Verificar límite
      const canCreate = await canCreateContact(currentCount);

      if (!canCreate) {
        setLoading(false);
        return;
      }

      // Crear contacto
      const contactData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        userId: userId
      };

      await ContactsFirestoreService.createContact(contactData);

      navigate('/contacts/list');

    } catch (error) {
      console.error('❌ Error:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... tu UI */}

      {isLimitModalOpen && limitInfo && (
        <GPremiumLimitModal
          isOpen={isLimitModalOpen}
          onClose={closeLimitModal}
          feature={limitInfo.feature}
          currentCount={limitInfo.currentCount}
          limit={limitInfo.limit}
        />
      )}
    </div>
  );
};
```

---

## 4. Uso en Creación de Grupos

### En `GAddNewGroupFormStep2Page.tsx`:

```typescript
import { usePremiumLimit } from '../../../hooks/usePremiumLimit';
import { GPremiumLimitModal } from '../../../components/GPremiumLimitModal';
import { GroupsServiceFirestore } from '../../../services/external/groupsServiceFirestore';

export const GAddNewGroupFormStep2Page = () => {
  const {
    isLimitModalOpen,
    limitInfo,
    canCreateGroup,
    closeLimitModal
  } = usePremiumLimit();

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Obtener usuario
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Usuario no autenticado');
      
      const user = JSON.parse(userStr);
      const userId = String(user.id);

      // Obtener grupos actuales
      const currentGroups = await GroupsServiceFirestore.getGroups();
      const currentCount = currentGroups.length;

      console.log(`👥 Usuario tiene ${currentCount} grupos`);

      // Verificar límite
      const canCreate = await canCreateGroup(currentCount);

      if (!canCreate) {
        setLoading(false);
        return;
      }

      // Crear grupo
      const groupData = {
        name: data.groupName,
        description: data.groupDescription,
        userId: userId,
        contactIds: selectedContacts
      };

      await GroupsServiceFirestore.newGroup(groupData);

      navigate('/contacts/groups');

    } catch (error) {
      console.error('❌ Error:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... tu UI */}

      {isLimitModalOpen && limitInfo && (
        <GPremiumLimitModal
          isOpen={isLimitModalOpen}
          onClose={closeLimitModal}
          feature={limitInfo.feature}
          currentCount={limitInfo.currentCount}
          limit={limitInfo.limit}
        />
      )}
    </div>
  );
};
```

---

## 5. Mostrar Badge Premium en el Perfil

### En `GUserProfilePage.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { AccountService } from '../../../services/external/accountService';

export const GUserProfilePage = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [limits, setLimits] = useState<any>(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const premium = await AccountService.isPremium();
      const userLimits = await AccountService.getCurrentLimits();
      
      setIsPremium(premium);
      setLimits(userLimits);
    };

    fetchAccountInfo();
  }, []);

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        
        {/* Badge Premium */}
        {isPremium ? (
          <div className="premium-badge">
            <span>✨ PREMIUM</span>
          </div>
        ) : (
          <div className="free-badge">
            <span>FREE</span>
            <Link to="/premium">Actualizar</Link>
          </div>
        )}
      </div>

      {/* Mostrar límites */}
      {limits && (
        <div className="limits-info">
          <h3>Límites de tu plan</h3>
          <ul>
            <li>
              Estrategias: {limits.strategies === -1 ? '∞ Ilimitadas' : `${limits.strategies} máximo`}
            </li>
            <li>
              Publicidades: {limits.images === -1 ? '∞ Ilimitadas' : `${limits.images} máximo`}
            </li>
            <li>
              Contactos: {limits.contacts === -1 ? '∞ Ilimitados' : `${limits.contacts} máximo`}
            </li>
            <li>
              Grupos: {limits.groups === -1 ? '∞ Ilimitados' : `${limits.groups} máximo`}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 Estilos para Badge Premium

Agrega a tu CSS:

```css
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.free-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  background: #95a5a6;
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
}

.free-badge a {
  color: white;
  text-decoration: underline;
  cursor: pointer;
}
```

---

## 📊 Mostrar Progreso de Uso

Para mostrar cuánto ha usado el usuario de su plan:

```typescript
import { useState, useEffect } from 'react';
import { AccountService } from '../../../services/external/accountService';
import { StrategiesFirestoreService } from '../../../services/external/strategiesFirestoreService';

export const GUsageProgressBar = () => {
  const [usage, setUsage] = useState({ current: 0, limit: 0 });

  useEffect(() => {
    const fetchUsage = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const userId = String(user.id);

      // Obtener estrategias actuales
      const strategies = await StrategiesFirestoreService.getUserStrategies(userId);
      const currentCount = strategies.length;

      // Obtener límites
      const limits = await AccountService.getCurrentLimits();

      setUsage({ current: currentCount, limit: limits.strategies });
    };

    fetchUsage();
  }, []);

  const percentage = usage.limit === -1 
    ? 0 // Ilimitado, no mostrar barra
    : (usage.current / usage.limit) * 100;

  if (usage.limit === -1) {
    return <div>Estrategias ilimitadas ✨</div>;
  }

  return (
    <div className="usage-progress">
      <div className="progress-label">
        {usage.current} / {usage.limit} estrategias usadas
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage >= 100 && (
        <Link to="/premium" className="upgrade-link">
          Actualizar a Premium
        </Link>
      )}
    </div>
  );
};
```

CSS:

```css
.usage-progress {
  margin: 20px 0;
}

.progress-label {
  font-size: 0.9rem;
  color: #636e72;
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background: #dfe6e9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.upgrade-link {
  display: inline-block;
  margin-top: 10px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.upgrade-link:hover {
  text-decoration: underline;
}
```

---

¡Con estos ejemplos puedes integrar el sistema Premium en toda tu aplicación! 🎉
