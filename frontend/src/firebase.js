// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABMpeCZX7ewv1GfI4r40aTa-bj18rfy-8",
  authDomain: "seekmycourse-auth.firebaseapp.com",
  projectId: "seekmycourse-auth",
  storageBucket: "seekmycourse-auth.firebasestorage.app",
  messagingSenderId: "470509887565",
  appId: "1:470509887565:web:162962e3e21db64c65fc04",
  measurementId: "G-N38L4MB6GG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);