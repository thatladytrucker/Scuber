import { app } from "./firebase-config.js";

import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    collection,
    getDocs,
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
async function getRecurringRides(user){

    try {

        const recurringRef = collection(
            db,
            "users",
            user.uid,
            "recurringRides"
        );

        const snapshot = await getDocs(recurringRef);

        let rides = [];

        snapshot.forEach(function(doc){

            rides.push({
                id: doc.id,
                ...doc.data()
            });

        });

        console.log(
            "Recurring rides loaded from Firebase:",
            rides
        );

        return rides;

    } catch(error){

        console.error(
            "Get recurring rides error:",
            error
        );

        return [];

    }
}

async function saveDriverAvailability(uid, day, start, end){

    try {

        await updateDoc(
            doc(db, "users", uid),
            {
                [`availability.${day}`]: {
                    start: start,
                    end: end
                }
            }
        );

        console.log(
            "Driver availability saved:",
            day,
            start,
            end
        );

        return true;

    } catch(error){

        console.error(
            "Driver availability error:",
            error
        );

        return false;
    }
}
async function findAvailableDriver(day, currentTime) {

    try {

        const snapshot = await getDocs(
            collection(db, "users")
        );

        for (const docSnap of snapshot.docs) {

            const user = docSnap.data();

            if (user.driverStatus !== "approved") {
                continue;
            }

            if (!user.availability) {
                continue;
            }

            const schedule =
                user.availability[day];

            if (!schedule) {
                continue;
            }

            if (
                currentTime >= schedule.start &&
                currentTime <= schedule.end
            ) {

                return {
                    uid: docSnap.id,
                    name: user.name
                };

            }
        }

        return null;

    } catch (error) {

        console.error(
            "Find available driver error:",
            error
        );

        return null;
    }
}
async function setDriverOnlineStatus(uid, status){

    try {

        await updateDoc(
            doc(db, "users", uid),
            {
                onlineStatus: status
            }
        );

        console.log(
            "Driver online status saved:",
            status
        );

        return true;

    } catch(error){

        console.error(
            "Driver online status error:",
            error
        );

        return false;
    }
}
export {
    createUserProfile,
    createDriverApplication,
    getUserProfile,
    createRecurringRide,
    getRecurringRides,
    saveDriverAvailability,
    findAvailableDriver,
    setDriverOnlineStatus
};


