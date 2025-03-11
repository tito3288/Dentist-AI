import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoVacJZ6ZR0XJ6ASm2ilW4lDdRtjLoFck",
  authDomain: "dentist-ai-a58e7.firebaseapp.com",
  projectId: "dentist-ai-a58e7",
  storageBucket: "dentist-ai-a58e7.appspot.com",
  messagingSenderId: "71403627970",
  appId: "1:71403627970:web:24a164d342db1eb469225b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
