import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyAhN5Dep1W6VSLFTcXS4VzLPXmSC3ioDek",
  authDomain: "medical-agent-e1ae7.firebaseapp.com",
  projectId: "medical-agent-e1ae7",
  storageBucket: "medical-agent-e1ae7.firebasestorage.app",
  messagingSenderId: "465302927095",
  appId: "1:465302927095:web:33c9ab802711ae051545f2",
  measurementId: "G-F87TB4DWZT",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const initializeFirebase = () => {
  return app;
};
