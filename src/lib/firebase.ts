import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "ankuram-carbon.firebaseapp.com",
  projectId: "ankuram-carbon",
  storageBucket: "ankuram-carbon.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "1:XXXX:web:XXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);

export default app;
