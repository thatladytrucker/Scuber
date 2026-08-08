import { app } from "./firebase-config.js";

import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    getDoc,
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
async function getUserProfile(uid){

    try {

        const userDoc = await getDoc(
            doc(db, "users", uid)
        );


        if(userDoc.exists()){

            return userDoc.data();

        } else {

            console.log(
                "No user profile found"
            );

            return null;

        }


    } catch(error){

        console.error(
            "Get user profile error:",
            error
        );

        return null;

    }

}
async function createRecurringRide(user, recurringRide){

    try {

        const rideId = Date.now().toString();

        await setDoc(
            doc(
                db,
                "users",
                user.uid,
                "recurringRides",
                rideId
            ),
            {
                rider: recurringRide.rider,
                pickup: recurringRide.pickup,
                destination: recurringRide.destination,
                days: recurringRide.days,
                time: recurringRide.time,
                status: recurringRide.status,
                createdAt: serverTimestamp()
            }
        );

        console.log(
            "Recurring ride saved to Firebase:",
            rideId
        );

        return true;

    } catch(error){

        console.error(
            "Recurring ride Firebase error:",
            error
        );

        return false;
    }
}
export {
createUserProfile,
createDriverApplication,
getUserProfile,
createRecurringRide
};


