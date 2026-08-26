import {
    createFirebaseUser,
    signInFirebaseUser,
    getCurrentFirebaseUser,
    waitForFirebaseUser,
    signOutFirebaseUser
} from "./firebase-auth.js";

import {
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
    listenToRide
} from "./firebase-firestore.js";

let driverLocationWatcher = null;

// ===========================================
// DRIVER FUNCTIONS
// ===========================================// Scuber App - Version 1

function showDriverEarnings(){

    document.getElementById("driver-dashboard")
    .classList.add("hidden");

    document.getElementById("driver-earnings-screen")
    .classList.remove("hidden");


    let totalTrips = rideHistory.length;

    let totalEarnings = 0;


    rideHistory.forEach(function(ride){

    const fare = Number(ride.fare);

    if (Number.isFinite(fare)) {

        totalEarnings += fare;

    }

});


    let averageFare = 0;

    if(totalTrips > 0){

        averageFare = totalEarnings / totalTrips;

    }


    document.getElementById("total-trips").textContent =
    totalTrips;


    document.getElementById("total-earnings").textContent =
    totalEarnings.toFixed(2);


    document.getElementById("total-tips").textContent =
    "0.00";

    let totalTips = 0;

    let grandTotal = totalEarnings + totalTips;


    document.getElementById("grand-total-earnings").textContent =
    grandTotal.toFixed(2);


    document.getElementById("average-fare").textContent =
    averageFare.toFixed(2);

}

// ===========================================
// SCHEDULE FUNCTIONS
// ===========================================



function openSchedule() {

    document.getElementById("old-rider-dashboard")
    .classList.add("hidden");

    document.getElementById("schedule-screen")
    .classList.remove("hidden");

}


function confirmRide() {

    let pickup = document.getElementById("pickup").value;
    let destination = document.getElementById("destination").value;
    let date = document.getElementById("ride-date").value;
    let time = document.getElementById("ride-time").value;


    alert(
        "Ride Scheduled!\n\n" +
        "Pickup: " + pickup +
        "\nDestination: " + destination +
        "\nDate: " + date +
        "\nTime: " + time
    );

}


function openRecurring() {

    document.getElementById("recurring-screen")
    .classList.remove("hidden");

}

