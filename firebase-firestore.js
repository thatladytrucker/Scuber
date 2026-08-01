import { app } from "./firebase-config.js";

import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
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
async function createDriverApplication(user){

    try {

        await updateDoc(
            doc(db, "users", user.uid),
            {
                role: "driver_applicant",
                driverStatus: "pending"
            }
        );


        console.log(
            "Driver application submitted:",
            user.uid
        );


    } catch(error){

        console.error(
            "Driver application error:",
            error
        );

    }

}


export { 
    createUserProfile,
    createDriverApplication
};


