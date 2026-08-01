// SCUBER Firebase Configuration

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyAo7QXAbprArDyASlJPplOvJ2dh7DhXzdQ",
  authDomain: "scuber-35076.firebaseapp.com",
  projectId: "scuber-35076",
  storageBucket: "scuber-35076.firebasestorage.app",
  messagingSenderId: "770085527375",
  appId: "1:770085527375:web:8d270ee88e7d68b8a8af3a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("SCUBER Firebase Connected:", app.name);

export { app };
