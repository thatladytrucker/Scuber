import { app } from "./firebase-config.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const db = getFirestore(app);


async function createUserProfile(user, name, role){

    try {

        await setDoc(
            doc(db, "users", user.uid),
            {
                name: name,
                email: user.email,
                role: role,
                active: true,
                createdAt: serverTimestamp()
            }
        );


        console.log(
            "Firestore profile created:",
            user.uid
        );


    } catch(error){

        console.error(
            "Firestore profile error:",
            error
        );

    }

}


export { createUserProfile };
