// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDuimIsGk8_Y5Nj-Cq8qf1tO2EEuw3FUg",
  authDomain: "realtor-clone-react-51b41.firebaseapp.com",
  projectId: "realtor-clone-react-51b41",
  storageBucket: "realtor-clone-react-51b41.appspot.com",
  messagingSenderId: "429820180603",
  appId: "1:429820180603:web:492da862963b4c75f94ade"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();