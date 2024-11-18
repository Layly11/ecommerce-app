import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCf79wO0xxdnIPl5TpyvFyEL4jLfoZDg18",
    authDomain: "ecommerce-proj-e0b47.firebaseapp.com",
    projectId: "ecommerce-proj-e0b47",
    storageBucket: "ecommerce-proj-e0b47.appspot.com",
    messagingSenderId: "368651507735",
    appId: "1:368651507735:web:0aeb704f12bef8cf5b6452",
    measurementId: "G-Q2NX1TVCQX"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };