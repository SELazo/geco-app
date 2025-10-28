import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface FirestoreQueryOptions {
  where?: {
    field: string;
    operator: WhereFilterOp;
    value: any;
  }[];
  orderBy?: {
    field: string;
    direction?: OrderByDirection;
  }[];
  limit?: number;
  startAfter?: QueryDocumentSnapshot<DocumentData>;
}

export class FirestoreService {
  /**
   * Crear un nuevo documento en una colección
   * @param collectionName - Nombre de la colección
   * @param data - Datos del documento
   * @returns Promise con el ID del documento creado
   */
  static async create(collectionName: string, data: any): Promise<string> {
    try {
      console.log(`📝 FirestoreService.create - Colección: ${collectionName}`);
      console.log('📝 FirestoreService.create - Datos:', data);
      
      const docData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('📝 FirestoreService.create - Datos finales con timestamps:', docData);
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      
      console.log(`✅ FirestoreService.create - Documento creado con ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('❌ FirestoreService.create - Error:', error);
      throw error;
    }
  }

  /**
   * Leer un documento por su ID
   * @param collectionName - Nombre de la colección
   * @param documentId - ID del documento
   * @returns Promise con los datos del documento
   */
  static async readById(collectionName: string, documentId: string): Promise<any> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document: ', error);
      throw error;
    }
  }

  /**
   * Leer todos los documentos de una colección con opciones de consulta
   * @param collectionName - Nombre de la colección
   * @param options - Opciones de consulta (filtros, ordenamiento, límite, etc.)
   * @returns Promise con array de documentos
   */
  static async readAll(
    collectionName: string,
    options?: FirestoreQueryOptions
  ): Promise<any[]> {
    try {
      const constraints: QueryConstraint[] = [];

      // Agregar filtros where
      if (options?.where) {
        options.where.forEach((condition) => {
          constraints.push(where(condition.field, condition.operator, condition.value));
        });
      }

      // Agregar ordenamiento
      if (options?.orderBy) {
        options.orderBy.forEach((order) => {
          constraints.push(orderBy(order.field, order.direction || 'asc'));
        });
      }

      // Agregar límite
      if (options?.limit) {
        constraints.push(limit(options.limit));
      }

      // Agregar paginación
      if (options?.startAfter) {
        constraints.push(startAfter(options.startAfter));
      }

      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return documents;
    } catch (error) {
      console.error('Error getting documents: ', error);
      throw error;
    }
  }

  /**
   * Actualizar un documento existente
   * @param collectionName - Nombre de la colección
   * @param documentId - ID del documento
   * @param data - Datos a actualizar
   * @returns Promise<void>
   */
  static async update(
    collectionName: string,
    documentId: string,
    data: any
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
      // console.log('Document updated successfully'); // Reducir logs
    } catch (error) {
      console.error('Error updating document: ', error);
      throw error;
    }
  }

  /**
   * Eliminar un documento
   * @param collectionName - Nombre de la colección
   * @param documentId - ID del documento
   * @returns Promise<void>
   */
  static async delete(collectionName: string, documentId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document: ', error);
      throw error;
    }
  }

  /**
   * Buscar documentos con una consulta específica
   * @param collectionName - Nombre de la colección
   * @param field - Campo por el cual buscar
   * @param operator - Operador de comparación
   * @param value - Valor a buscar
   * @returns Promise con array de documentos que coinciden
   */
  static async findBy(
    collectionName: string,
    field: string,
    operator: WhereFilterOp,
    value: any
  ): Promise<any[]> {
    return this.readAll(collectionName, {
      where: [{ field, operator, value }],
    });
  }

  /**
   * Contar documentos en una colección con filtros opcionales
   * @param collectionName - Nombre de la colección
   * @param options - Opciones de consulta para filtrar
   * @returns Promise con el número de documentos
   */
  static async count(
    collectionName: string,
    options?: FirestoreQueryOptions
  ): Promise<number> {
    const documents = await this.readAll(collectionName, options);
    return documents.length;
  }

  /**
   * Verificar si existe un documento
   * @param collectionName - Nombre de la colección
   * @param documentId - ID del documento
   * @returns Promise<boolean>
   */
  static async exists(collectionName: string, documentId: string): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking document existence: ', error);
      throw error;
    }
  }
}

export default FirestoreService;
