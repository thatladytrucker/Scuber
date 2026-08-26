import { app } from "./firebase-config.js";

import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
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

            console.log(
    "Driver check:",
    user.name,
    "status:",
    user.driverStatus,
    "online:",
    user.onlineStatus
);
            
            if (user.onlineStatus !== "ONLINE") {
    continue;
}

            if (user.driverStatus !== "approved") {
                continue;
            }

            if (!user.availability) {
                continue;
            }

            const schedule =
                user.availability[day];

            console.log(
    "Availability check:",
    user.name,
    "day:",
    day,
    "schedule:",
    schedule
);

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
async function createRide(rideId, rideData){

    try {

        await setDoc(
            doc(db, "rides", rideId),
            {
                ...rideData,
                createdAt: serverTimestamp()
            }
        );

        console.log(
            "Ride created in Firebase:",
            rideId
        );

        return true;

    } catch(error){

        console.error(
            "Create ride error:",
            error
        );

        return false;
    }
}


async function updateRide(rideId, updates){

    try {

        await updateDoc(
            doc(db, "rides", rideId),
            updates
        );

        console.log(
            "Ride updated in Firebase:",
            rideId,
            updates
        );

        return true;

    } catch(error){

        console.error(
            "Update ride error:",
            error
        );

        return false;
    }
}


async function getRide(rideId){

    try {

        const rideSnapshot =
            await getDoc(
                doc(db, "rides", rideId)
            );

        if(!rideSnapshot.exists()){

            return null;

        }

        return {
            id: rideSnapshot.id,
            ...rideSnapshot.data()
        };

    } catch(error){

        console.error(
            "Get ride error:",
            error
        );

        return null;
    }
}
function listenToRide(rideId, callback){

    try {

        const rideRef =
            doc(db, "rides", rideId);

        return onSnapshot(
            rideRef,
            (snapshot) => {

                if(!snapshot.exists()){

                    console.log(
                        "Ride no longer exists:",
                        rideId
                    );

                    return;
                }

                const rideData = {
                    id: snapshot.id,
                    ...snapshot.data()
                };

                console.log(
                    "Ride update received:",
                    rideData
                );

                callback(rideData);
            },
            (error) => {

                console.error(
                    "Ride listener error:",
                    error
                );

            }
        );

    } catch(error){

        console.error(
            "Listen to ride error:",
            error
        );

        return null;
    }
}
function listenForDriverRides(driverUid, callback){

    try {

        const ridesRef =
            collection(db, "rides");

        const ridesQuery =
            query(
                ridesRef,
                where("driverUid", "==", driverUid)
            );

        return onSnapshot(
            ridesQuery,
            (snapshot) => {

                snapshot.docChanges().forEach(
                    (change) => {

                        if(
                            change.type === "added" ||
                            change.type === "modified"
                        ){

                            const rideData = {
                                id: change.doc.id,
                                ...change.doc.data()
                            };

                            console.log(
                                "Driver ride received:",
                                rideData
                            );

                            callback(rideData);

                        }

                    }
                );

            },
            (error) => {

                console.error(
                    "Driver ride listener error:",
                    error
                );

            }
        );

    } catch(error){

        console.error(
            "Listen for driver rides error:",
            error
        );

        return null;
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
    setDriverOnlineStatus,
    createRide,
    updateRide,
    getRide,
    listenToRide,
    listenForDriverRides
};


