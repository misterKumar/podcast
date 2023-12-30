import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC28iAVGrhoYDDdFgvXyirNLhKxGQL5_F4",
  authDomain: "podcast-platform-7d632.firebaseapp.com",
  projectId: "podcast-platform-7d632",
  storageBucket: "podcast-platform-7d632.appspot.com",
  messagingSenderId: "88958772685",
  appId: "1:88958772685:web:7dc3913bd788a82c951084",
  measurementId: "G-H7H2SL1VNS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };
