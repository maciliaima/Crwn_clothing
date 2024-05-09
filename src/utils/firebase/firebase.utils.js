import { initializeApp } from 'firebase/app';
//getAuth(): instance d'authentification Firebase telles que la connexion, la déconnexion, l'inscription.
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBB2UuLuEFIvIzjhPWOad9j1f6xgIRp6iA",
  authDomain: "crown-clothing-db-62fa7.firebaseapp.com",
  projectId: "crown-clothing-db-62fa7",
  storageBucket: "crown-clothing-db-62fa7.appspot.com",
  messagingSenderId: "903181216223",
  appId: "1:903181216223:web:fa8bc2e45acd796892bc6a"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);
//db est une instance de votre BDD Firestore.
export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};
//récupère les données de la collection "categories" dans votre BDD et les organise dans un objet JavaScript 
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});
//retourne l'objet categoryMap(les catégories et les documents associés sous forme d'objets JavaScript)
  return categoryMap;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;//vérifier si l'utilisateur authentifié
//créer une référence à son document utilisateur
  const userDocRef = doc(db, 'users', userAuth.uid);
// récupère le document utilisateur=et vérifie s'il existe déjà dans la base de données.
  const userSnapshot = await getDoc(userDocRef);
//Si le document utilisateur n'existe pas encore
  if (!userSnapshot.exists()) {
//la fonction extrait le nom et l'e-mail)
    const { displayName, email } = userAuth;
//ajoute également une date de création
    const createdAt = new Date();
//setDoc créer le document utilisateur avec ces informations dans la BDD.
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
//Les informations supplémentaires fournies via additionalInformation sont également ajoutées au document.
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }
// renvoie la référence au document utilisateur nouvellement créé ou existant.
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
//onAuthStateChanged: l'état d'authentification(connecte ou se déconnecte).
  onAuthStateChanged(auth, callback);
