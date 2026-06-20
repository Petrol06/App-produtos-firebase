import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjSB87S_Ayc76i9uneODnyFSLamSSRpRA",
  authDomain: "app-produtos-firebase.firebaseapp.com",
  projectId: "app-produtos-firebase",
  storageBucket: "app-produtos-firebase.firebasestorage.app",
  messagingSenderId: "506367268857",
  appId: "1:506367268857:web:64d8345a5301b79fb90f28",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
