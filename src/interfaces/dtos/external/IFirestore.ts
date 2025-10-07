// Interfaces para los datos de Firestore

export interface IFirestoreDocument {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStrategy extends IFirestoreDocument {
  title: string;
  description?: string;
  ads: string[]; // IDs de anuncios
  groups: string[]; // IDs de grupos
  startDate: Date;
  endDate: Date;
  periodicity: string;
  schedule: string;
  enableForm?: boolean;
  formType?: 'Pedido rápido' | 'Contacto simple' | 'Reservas / turnos' | 'Catálogo';
  formConfig?: any;
  status: 'active' | 'paused' | 'completed' | 'draft';
  userId: string;
}

export interface IContact extends IFirestoreDocument {
  name: string;
  email?: string;
  phone?: string;
  groups: string[]; // IDs de grupos
  tags?: string[];
  userId: string;
  lastInteraction?: Date;
  status: 'active' | 'inactive' | 'blocked';
}

export interface IGroup extends IFirestoreDocument {
  name: string;
  description?: string;
  contactIds: string[];
  userId: string;
  color?: string;
  tags?: string[];
}

export interface IAd extends IFirestoreDocument {
  title: string;
  description: string;
  content: {
    titleAd?: string;
    textAd?: string;
    imageUrl?: string;
  };
  template: string;
  palette: string;
  size: string;
  userId: string;
  status: 'draft' | 'active' | 'archived';
}

export interface IFormSubmission extends IFirestoreDocument {
  strategyId: string;
  formType: string;
  data: Record<string, any>;
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  submittedAt: Date;
  processed: boolean;
}

export interface IAnalytics extends IFirestoreDocument {
  strategyId?: string;
  adId?: string;
  type: 'view' | 'click' | 'conversion' | 'form_submission';
  timestamp: Date;
  metadata?: Record<string, any>;
  userId: string;
}

// Interfaces para autenticación
export interface IUser extends IFirestoreDocument {
  name: string;
  email: string;
  password: string; // Hash de la contraseña
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface ISession extends IFirestoreDocument {
  userId: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  lastActivity: Date;
  token: string;
}
