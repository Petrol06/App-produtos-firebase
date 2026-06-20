import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXxKTsvPlAbL5MmSLTycI_j9oYl8JprmU",
  authDomain: "app-produtos-firebase-2ebab.firebaseapp.com",
  projectId: "app-produtos-firebase-2ebab",
  storageBucket: "app-produtos-firebase-2ebab.firebasestorage.app",
  messagingSenderId: "310581324031",
  appId: "1:310581324031:web:f25858c001792d07b044ca",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