function showMyRecurringRides(){

    document.getElementById("main-app")
    .classList.add("hidden");

    let recurringRides = JSON.parse(
        localStorage.getItem("scuberRecurringRides")
    ) || [];

    let list = document.getElementById("my-recurring-list");

    list.innerHTML = "";

    recurringRides.forEach(function(ride){

        let item = document.createElement("div");

        item.innerHTML = `
    <p>
    🔁 ${ride.pickup} → ${ride.destination}<br>
    Days: ${ride.days ? ride.days.join(", ") : ride.day}<br>
    Time: ${ride.time}<br>
    Status: <strong>${ride.status}</strong>
    </p>

    <button class="schedule"
        onclick="toggleRecurringRide(${recurringRides.indexOf(ride)})">
        ${ride.status === "ACTIVE" ? "⏸ Pause" : "▶ Resume"}
    </button>
    
    <button class="schedule"
    onclick="deleteRecurringRide(${recurringRides.indexOf(ride)})">
    🗑 Delete
    </button>
    
    <hr>
`;

        list.appendChild(item);

    });

    document.getElementById("my-recurring-screen")
    .classList.remove("hidden");
}
function toggleRecurringRide(index){

    let recurringRides = JSON.parse(
        localStorage.getItem("scuberRecurringRides")
    ) || [];

    if(!recurringRides[index]){
        return;
    }

    if(recurringRides[index].status === "ACTIVE"){
        recurringRides[index].status = "PAUSED";
    } else {
        recurringRides[index].status = "ACTIVE";
    }

    localStorage.setItem(
        "scuberRecurringRides",
        JSON.stringify(recurringRides)
    );

    showMyRecurringRides();
}
function deleteRecurringRide(index){

    let recurringRides = JSON.parse(
        localStorage.getItem("scuberRecurringRides")
    ) || [];

    if(!recurringRides[index]){
        return;
    }

    let confirmed = confirm(
        "Are you sure you want to delete this recurring ride?"
    );

    if(!confirmed){
        return;
    }

    recurringRides.splice(index, 1);

    localStorage.setItem(
        "scuberRecurringRides",
        JSON.stringify(recurringRides)
    );

    showMyRecurringRides();
}
async function confirmRecurring() {

    let pickup = document.getElementById("repeat-pickup").value;
    let destination = document.getElementById("repeat-destination").value;
    let days = [];

document.querySelectorAll(".repeat-day:checked")
.forEach(function(day){

    days.push(day.value);

});
    let time = document.getElementById("repeat-time").value;


    if(!pickup || !destination || days.length === 0 || !time){

        alert("Please complete all recurring ride information.");
        return;

    }


    let recurringRides = JSON.parse(
        localStorage.getItem("scuberRecurringRides")
    ) || [];


    let recurringRide = {

        rider: localStorage.getItem("scuberUserName"),
        pickup: pickup,
        destination: destination,
        days: days,
        time: time,
        status: "ACTIVE"

    };
let firebaseUser = getCurrentFirebaseUser();

if(firebaseUser){

    await createRecurringRide(
        firebaseUser,
        recurringRide
    );

}

    recurringRides.push(recurringRide);


    localStorage.setItem(
        "scuberRecurringRides",
        JSON.stringify(recurringRides)
    );


    alert(
        "Recurring Ride Saved!\n\n" +
        "Pickup: " + pickup +
        "\nDestination: " + destination +
        "\nEvery: " + days.join(", ") +
        "\nTime: " + time
    );

}
// ===========================================
// ACCOUNT FUNCTIONS
// ===========================================
function showAccountScreen(){

    document.getElementById("welcome-screen")
    .classList.add("hidden");

    document.getElementById("account-screen")
    .classList.remove("hidden");

    document.getElementById("email").value = "";
document.getElementById("password").value = "";

    loadUserList();

}
function createAccount(type) {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;


    if(name === "" || email === "") {

        alert("Please enter your name and email.");

        return false;
    }

    
    alert(
        "Welcome to Scuber, " + name + "!\n\n" +
        "Account Type: " + type
    );

    document.getElementById("account-screen")
    .classList.add("hidden");

    return true;
}
function showWelcomeScreen(){

    console.log("Opening Welcome Screen");

    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("recurring-screen")
    .classList.add("hidden");

    document.getElementById("schedule-screen")
    .classList.add("hidden");

    document.getElementById("ride-history-screen")
    .classList.add("hidden");

    document.getElementById("ride-request-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.add("hidden");

    document.getElementById("driver-screen")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("driver-trip-screen")
    .classList.add("hidden");

    document.getElementById("welcome-screen")
    .classList.remove("hidden");

}
function checkReturningUser(){

    showWelcomeScreen();

}
async function loadFirebaseWelcome(){

    let user = await waitForFirebaseUser();


    if(!user){

        console.log(
            "No Firebase user found"
        );

        return;

    }


    let profile = await getUserProfile(
        user.uid
    );
    
    console.log("SCUBER PROFILE:", profile);

    if(profile){

        document.getElementById("welcome-name").textContent =
            "Welcome back, " + profile.name;

        showWelcomeScreen();
        
console.log(
    "WELCOME SET TO:",
    document.getElementById("welcome-name").textContent
);

        console.log(
            "Active SCUBER user:",
            profile.name
        );

    }

}

function loadUserList(){

    let users = JSON.parse(localStorage.getItem("scuberUsers")) || [];

    let list = document.getElementById("account-user-list");

    list.innerHTML = "";
    let activeEmail = localStorage.getItem("scuberActiveUser");

let activeUser = users.find(function(user){

    return user.email === activeEmail;

});


if(activeUser){

    document.getElementById("active-user-display").innerHTML =
    "Active User:<br>" +
    "<strong>" + activeUser.name + "</strong><br>" +
    activeUser.email;

}

    users.forEach(function(user){

        list.innerHTML += `

        <button class="schedule"
        onclick="selectUser('${user.email}')">

            <strong>${user.name}</strong><br>
            ${user.email}

        </button>

        `;

    });

}
async function selectUser(email){

    let users =
        JSON.parse(localStorage.getItem("scuberUsers")) || [];

    let selectedUser =
        users.find(function(user){

            return user.email === email;

        });


    if(!selectedUser){

        return;

    }


    const password = prompt(
        "Enter your password for " +
        selectedUser.name
    );


    if(password === null){

        return;

    }


    const firebaseUser =
        await signInFirebaseUser(
            selectedUser.email,
            password
        );


    if(!firebaseUser){

        return;

    }


    localStorage.setItem(
        "scuberActiveUser",
        selectedUser.email
    );


    localStorage.setItem(
        "scuberUserName",
        selectedUser.name
    );


    localStorage.setItem(
        "scuberUserEmail",
        selectedUser.email
    );


    alert(
        "Welcome back, " +
        selectedUser.name +
        "!"
    );


    await loadFirebaseWelcome();

loadUserList();

showWelcomeScreen();

}
function deleteCurrentUser(){

    let activeEmail = localStorage.getItem("scuberActiveUser");

    if(!activeEmail){
        alert("No user is currently selected.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("scuberUsers")) || [];

    let currentUser = users.find(function(user){
        return user.email === activeEmail;
    });

    if(!currentUser){
        alert("Current user not found.");
        return;
    }

    let confirmDelete = confirm(
        'Delete "' + currentUser.name + '"?\n\nThis action cannot be undone.'
    );

    if(!confirmDelete){
        return;
    }

    users = users.filter(function(user){
        return user.email !== activeEmail;
    });

    localStorage.setItem(
        "scuberUsers",
        JSON.stringify(users)
    );

    localStorage.removeItem("scuberActiveUser");
    localStorage.removeItem("scuberUserName");
    localStorage.removeItem("scuberUserEmail");

    loadUserList();

    showWelcomeScreen();
}
function showModeScreen(){

    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("mode-screen")
    .classList.remove("hidden");

}
function saveUser(name, email){

    let users =
        JSON.parse(
            localStorage.getItem("scuberUsers")
        ) || [];


    let existingUser =
        users.find(function(user){

            return user.email === email;

        });


    if(existingUser){

        existingUser.name = name;

    } else {

        users.push({

            name: name,
            email: email

        });

    }


    localStorage.setItem(
        "scuberUsers",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "scuberActiveUser",
        email
    );


    localStorage.setItem(
        "scuberUserName",
        name
    );


    localStorage.setItem(
        "scuberUserEmail",
        email
    );

}
async function createRiderAccount(){

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    if(!name || !email || !password){

        alert("Please enter your name, email, and password.");

        return;
    }


    let user = await createFirebaseUser(
    email,
    password
);


if(!user){

    return;
}


await createUserProfile(
    user,
    name,
    "rider"
);


        saveUser(name, email);


    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";


    alert(
        "SCUBER account created!"
    );


    showRiderHome();


    document.getElementById("driver-dashboard")
    .classList.add("hidden");

}
// ===========================================
// RIDER FUNCTIONS
// ===========================================
function showRideHistory(){

    document.getElementById("old-rider-dashboard")
    .classList.add("hidden");

    document.getElementById("ride-history-screen")
    .classList.remove("hidden");


    let historyList = document.getElementById("ride-history-list");

    if(rideHistory.length === 0){

        historyList.innerHTML = "<p>No completed rides yet.</p>";

        return;
    }


    historyList.innerHTML = "";


    rideHistory.forEach(function(ride){

        historyList.innerHTML += `

        <div class="ride-card">

            <p><strong>Driver:</strong> ${ride.driver}</p>

<p><strong>Date:</strong> ${
    ride.completedAt
        ? new Date(ride.completedAt).toLocaleDateString()
        : "Not recorded"
}</p>

<p><strong>Time:</strong> ${
    ride.completedAt
        ? new Date(ride.completedAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
        : "Not recorded"
}</p>

<p><strong>Pickup:</strong> ${ride.pickup}</p>

            <p><strong>Destination:</strong> ${ride.destination}</p>

            <p><strong>Fare:</strong> $${ride.fare}</p>

            <p><strong>Status:</strong> ${ride.status}</p>

        </div>

        `;

    });

}

function showRiderHome() {
    
let savedRide = JSON.parse(
    localStorage.getItem("scuberCurrentRide")
);

if (savedRide) {

    currentRide = savedRide;

    showRiderTripScreen();

    return;
}
document.getElementById("driver-dashboard")
.classList.add("hidden");

document.getElementById("driver-screen")
.classList.add("hidden");

document.getElementById("driver-request-screen")
.classList.add("hidden");

document.getElementById("driver-trip-screen")
.classList.add("hidden");
    
    let name = localStorage.getItem("scuberUserName");
    let email = localStorage.getItem("scuberUserEmail");

    if(name === "" || email === ""){

    name = localStorage.getItem("scuberUserName");
    email = localStorage.getItem("scuberUserEmail");

    if(name === null || email === null){
        alert("Please enter your name and email.");
        return;
    }

}
        
   
let activeName = localStorage.getItem("scuberUserName");

document.getElementById("rider-user-name").textContent =
"Welcome, " + activeName;
        
    console.log("Opening Rider Home");

    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("welcome-screen")
    .classList.add("hidden");
    
    document.getElementById("ride-request-screen")
    .classList.add("hidden");

    document.getElementById("schedule-screen")
    .classList.add("hidden");

    document.getElementById("ride-history-screen")
    .classList.add("hidden");

    document.getElementById("recurring-screen")
    .classList.add("hidden");

    document.getElementById("driver-screen")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("driver-trip-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");


    document.getElementById("main-app")
    .classList.remove("hidden");

    console.log("main-app classes:", document.getElementById("main-app").className);
    

}
window.showRiderHome = showRiderHome;
// ===========================================
// DRIVER FUNCTIONS
// ===========================================
async function showDriverScreen() {

    document.getElementById("mode-screen")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.add("hidden");

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("driver-screen")
    .classList.remove("hidden");


    const user = getCurrentFirebaseUser();

    if (!user) {
        return;
    }


    const profile =
        await getUserProfile(user.uid);

    if (!profile || !profile.availability) {
        return;
    }


    const day =
        document.getElementById("driver-day").value;

    const saved =
        profile.availability[day];

    if (!saved) {
        return;
    }


    document.getElementById("driver-start").value =
        saved.start || "";

    document.getElementById("driver-end").value =
        saved.end || "";

}
function assignAvailableDriver(){

    let driverStatus =
        localStorage.getItem("scuberDriverStatus");

    if(driverStatus !== "ONLINE"){

        console.log(
            "No drivers are available."
        );

        return false;
    }

    let driverFound = "Alex";

    currentRide.driver = driverFound;

    currentRide.eta = 8;

    currentRide.fare = 18.00;

    currentRide.status =
        "WAITING_FOR_DRIVER_ACCEPTANCE";

    localStorage.setItem(
        "scuberCurrentRide",
        JSON.stringify(currentRide)
    );

    
    console.log(
        "Driver assigned:",
        driverFound
    );

    return true;
}

window.assignAvailableDriver =
    assignAvailableDriver;
async function goOnline(){
const user = getCurrentFirebaseUser();

if(!user){

    alert("Please sign in before going online.");

    return;
}

await setDriverOnlineStatus(
    user.uid,
    "ONLINE"
);
    localStorage.setItem(
        "scuberDriverStatus",
        "ONLINE"
    );

    document.getElementById("driver-status").textContent =
    "Online";

    alert("You are now online.");
}


async function goOffline(){

    const user = getCurrentFirebaseUser();

    if(!user){

        alert("Please sign in before going offline.");

        return;
    }

    await setDriverOnlineStatus(
        user.uid,
        "OFFLINE"
    );

    localStorage.setItem(
        "scuberDriverStatus",
        "OFFLINE"
    );

    document.getElementById("driver-status").textContent =
    "Offline";

    alert("You are now offline.");
}
async function startDriverApplication() {

    const user = getCurrentFirebaseUser();

    if (!user) {
        alert("Please sign in before applying to become a driver.");
        return;
    }

    await createDriverApplication(user);

    alert(
        "Driver application submitted!\n\n" +
        "Your account is now waiting for approval."
    );
}
console.log("START DRIVER FUNCTION LOADED");
function showDriverDashboard() {

    document.getElementById("welcome-screen")
    .classList.add("hidden");
    
     document.getElementById("mode-screen")
    .classList.add("hidden");

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if(name === "" || email === ""){

    name = localStorage.getItem("scuberUserName");
    email = localStorage.getItem("scuberUserEmail");

    if(name === null || email === null){
        alert("Please enter your name and email.");
        return;
    }

}
saveUser(name, email);
    
    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("mode-screen")
    .classList.add("hidden");

    document.getElementById("old-rider-dashboard")
    .classList.add("hidden");

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("driver-trip-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("driver-screen")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("mode-screen")
    .classList.add("hidden");

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.remove("hidden");
   
}
async function saveAvailability() {

    const user = getCurrentFirebaseUser();

    if (!user) {

        alert(
            "Please sign in before saving your availability."
        );

        return;
    }

    let day =
        document.getElementById("driver-day").value;

    let start =
        document.getElementById("driver-start").value;

    let end =
        document.getElementById("driver-end").value;


    if (!start || !end) {

        alert(
            "Please select both a start time and an end time."
        );

        return;
    }


    const saved =
        await saveDriverAvailability(
            user.uid,
            day,
            start,
            end
        );


    if (!saved) {

        alert(
            "There was a problem saving your availability."
        );

        return;
    }


    alert(
        "Availability Saved!\n\n" +
        "Day: " + day +
        "\nTime: " + start +
        " - " + end
    );

}
window.saveAvailability = saveAvailability;
// ===========================================
// SHARED RIDE FUNCTIONS
// ===========================================

// ===========================================
// CURRENT RIDE DATA
// ===========================================

let currentRide = {
    rider: "",
    driver: "",
    pickup: "",
    destination: "",
    status: "NO_RIDE",
    eta: 0,
    fare: 0
};
// ===========================================
// RIDE HISTORY
// ===========================================

let rideHistory = JSON.parse(
    localStorage.getItem("scuberRideHistory")
) || [];
function requestRide(){

    let name = localStorage.getItem("scuberUserName");

    alert("Current user is: " + name);

    document.getElementById("rider-user-name").textContent =
    "Welcome, " + name;

    document.getElementById("ride-request-screen")
    .classList.remove("hidden");

}
window.requestRide = requestRide;

async function findDriver(){

    console.log("findDriver clicked");

    let pickup =
        document.getElementById("now-pickup").value;

    let destination =
        document.getElementById("now-destination").value;


    if(!pickup || !destination){

        alert(
            "Please enter both your pickup location and destination."
        );

        return;
    }


    // -----------------------------------------
    // GEOCODE PICKUP AND DESTINATION
    // -----------------------------------------

    async function geocodeAddress(address){

        const response =
            await fetch(
                "/.netlify/functions/geocode?address=" +
                encodeURIComponent(address)
            );

        if(!response.ok){

            throw new Error(
                "Unable to geocode address."
            );
        }

        const data =
            await response.json();

        if(
            !data.features ||
            !data.features.length
        ){

            throw new Error(
                "Address not found: " + address
            );
        }

        const coordinates =
            data.features[0].geometry.coordinates;

        return {
            lon: coordinates[0],
            lat: coordinates[1]
        };
    }


    let pickupCoordinates;
    let destinationCoordinates;


    try {

        pickupCoordinates =
            await geocodeAddress(pickup);

        destinationCoordinates =
            await geocodeAddress(destination);

    } catch(error){

        console.error(
            "Geocoding error:",
            error
        );

        alert(
            "We could not locate one of those addresses.\n\n" +
            "Please check the pickup and destination and try again."
        );

        return;
    }


    console.log(
        "Pickup coordinates:",
        pickupCoordinates
    );

    console.log(
        "Destination coordinates:",
        destinationCoordinates
    );


    const now = new Date();

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const day =
        dayNames[now.getDay()];


    const currentTime =
        now.toTimeString().slice(0,5);


    console.log(
        "Checking driver availability:",
        day,
        currentTime
    );


    const driverFound =
        await findAvailableDriver(
            day,
            currentTime
        );


    if(!driverFound){

        alert(
            "No drivers are available right now.\n\n" +
            "Please try again later."
        );

        return;
    }

    currentRide = {};
    
    currentRide.rider =
        localStorage.getItem("scuberUserName");

    currentRide.driver =
        driverFound.name;

    currentRide.driverUid =
        driverFound.uid;

    currentRide.pickup =
        pickup;

    currentRide.destination =
        destination;

    currentRide.pickupCoordinates =
        pickupCoordinates;

    currentRide.destinationCoordinates =
        destinationCoordinates;

    currentRide.status =
        "WAITING_FOR_DRIVER_ACCEPTANCE";

    currentRide.eta = 8;

    currentRide.fare = 18.00;
    
const rideId =
    "ride_" + Date.now();

currentRide.id =
    rideId;

await createRide(
    rideId,
    currentRide
);

    localStorage.setItem(
        "scuberCurrentRide",
        JSON.stringify(currentRide)
    );


    alert(
        "Driver Found!\n\n" +
        "Driver: " + driverFound.name +
        "\nPickup: " + pickup +
        "\nDestination: " + destination
    );


    showRiderTripScreen();

}

window.findDriver = findDriver;
window.findDriver = findDriver;
function showDriverRequest(){

    let savedRide = JSON.parse(localStorage.getItem("scuberCurrentRide"));

if(savedRide){

    currentRide = savedRide;

}

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("welcome-screen")
    .classList.add("hidden");    

    document.getElementById("ride-request-screen")
    .classList.add("hidden");

    document.getElementById("schedule-screen")
    .classList.add("hidden");

    document.getElementById("ride-history-screen")
    .classList.add("hidden");

    document.getElementById("recurring-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.remove("hidden");


    if(currentRide){

        document.getElementById("request-rider").textContent = currentRide.rider;

        document.getElementById("request-pickup").textContent = currentRide.pickup;

        document.getElementById("request-destination").textContent = currentRide.destination;

    }

}
window.showDriverRequest = showDriverRequest;

async function acceptRide(){

    if(!currentRide || !currentRide.id){

        console.error(
            "Cannot accept ride: no active ride."
        );

        return;
    }

    currentRide.status = "DRIVER_ACCEPTED";

    await updateRide(
        currentRide.id,
        {
            status: "DRIVER_ACCEPTED"
        }
    );

    localStorage.setItem(
        "scuberCurrentRide",
        JSON.stringify(currentRide)
    );

    document.getElementById(
        "rider-driver"
    ).textContent =
        currentRide.driver || "";

    document.getElementById(
        "rider-status"
    ).textContent =
        currentRide.status;

    showTripScreen();

    alert(
        "Ride Accepted!\n\n" +
        "Navigation started."
    );
}

window.acceptRide = acceptRide;

function declineRide(){

    alert(
        "Ride Declined.\n\n" +
        "Searching for another driver."
    );

}
function showTripScreen(){

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("welcome-screen")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.add("hidden");

    document.getElementById("driver-trip-screen")
    .classList.remove("hidden");

        let savedRide = JSON.parse(localStorage.getItem("scuberCurrentRide"));

    if(savedRide){

        currentRide = savedRide;

    }


    document.getElementById("driver-trip-pickup").textContent =
    currentRide.pickup;


    document.getElementById("driver-trip-destination").textContent =
    currentRide.destination;

}

function showRiderTripScreen(){

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("main-app")
    .classList.add("hidden");

    document.getElementById("welcome-screen")
    .classList.add("hidden");

    document.getElementById("ride-request-screen")
    .classList.add("hidden");

    document.getElementById("schedule-screen")
    .classList.add("hidden");

    document.getElementById("ride-history-screen")
    .classList.add("hidden");

    document.getElementById("recurring-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.remove("hidden");

        let savedRide = JSON.parse(localStorage.getItem("scuberCurrentRide"));

    if(savedRide){

        currentRide = savedRide;

    }

    document.getElementById("rider-driver").textContent =
    currentRide.driver;

    document.getElementById("rider-pickup").textContent =
    currentRide.pickup;

    document.getElementById("rider-destination").textContent =
    currentRide.destination;
    
    document.getElementById("rider-status").textContent =
    currentRide.status;
 if(currentRide && currentRide.id){

    listenToRide(
        currentRide.id,
        (updatedRide) => {

            currentRide = updatedRide;

            if (updatedRide.driverLocation && window.riderTripMap) {

    const driverLocation =
        updatedRide.driverLocation;

    if (!window.driverMarker) {

        window.driverMarker =
            L.marker([
                driverLocation.lat,
                driverLocation.lon
            ])
            .addTo(window.riderTripMap)
            .bindPopup("🚗 Driver");

    } else {

        window.driverMarker.setLatLng([
            driverLocation.lat,
            driverLocation.lon
        ]);

    }
}
            
            localStorage.setItem(
                "scuberCurrentRide",
                JSON.stringify(updatedRide)
            );

            document.getElementById(
                "rider-driver"
            ).textContent =
                updatedRide.driver || "";

            document.getElementById(
                "rider-pickup"
            ).textContent =
                updatedRide.pickup || "";

            document.getElementById(
                "rider-destination"
            ).textContent =
                updatedRide.destination || "";

            document.getElementById(
                "rider-status"
            ).textContent =
                updatedRide.status || "";
            
    if (updatedRide.status === "TRIP_COMPLETED") {

    localStorage.removeItem("scuberCurrentRide");

    currentRide = null;

    showRiderHome();

}
        }
    );

}   
    initializeLiveTripMap();
}
function sendDriverLocation(){

    if(!currentRide || !currentRide.id){

        console.error(
            "Cannot send driver location: no active ride."
        );

        return;
    }

    if(!navigator.geolocation){

        console.error(
            "Geolocation is not supported by this browser."
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        async function(position){

            const driverLocation = {

                lat: position.coords.latitude,
                lon: position.coords.longitude

            };

            console.log(
                "Driver location:",
                driverLocation
            );

            await updateRide(
                currentRide.id,
                {
                    driverLocation: driverLocation
                }
            );

        },

        function(error){

            console.error(
                "Driver GPS error:",
                error.message
            );

        }

    );
}

function startDriverLocationTracking(){

    if(!currentRide || !currentRide.id){

        console.error(
            "Cannot start GPS tracking: no active ride."
        );

        return;
    }

    if(!navigator.geolocation){

        console.error(
            "Geolocation is not supported by this browser."
        );

        return;
    }

    if(driverLocationWatcher !== null){

        console.log(
            "Driver GPS tracking is already active."
        );

        return;
    }

    driverLocationWatcher =
        navigator.geolocation.watchPosition(

            async function(position){

                const driverLocation = {

                    lat: position.coords.latitude,
                    lon: position.coords.longitude

                };

                console.log(
                    "Live driver location:",
                    driverLocation
                );

                await updateRide(
                    currentRide.id,
                    {
                        driverLocation: driverLocation
                    }
                );

            },

            function(error){

                console.error(
                    "Driver GPS tracking error:",
                    error.message
                );

            },

            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000
            }

        );

    console.log(
        "Driver GPS tracking started."
    );
}

async function startTrip(){

    console.log("START TRIP CLICKED");

    if(!currentRide || !currentRide.id){

        console.error(
            "Cannot start trip: no active ride."
        );

        return;
    }

    currentRide.status = "TRIP_STARTED";

    await updateRide(
        currentRide.id,
        {
            status: "TRIP_STARTED"
        }
    );
    
    startDriverLocationTracking();
    
    localStorage.setItem(
        "scuberCurrentRide",
        JSON.stringify(currentRide)
    );

    document.getElementById(
        "driver-trip-status"
    ).textContent =
        currentRide.status;

    document.getElementById(
        "rider-status"
    ).textContent =
        currentRide.status;

    alert(
        "Trip Started!\n\n" +
        "Scuber navigation is active."
    );
}

window.startTrip = startTrip;

function showRiderCompleteScreen(){

    document.getElementById("driver-trip-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("rider-complete-screen")
    .classList.remove("hidden");


    document.getElementById("complete-driver").textContent =
    currentRide.driver;


    document.getElementById("complete-pickup").textContent =
    currentRide.pickup;


    document.getElementById("complete-destination").textContent =
    currentRide.destination;


    document.getElementById("complete-fare").textContent =
    currentRide.fare.toFixed(2);

}
async function completeTrip(){

    if(!currentRide || !currentRide.id){

        console.error(
            "Cannot complete trip: no active ride."
        );

        return;
    }

    currentRide.status = "TRIP_COMPLETED";

    console.log(
        "Current Ride At Completion:",
        currentRide
    );

    console.log(
        "Ride History Before Push:",
        rideHistory
    );

    rideHistory.push({
        rider: currentRide.rider,
        driver: currentRide.driver,
        pickup: currentRide.pickup,
        destination: currentRide.destination,
        fare: currentRide.fare,
        status: currentRide.status,
        completedAt: new Date().toISOString()
    });

    localStorage.setItem(
        "scuberRideHistory",
        JSON.stringify(rideHistory)
    );

    console.log(
        "Ride History After Push:",
        rideHistory
    );

    await updateRide(
        currentRide.id,
        {
            status: "TRIP_COMPLETED"
        }
    );

    document.getElementById(
        "driver-trip-status"
    ).textContent =
        currentRide.status;

    alert(
        "Trip Completed!\n\n" +
        "Thank you for driving with Scuber."
    );

    currentRide = null;

    localStorage.removeItem(
        "scuberCurrentRide"
    );

    showDriverDashboard();
}

window.completeTrip = completeTrip;
async function showDriverProfile(){

    document.getElementById("driver-dashboard")
        .classList.add("hidden");

    document.getElementById("driver-profile-screen")
        .classList.remove("hidden");

    const user = getCurrentFirebaseUser();

    if (!user) {
        return;
    }

    const profile = await getUserProfile(user.uid);

    if (!profile) {
        return;
    }

    document.getElementById("driver-profile-name").textContent =
        profile.name || "";

    document.getElementById("driver-profile-email").textContent =
        profile.email || "";

    document.getElementById("driver-profile-status").textContent =
        profile.driverStatus || "Not approved";

    document.getElementById("driver-profile-online").textContent =
        profile.onlineStatus || "OFFLINE";
}
async function handleDriveSelection() {

    const user = getCurrentFirebaseUser();

    if (!user) {

        alert(
            "Please sign in before choosing Drive."
        );

        return;
    }

    const profile = await getUserProfile(
        user.uid
    );

    if (!profile) {

        alert(
            "We could not find your SCUBER profile."
        );

        return;
    }

    const driverStatus =
        profile.driverStatus;

    if (driverStatus === "approved") {

        showDriverDashboard();

        return;
    }

    if (driverStatus === "pending") {

        alert(
            "Your driver application is currently under review."
        );

        return;
    }

    startDriverApplication();
}
window.startDriverApplication = startDriverApplication;
window.handleDriveSelection =
    handleDriveSelection;
window.completeTrip = completeTrip;
window.showDriverScreen = showDriverScreen;
window.goOnline = goOnline;
window.goOffline = goOffline;
window.showRideHistory = showRideHistory;
window.showTripScreen = showTripScreen;
window.showDriverEarnings = showDriverEarnings;
window.showDriverProfile = showDriverProfile;
window.selectUser = selectUser;
window.deleteCurrentUser = deleteCurrentUser;
window.openSchedule = openSchedule;
window.confirmRide = confirmRide;
window.showRiderHome = showRiderHome;
window.showWelcomeScreen = showWelcomeScreen;
window.openRecurring = openRecurring;
window.confirmRecurring = confirmRecurring;
window.showMyRecurringRides = showMyRecurringRides;
window.toggleRecurringRide = toggleRecurringRide;
window.deleteRecurringRide = deleteRecurringRide;
window.showAccountScreen = showAccountScreen;
window.showDriverDashboard = showDriverDashboard;
async function RecurringFirebase(){

    let firebaseUser = getCurrentFirebaseUser();

    if(!firebaseUser){

        console.log(
            "No Firebase user available for recurring ride ."
        );

        return;
    }

    let rides = await getRecurringRides(firebaseUser);

    console.log(
        " — Firebase recurring rides:",
        rides
    );
}

window.RecurringFirebase = RecurringFirebase;
async function checkRecurringRidesDue(){

    let firebaseUser = getCurrentFirebaseUser();

    if(!firebaseUser){
        console.log("No Firebase user for recurring ride check.");
        return;
    }

    let rides = await getRecurringRides(firebaseUser);

    let today = new Date();

let dayName = today.toLocaleDateString("en-US", {
    weekday: "long"
});

let currentTime =
    today.toTimeString().slice(0, 5);

    let activeRides = rides.filter(function(ride){

    if(ride.status !== "ACTIVE"){
        return false;
    }

    if(!ride.days || !ride.days.includes(dayName)){
        return false;
    }

    if(!ride.time){
        return false;
    }

    let scheduledMinutes =
        parseInt(ride.time.split(":")[0]) * 60 +
        parseInt(ride.time.split(":")[1]);

    let currentMinutes =
        parseInt(currentTime.split(":")[0]) * 60 +
        parseInt(currentTime.split(":")[1]);

    let difference =
        currentMinutes - scheduledMinutes;

    if(difference < 0 || difference > 15){
    return false;
}

let dateKey =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

let occurrenceId =
    dateKey + "_" + ride.time;

console.log(
    "Recurring occurrence ID:",
    occurrenceId
);
let createdOccurrences = JSON.parse(
    localStorage.getItem("scuberRecurringOccurrences")
) || [];

if(createdOccurrences.includes(occurrenceId)){

    console.log(
        "Recurring ride already created:",
        occurrenceId
    );

    return false;
}
return true;

});

    console.log(
        "Recurring rides active today:",
        activeRides
    );
    console.log(
    "Today is:",
    dayName
);

rides.forEach(function(ride){

    console.log(
        "Saved recurring ride:",
        ride.days,
        "| Time:",
        ride.time,
        "| Status:",
        ride.status
    );

});
    activeRides.forEach(function(ride){

        console.log(
            "Recurring ride:",
            ride.pickup,
            "→",
            ride.destination,
            "at",
            ride.time,
            "| Current time:",
            currentTime
        );
let recurringDateKey =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

let recurringOccurrenceId =
    recurringDateKey + "_" + ride.time;        
let recurringRide = {

    rider: ride.rider,

    pickup: ride.pickup,

    destination: ride.destination,

    status: "WAITING_FOR_DRIVER_ACCEPTANCE",

    recurring: true,

    recurringOccurrenceId:
    recurringOccurrenceId,

    time: ride.time

};
        
currentRide = recurringRide;
        

 localStorage.setItem(
    "scuberCurrentRide",
    JSON.stringify(recurringRide)
);


        let driverAssigned =
    assignAvailableDriver();


    });

    return activeRides;
}

window.checkRecurringRidesDue = checkRecurringRidesDue;

function initializeLiveTripMap() {

    const mapElement =
        document.getElementById("live-trip-map");

    if (!mapElement) {
        return;
    }

    if (mapElement._leaflet_id) {
        return;
    }

    window.riderTripMap = L.map("live-trip-map").setView(
        [36.8529, -75.9780],
        12
    );

    window.driverMarker = null;
    
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(window.riderTripMap);
   

// Use the rider's actual pickup and destination coordinates
const pickupCoordinates =
    currentRide.pickupCoordinates;

const destinationCoordinates =
    currentRide.destinationCoordinates;


// Pickup marker
L.marker([
    pickupCoordinates.lat,
    pickupCoordinates.lon
])
    .addTo(map)
    .bindPopup(
        "📍 Pickup: " +
        currentRide.pickup
    );


// Destination marker
L.marker([
    destinationCoordinates.lat,
    destinationCoordinates.lon
])
    .addTo(map)
    .bindPopup(
        "🏁 Destination: " +
        currentRide.destination
    );


// Show both locations
window.riderTripMap.fitBounds([
    [
        pickupCoordinates.lat,
        pickupCoordinates.lon
    ],
    [
        destinationCoordinates.lat,
        destinationCoordinates.lon
    ]
], {
    padding: [30, 30]
});
}
checkReturningUser();
loadFirebaseWelcome();
