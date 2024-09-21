import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  query,
  getDocs,
  collection,
  addDoc,
  CollectionReference,
  setDoc,
  doc,
  DocumentReference,
  getDoc,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  deleteDoc,
  where,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  Storage,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Design, DesignCreate } from '../models/design';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  firestore = inject(Firestore);
  storage = inject(Storage);
  constructor() {}

  async getDesigns(
    pageSize: number,
    startAfterDoc: any = null,
    searchTerm: string = ''
  ): Promise<{ designs: Design[]; lastDoc: any }> {
    let designQuery = query(
      collection(this.firestore, 'designs'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (searchTerm) {
      designQuery = query(
        designQuery,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
    }

    if (startAfterDoc) {
      designQuery = query(designQuery, startAfter(startAfterDoc));
    }

    const designSnapshot = await getDocs(designQuery);
    const designs: Design[] = [];
    let lastDoc = null;

    designSnapshot.forEach((doc) => {
      designs.push({ id: doc.id, ...doc.data() } as Design);
    });

    lastDoc = designSnapshot.docs[designSnapshot.docs.length - 1];

    return { designs, lastDoc };
  }

  async updateDesign(
    design: Design,
    mainImage?: File,
    frontImage?: File,
    backImage?: File
  ): Promise<Design> {
    const filePath = `${design.name}/`;
    const uploads: any = [];
    if (mainImage) {
      uploads.push(
        uploadBytes(ref(this.storage, filePath + 'main'), mainImage)
          .then((snapshot) => getDownloadURL(snapshot.ref))
          .then(async (downloadURL) => {
            design.image = downloadURL;
          })
      );
    }
    if (frontImage) {
      uploadBytes(ref(this.storage, filePath + 'front'), frontImage)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then(async (downloadURL) => {
          design.front = downloadURL;
        });
    }
    if (backImage) {
      uploadBytes(ref(this.storage, filePath + 'back'), backImage)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then(async (downloadURL) => {
          design.back = downloadURL;
        });
    }

    try {
      await Promise.all(uploads);

      const docRef = doc(
        this.firestore,
        `designs/${design.id}`
      ) as DocumentReference<Design>;
      await updateDoc(docRef, design);

      return design;
    } catch (error) {
      throw error;
    }
  }

  async createDesign(
    designData: DesignCreate,
    mainImage: File,
    frontImage: File,
    backImage: File
  ): Promise<Design> {
    const design: any = { ...designData };
    const filePath = `${design.name}/`;
    const uploads = [
      uploadBytes(ref(this.storage, filePath + 'main'), mainImage)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then(async (downloadURL) => {
          design.image = downloadURL;
        }),
      uploadBytes(ref(this.storage, filePath + 'front'), frontImage)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then(async (downloadURL) => {
          design.front = downloadURL;
        }),
      uploadBytes(ref(this.storage, filePath + 'back'), backImage)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then(async (downloadURL) => {
          design.back = downloadURL;
        }),
    ];
    try {
      await Promise.all(uploads);

      const designsCollection = collection(
        this.firestore,
        'designs'
      ) as CollectionReference<Design>;
      const docRef = await addDoc(designsCollection, design);
      design.id = docRef.id;

      return design;
    } catch (error) {
      throw error;
    }
  }

  async deleteDesign(design: Design): Promise<void> {
    const mainImage = ref(this.storage, design.image);
    const frontImage = ref(this.storage, design.front);
    const backImage = ref(this.storage, design.back);
    const docRef = doc(
      this.firestore,
      `designs/${design.id}`
    ) as DocumentReference<Design>;
    Promise.all([
      deleteObject(mainImage),
      deleteObject(frontImage),
      deleteObject(backImage),
      deleteDoc(docRef),
    ]);
  }
}
