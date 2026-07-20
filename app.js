// ===========================================
// DRIVER FUNCTIONS
// ===========================================// Scuber App - Version 1


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


function confirmRecurring() {

    let pickup = document.getElementById("repeat-pickup").value;
    let destination = document.getElementById("repeat-destination").value;
    let day = document.getElementById("repeat-day").value;
    let time = document.getElementById("repeat-time").value;


    alert(
        "Recurring Ride Saved!\n\n" +
        "Pickup: " + pickup +
        "\nDestination: " + destination +
        "\nEvery: " + day +
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

showWelcomeScreen();

loadUserList();

return true;
}
function showWelcomeScreen(){
    console.log("Welcome screen function loaded");
    
    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("welcome-screen")
    .classList.remove("hidden");

}
function checkReturningUser(){

    let name = localStorage.getItem("scuberUserName");
    let email = localStorage.getItem("scuberUserEmail");

    if(name && email){

    document.getElementById("welcome-name").textContent =
    "Welcome back!";

    loadUserList();

    showWelcomeScreen();

}

}
function loadUserList(){

    let users = JSON.parse(localStorage.getItem("scuberUsers")) || [];

    let list = document.getElementById("user-list");

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

    list.innerHTML = "";
    


    users.forEach(function(user){

       list.innerHTML += `

<button class="schedule"
onclick="selectUser('${user.email}')">

    ${user.email === activeEmail ? "✓ Active<br>" : ""}

    <strong>${user.name}</strong><br>
    ${user.email}

</button>

`;

    });

}
function selectUser(email){

    let users = JSON.parse(localStorage.getItem("scuberUsers")) || [];

    let selectedUser = users.find(function(user){

        return user.email === email;

    });


    if(selectedUser){

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
    "Welcome back, " + selectedUser.name + "!"
);

loadUserList();

showWelcomeScreen();
    }

}

function showModeScreen(){

    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("mode-screen")
    .classList.remove("hidden");

}
function saveUser(name, email){

    let users = JSON.parse(localStorage.getItem("scuberUsers")) || [];

    let existingUser = users.find(function(user){

        return user.email === email;

    });


    if(existingUser){

        existingUser.name = name;
        existingUser.email = email;

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

            <p><strong>Pickup:</strong> ${ride.pickup}</p>

            <p><strong>Destination:</strong> ${ride.destination}</p>

            <p><strong>Fare:</strong> $${ride.fare}</p>

            <p><strong>Status:</strong> ${ride.status}</p>

        </div>

        `;

    });

}
function createAccount(type) {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;


    if(name === "" || email === "") {

        alert("Please enter your name and email.");

        return;
    }


    alert(
        "Welcome to Scuber, " + name + "!\n\n" +
        "Account Type: " + type
    );
    
saveUser(name, email);

document.getElementById("account-screen")
.classList.add("hidden");

showWelcomeScreen();

loadUserList();

}

function showRiderHome() {
    
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
        
    saveUser(name, email);
    document.getElementById("rider-user-name").textContent =
"Welcome, " + name;
        
    console.log("Opening Rider Home");

    document.getElementById("account-screen")
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

}
// ===========================================
// DRIVER FUNCTIONS
// ===========================================
function showDriverScreen() {

    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("driver-screen")
    .classList.remove("hidden");

}

function showDriverDashboard() {
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
    
    document.getElementById("driver-user-name").textContent =
    "Welcome, " + name;
    
    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("old-rider-dashboard")
    .classList.add("hidden");

    document.getElementById("driver-trip-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("driver-screen")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.remove("hidden");

}
function showDriverDashboard() {

    // existing code here

}


function showProfile(){

    

    let name = localStorage.getItem("scuberUserName");
    let email = localStorage.getItem("scuberUserEmail");


    document.getElementById("profile-user-name").textContent =
    "Name: " + name;


    document.getElementById("profile-user-email").textContent =
    "Email: " + email;


    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("profile-screen")
    .classList.remove("hidden");

}
function editProfile(){

    let name = localStorage.getItem("scuberUserName");
    let email = localStorage.getItem("scuberUserEmail");


    let newName = prompt("Enter your name:", name);

    if(newName === null){
        return;
    }


    let newEmail = prompt("Enter your email:", email);

    if(newEmail === null){
        return;
    }


    localStorage.setItem("scuberUserName", newName);
    localStorage.setItem("scuberUserEmail", newEmail);

    saveUser(newName, newEmail);

    showProfile();

}
function saveAvailability() {

    let day = document.getElementById("driver-day").value;
    let start = document.getElementById("driver-start").value;
    let end = document.getElementById("driver-end").value;


    alert(
        "Availability Saved!\n\n" +
        "Day: " + day +
        "\nTime: " + start +
        " - " + end
    );

}
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

let rideHistory = [];
function requestRide(){

    let name = localStorage.getItem("scuberUserName");

    alert("Current user is: " + name);

    document.getElementById("rider-user-name").textContent =
    "Welcome, " + name;

    document.getElementById("ride-request-screen")
    .classList.remove("hidden");

}


function findDriver(){

    let pickup = document.getElementById("now-pickup").value;
    let destination = document.getElementById("now-destination").value;

let driverFound = "Alex";

currentRide.rider = "Toya";
currentRide.driver = driverFound;
currentRide.pickup = pickup;
currentRide.destination = destination;
currentRide.status = "WAITING_FOR_DRIVER_ACCEPTANCE";
currentRide.eta = 8;
currentRide.fare = 18.00;

    alert(
        "Driver Found!\n\n" +
        "Driver: " + driverFound +
        "\nPickup: " + pickup +
        "\nDestination: " + destination
    );
    
showDriverRequest();
    
}

function showDriverRequest(){

    document.getElementById("main-app")
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


function acceptRide(){

    if(currentRide){

        currentRide.status = "DRIVER_ACCEPTED";
        currentRide.driver = "Alex";

        document.getElementById("rider-driver").textContent = currentRide.driver;

        document.getElementById("rider-status").textContent = currentRide.status;

    }
showRiderTripScreen();

    alert(
        "Ride Accepted!\n\n" +
        "Navigation started."
    );

}


function declineRide(){

    alert(
        "Ride Declined.\n\n" +
        "Searching for another driver."
    );

}
function showTripScreen(){

    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("driver-trip-screen")
    .classList.remove("hidden");

}

function showRiderTripScreen(){

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("main-app")
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

}

function startTrip(){
    console.log("START TRIP CLICKED");

    currentRide.status = "TRIP_STARTED";

    document.getElementById("rider-status").textContent = currentRide.status;

    alert(
        "Trip Started!\n\n" +
        "Scuber navigation is active."
    );

}

function completeTrip(){

    currentRide.status = "TRIP_COMPLETED";
    console.log("Current Ride At Completion:", currentRide);
    console.log("Ride History Before Push:", rideHistory);
    rideHistory.push({
        rider: currentRide.rider,
        driver: currentRide.driver,
        pickup: currentRide.pickup,
        destination: currentRide.destination,
        fare: currentRide.fare,
        status: currentRide.status
    });
    console.log("Ride History After Push:", rideHistory);
    document.getElementById("rider-status").textContent = currentRide.status;

    alert(
        "Trip Completed!\n\n" +
        "Thank you for driving with Scuber."
    );

}
document.addEventListener("DOMContentLoaded", function(){

    checkReturningUser();

});
