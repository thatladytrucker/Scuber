import { app } from "./firebase-config.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


const auth = getAuth(app);

let currentFirebaseUser = null;


onAuthStateChanged(auth, (user) => {

    currentFirebaseUser = user;

    if(user){

        console.log(
            "SCUBER Auth User:",
            user.uid
        );

    } else {

        console.log(
            "SCUBER No User Signed In"
        );

    }

});
function waitForFirebaseUser(){

    return new Promise((resolve)=>{

        onAuthStateChanged(auth, (user)=>{

            resolve(user);

        });

    });

}
async function createFirebaseUser(email, password) {

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log(
            "Firebase User Created:",
            userCredential.user.uid
        );

        return userCredential.user;

    } catch (error) {

        console.error(
            "Firebase Error:",
            error.code,
            error.message
        );

        alert(error.message);

        return null;
    }

}
function getCurrentFirebaseUser(){

    return currentFirebaseUser;

}

export {
    createFirebaseUser,
    getCurrentFirebaseUser,
    waitForFirebaseUser
};
