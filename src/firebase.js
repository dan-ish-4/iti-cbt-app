import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsoHuVVRsQMI06jSat-imY_gROSM2DJNY",
  authDomain: "ncvtonline-cbt-exam.firebaseapp.com",
  projectId: "ncvtonline-cbt-exam",
  storageBucket: "ncvtonline-cbt-exam.appspot.com",
  messagingSenderId: "278870849501",
  appId: "1:278870849501:web:756fd80503fe7cabb22834",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance to be used in other parts of the app
export const auth = getAuth(app);