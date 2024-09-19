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
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  Storage,
  getDownloadURL,
} from '@angular/fire/storage';
import { Design, DesignCreate } from '../models/design';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  firestore = inject(Firestore);
  storage = inject(Storage);
  constructor() {}

  async getDesigns(): Promise<Design[]> {
    const designSnapshot = await getDocs(
      query(collection(this.firestore, 'designs'))
    );
    const designs: Design[] = [];

    for (const doc of designSnapshot.docs) {
      const design = { id: doc.id, ...doc.data() } as Design;

      designs.push(design);
    }
    return designs;
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
}
