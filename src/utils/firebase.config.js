import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7h6YNcQ2Qvp2I-aRbJUguehqb0y1sMpI",
  authDomain: "lessons-app-d3b48.firebaseapp.com",
  projectId: "lessons-app-d3b48",
  storageBucket: "lessons-app-d3b48.appspot.com",
  messagingSenderId: "34550102437",
  appId: "1:34550102437:web:e0702dceb64db91065904c",
  measurementId: "G-TWDVTPRQJY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
