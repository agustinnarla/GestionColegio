// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbF2B_2MCvqm5lne7fJWo-d11Ydx41CFk",
  authDomain: "gestioncolegio-14a21.firebaseapp.com",
  projectId: "gestioncolegio-14a21",
  storageBucket: "gestioncolegio-14a21.appspot.com",
  messagingSenderId: "44471856586",
  appId: "1:44471856586:web:223259de8809188fca7333",
  measurementId: "G-K3JPBC2L7Z"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);

export default appFirebase