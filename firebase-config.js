// SCUBER Firebase Configuration

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


console.log("SCUBER Firebase Connected:", app.name);
