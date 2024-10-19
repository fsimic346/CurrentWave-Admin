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
  getCountFromServer,
  startAt,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  Storage,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Design, DesignCreate } from '../models/design';

type Types = {
  types: string[];
};

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  firestore = inject(Firestore);
  storage = inject(Storage);
  constructor() {}

  async getDesigns(
    searchTerm: string = ''
  ): Promise<{ designs: Design[]; lastDoc: any }> {
    let designQuery = query(
      collection(this.firestore, 'designs'),
      orderBy('createdAt', 'desc')
    );

    if (searchTerm) {
      designQuery = query(
        designQuery,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
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

      const homeDocRef = doc(this.firestore, 'aggregations/home');
      const homeSnapshot = await getDoc(homeDocRef);

      if (homeSnapshot.exists()) {
        const homeData = homeSnapshot.data() as {
          [key: string]: Design[];
        };

        // Ensure the type property exists in the aggregation
        const designType = design.type; // Assuming design.type is either 'Majica', 'Duks', etc.
        if (!homeData[designType]) {
          homeData[designType] = [];
        }

        // Add the new design to the front of the array
        homeData[designType].unshift(design);

        // Keep only the most recent 5 items in the array
        if (homeData[designType].length > 5) {
          homeData[designType] = homeData[designType].slice(0, 5);
        }

        // Update the document with the new array
        await setDoc(homeDocRef, homeData);
      } else {
        // If the document doesn't exist, create it with the new design in the correct array
        const newData = {
          [design.type]: [design],
        };
        await setDoc(homeDocRef, newData);
      }

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

  async getTypes(): Promise<string[]> {
    const docRef = doc(
      this.firestore,
      'types/types'
    ) as DocumentReference<Types>;
    const types = await getDoc(docRef);
    return types.data()!.types;
  }
}
