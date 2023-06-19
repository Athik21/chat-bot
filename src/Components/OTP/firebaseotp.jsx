// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGB52jabIRCtOfoa7Yb9MREU51LmqEgbU",
  authDomain: "chat-otp-3367c.firebaseapp.com",
  projectId: "chat-otp-3367c",
  storageBucket: "chat-otp-3367c.appspot.com",
  messagingSenderId: "227857427570",
  appId: "1:227857427570:web:b5ed306e959781351926eb",
  measurementId: "G-WJSSM67KR1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)